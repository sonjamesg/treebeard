import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const initializeDemoData = () => {
  try {
    const usersExist = localStorage.getItem('socialvibe_users');
    if (!usersExist) {
      const demoUser = {
        id: 'demo-user',
        username: 'demo_user',
        email: 'demo@treebeard.com',
        password: 'demo123',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        bio: 'Just a demo user exploring TreeBeard!',
        website: 'https://treebeard.io',
        role: 'user',
        followers: [],
        following: [],
        postsCount: 1,
        createdAt: new Date().toISOString()
      };

      const adminUser = {
        id: 'admin-user',
        username: 'admin',
        email: 'james@jstudios.co.uk',
        password: 'Bravo2zero!',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Platform Administrator',
        website: '',
        role: 'admin',
        followers: [],
        following: [],
        postsCount: 0,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('socialvibe_users', JSON.stringify([demoUser, adminUser]));
    }

    const postsExist = localStorage.getItem('socialvibe_posts');
    if (!postsExist) {
      const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
      const demoUser = users.find(u => u.id === 'demo-user');
      if (demoUser) {
        const demoPosts = [
          {
            id: 'demo-post-1',
            author: { id: demoUser.id, username: demoUser.username, avatar: demoUser.avatar },
            caption: 'Welcome to TreeBeard! 🎉 This is your first post. Share your amazing moments with the world!',
            mediaUrls: ['https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=600&fit=crop'],
            mediaType: 'image',
            likes: [],
            comments: [],
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('socialvibe_posts', JSON.stringify(demoPosts));
      }
    }

  } catch (error) {
    if (error.name === 'QuotaExceededError') {
        console.warn("Could not initialize demo data, localStorage quota exceeded. Clearing old data and retrying.");
        localStorage.removeItem('socialvibe_posts');
        localStorage.removeItem('socialvibe_users');
    } else {
        console.error("An error occurred during app initialization:", error);
    }
  }
};

initializeDemoData();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);