import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useLocation, useOutletContext } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const { onShowCreatePost } = useOutletContext();

  useEffect(() => {
    loadPosts();
  }, [user, location.key]);
  
  const loadPosts = () => {
    if (!user) return;
    const allPosts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const followingPosts = allPosts.filter(p => user.following.includes(p.author.id) || p.author.id === user.id);
    const sortedPosts = followingPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(sortedPosts);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };
  
  const handleDeletePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const updatedPosts = allPosts.filter(p => p.id !== postId);
    localStorage.setItem('socialvibe_posts', JSON.stringify(updatedPosts));
    setPosts(posts.filter(p => p.id !== postId));
    toast({ title: "Post Deleted", description: "The post has been removed successfully." });
  };

  return (
    <>
      <Helmet>
        <title>Home - TreeBeard</title>
        <meta name="description" content="Discover and share amazing moments with your friends on TreeBeard." />
      </Helmet>
      <div className="max-w-2xl mx-auto p-4 sm:pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 hidden sm:block">
          <div className="glass-effect rounded-2xl p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user.username}! 👋</h1>
            <p className="text-white/70 mb-4">Share your moments and discover what your friends are up to</p>
            <Button onClick={onShowCreatePost} className="floating-button text-black font-semibold"><PlusSquare className="w-4 h-4 mr-2" />Create Post</Button>
          </div>
        </motion.div>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} onDelete={handleDeletePost} />
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 hidden sm:block">
              <div className="glass-effect rounded-2xl p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center"><PlusSquare className="w-12 h-12 text-white" /></div>
                <h2 className="text-xl font-semibold text-white mb-2">Your Feed is Empty</h2>
                <p className="text-white/70 mb-4">Follow people to see their posts here or explore to find new friends!</p>
                <Button onClick={onShowCreatePost} className="floating-button text-black font-semibold">Create Your First Post</Button>
              </div>
            </motion.div>
          )}
           {posts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 sm:hidden">
              <div className="glass-effect rounded-2xl p-8">
                 <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center"><PlusSquare className="w-12 h-12 text-white" /></div>
                <h2 className="text-xl font-semibold text-white mb-2">Your Feed is Empty</h2>
                <p className="text-white/70">Follow others or create a post to get started!</p>
              </div>
            </motion.div>
           )}
        </div>
      </div>
    </>
  );
};

export default Home;