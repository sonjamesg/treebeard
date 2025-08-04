import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, TrendingUp, Image, Clock } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = [...posts];
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (activeTab) {
      case 'trending':
        filtered.sort((a, b) => ((b.likes?.length || 0) + (b.comments?.length || 0)) - ((a.likes?.length || 0) + (a.comments?.length || 0)));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
      default:
        break;
    }
    setFilteredPosts(filtered);
  }, [posts, searchTerm, activeTab]);

  const loadPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    setPosts(savedPosts);
  };
  
  const handlePostUpdate = (updatedPost) => {
    const updatedPosts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
    setPosts(updatedPosts);
  };
  
  const handleDeletePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const updatedPosts = allPosts.filter(p => p.id !== postId);
    localStorage.setItem('socialvibe_posts', JSON.stringify(updatedPosts));
    setPosts(posts.filter(p => p.id !== postId));
    toast({ title: "Post Deleted", description: "The post has been removed successfully." });
  };

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'popular', label: 'Popular', icon: Image }
  ];

  return (
    <>
      <Helmet><title>Explore - TreeBeard</title><meta name="description" content="Discover trending posts and explore content from the TreeBeard community." /></Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">Explore</h1><p className="text-white/70">Discover amazing content from the community</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-white/50" /><Input placeholder="Search posts or users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50 search-glow" /></div></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8"><div className="flex space-x-1 glass-effect rounded-xl p-1">{tabs.map((tab) => <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} onClick={() => setActiveTab(tab.id)} className={`flex-1 relative ${activeTab === tab.id ? 'floating-button text-black' : 'text-white/70 hover:text-white hover:bg-white/10'}`}><tab.icon className="w-4 h-4 mr-2" />{tab.label}</Button>)}</div></motion.div>
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} onDelete={handleDeletePost} />)
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><div className="glass-effect rounded-2xl p-8"><div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center"><Search className="w-12 h-12 text-white" /></div><h2 className="text-xl font-semibold text-white mb-2">{searchTerm ? 'No posts found' : 'No posts yet'}</h2><p className="text-white/70">{searchTerm ? 'Try adjusting your search terms' : 'Be the first to share something amazing!'}</p></div></motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;