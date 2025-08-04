import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import CreatePostModal from '@/components/create-post/CreatePostModal';

const Layout = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = () => {
    // This is a placeholder to be passed to CreatePostModal if needed
    // For now, it will just close the modal.
    // The Home component has its own logic to refresh posts.
  };

  return (
    <div className="min-h-screen">
      <Navbar onShowCreatePost={() => setShowCreatePost(true)} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-16 pb-20 sm:pb-0">
          <Outlet context={{ onShowCreatePost: () => setShowCreatePost(true) }} />
        </main>
      </div>
      <MobileBottomNav onShowCreatePost={() => setShowCreatePost(true)} />
      <CreatePostModal 
        open={showCreatePost} 
        onOpenChange={setShowCreatePost}
        onPostCreated={handlePostCreated} 
      />
    </div>
  );
};

export default Layout;