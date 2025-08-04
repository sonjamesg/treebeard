import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { X, Image as ImageIcon } from 'lucide-react';

const AddProductModal = ({ open, onOpenChange, onProductAdded, productToEdit }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const isEditing = !!productToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price || '');
      setLocation(productToEdit.location || '');
      setCategory(productToEdit.category || '');
      // Note: We can't re-populate the file input, but we can show existing images.
      setImagePreviews(productToEdit.imageUrls || []);
    }
  }, [productToEdit, isEditing]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setCategory('');
    setImages([]);
    setImagePreviews([]);
    setLoading(false);
  };

  const handleClose = (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast({ title: "Too many images", description: "You can upload a maximum of 5 images.", variant: "destructive" });
      return;
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // This logic needs to handle both new files and existing URLs if editing
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // For new files, we also need to remove from the files array
    const previewToRemove = imagePreviews[index];
    if (previewToRemove.startsWith('blob:')) {
      const imageIndexInFiles = images.findIndex(file => URL.createObjectURL(file) === previewToRemove);
      if (imageIndexInFiles > -1) {
        setImages(prev => prev.filter((_, i) => i !== imageIndexInFiles));
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      toast({ title: "Missing fields", description: "Please fill in the title and description.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const imageUrls = await Promise.all(images.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));
      
      // When editing, combine old and new images
      const finalImageUrls = isEditing 
        ? [...imagePreviews.filter(p => !p.startsWith('blob:')), ...imageUrls]
        : imageUrls;

      const productData = {
        id: isEditing ? productToEdit.id : Date.now().toString(),
        sellerId: user.id,
        title,
        description,
        price,
        location,
        category,
        imageUrls: finalImageUrls,
        createdAt: isEditing ? productToEdit.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const products = JSON.parse(localStorage.getItem('socialvibe_products') || '[]');
      
      if (isEditing) {
        const productIndex = products.findIndex(p => p.id === productToEdit.id);
        if (productIndex > -1) {
          products[productIndex] = productData;
        }
      } else {
        products.unshift(productData);
      }

      localStorage.setItem('socialvibe_products', JSON.stringify(products));
      toast({ title: isEditing ? "Listing Updated!" : "Listing Posted!", description: "Your product is now live on the marketplace." });
      onProductAdded();
      handleClose(false);
    } catch (error) {
      toast({ title: "Error", description: "Could not save the listing. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-effect border-white/20 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditing ? 'Edit Listing' : 'Add a Product'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-white/80">Product Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="glass-effect border-white/20 text-white" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-white/80">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="glass-effect border-white/20 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-white/80">Price (Optional)</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="glass-effect border-white/20 text-white" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-white/80">Location (Optional)</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="glass-effect border-white/20 text-white" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-white/80">Category (Optional)</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="glass-effect border-white/20 text-white" />
          </div>
          <div className="grid gap-2">
            <Label className="text-white/80">Images (up to 5)</Label>
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt="preview" className="w-full h-24 object-cover rounded-md" />
                  <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <Label htmlFor="images" className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:bg-white/10">
                  <ImageIcon className="w-8 h-8 text-white/50" />
                </Label>
              )}
            </div>
            <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading} className="floating-button text-black">
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Post Listing')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;