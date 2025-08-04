import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/AddProductModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Marketplace = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('socialvibe_products') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    
    const productsWithSellerInfo = storedProducts.map(product => {
      const seller = allUsers.find(u => u.id === product.sellerId);
      return {
        ...product,
        seller: seller ? {
          username: seller.username,
          avatar: seller.avatar
        } : {
          username: 'Unknown',
          avatar: ''
        }
      };
    });
    setProducts(productsWithSellerInfo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductAdded = () => {
    loadProducts();
  };

  const handleProductDeleted = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    const rawProducts = JSON.parse(localStorage.getItem('socialvibe_products') || '[]');
    const filteredRawProducts = rawProducts.filter(p => p.id !== productId);
    localStorage.setItem('socialvibe_products', JSON.stringify(filteredRawProducts));
    toast({ title: "Listing Removed", description: "The product listing has been successfully deleted." });
  };

  const handleProductSaved = (productId) => {
    const savedItems = JSON.parse(localStorage.getItem(`saved_items_${user.id}`) || '{"posts": [], "products": []}');
    if (!savedItems.products.includes(productId)) {
      savedItems.products.push(productId);
      toast({ title: "Listing Saved!", description: "You can find it in your Saved items." });
    } else {
      savedItems.products = savedItems.products.filter(id => id !== productId);
      toast({ title: "Listing Unsaved", description: "Removed from your Saved items." });
    }
    localStorage.setItem(`saved_items_${user.id}`, JSON.stringify(savedItems));
    // We need to trigger a re-render on the card, but the logic is within the card itself.
    // This is a simple way to let the page know something changed.
    loadProducts();
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <>
      <Helmet>
        <title>Marketplace - TreeBeard</title>
        <meta name="description" content="Browse and list items for sale on the TreeBeard marketplace." />
      </Helmet>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Marketplace</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input 
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button onClick={() => setShowAddProductModal(true)} className="floating-button text-black font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>
        </motion.div>

        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleProductDeleted}
                onSave={handleProductSaved}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-white mb-2">No Listings Found</h2>
              <p className="text-white/70">
                {searchTerm ? "Try adjusting your search term." : "Be the first to add something to the marketplace!"}
              </p>
            </div>
          </div>
        )}
      </div>
      <AddProductModal 
        open={showAddProductModal}
        onOpenChange={setShowAddProductModal}
        onProductAdded={handleProductAdded}
      />
    </>
  );
};

export default Marketplace;