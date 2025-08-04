import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, MessageSquare, Bookmark, MoreVertical, Trash2, Edit, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import MessageSellerModal from '@/components/MessageSellerModal';
import AddProductModal from '@/components/AddProductModal';

const ProductCard = ({ product, onDelete, onSave }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(`saved_items_${user.id}`) || '{"posts": [], "products": []}');
    setIsSaved(savedItems.products.includes(product.id));
  }, [product.id, user.id]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(product.id);
    setIsSaved(!isSaved);
  };

  const handleDeleteClick = () => {
    onDelete(product.id);
  };

  const handleReportClick = () => {
    toast({ title: "Listing Reported", description: "Thank you for your feedback. We will review this listing." });
  };

  const handleEditSuccess = () => {
    // This would ideally refetch data, for now we can just close
    setShowEditModal(false);
    // A page-level refresh would be better, but this is a simple solution
    window.location.reload();
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="post-card rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="relative">
          <img 
            class="w-full h-56 object-cover"
            alt={product.title}
           src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={handleSaveClick} className="glass-effect rounded-full w-10 h-10 hover:bg-white/20">
              <Bookmark className={`w-5 h-5 text-white transition-colors ${isSaved ? 'fill-white' : ''}`} />
            </Button>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-white truncate">{product.title}</h3>
            <p className="text-white/70 text-sm mt-1 mb-3 h-10 overflow-hidden">{product.description}</p>
            {product.price && (
              <div className="flex items-center text-green-400 font-semibold mb-3">
                <DollarSign className="w-5 h-5 mr-1" />
                <span>{product.price}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <Link to={`/profile/${product.seller.username}`} className="flex items-center gap-2 group">
              <Avatar className="w-8 h-8">
                <AvatarImage src={product.seller.avatar} />
                <AvatarFallback>{product.seller.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-white/80 group-hover:text-white transition-colors">{product.seller.username}</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-effect border-white/20">
                {(user.id === product.sellerId || user.role === 'admin') && (
                  <>
                    <DropdownMenuItem onClick={() => setShowEditModal(true)} className="cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={handleReportClick} className="cursor-pointer"><Flag className="mr-2 h-4 w-4" /> Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-4 pt-0">
          <Button onClick={() => setShowMessageModal(true)} className="w-full floating-button text-black font-semibold">
            <MessageSquare className="w-5 h-5 mr-2" />
            Message Seller
          </Button>
        </div>
      </motion.div>
      <MessageSellerModal 
        open={showMessageModal}
        onOpenChange={setShowMessageModal}
        productName={product.title}
        sellerEmail={product.seller.email}
      />
      {showEditModal && (
        <AddProductModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onProductAdded={handleEditSuccess}
          productToEdit={product}
        />
      )}
    </>
  );
};

export default ProductCard;