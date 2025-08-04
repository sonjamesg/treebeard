import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Heart, MessageCircle, Bookmark, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Heart, label: 'Notifications', path: '/notifications' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: `/profile/${user.username}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.aside 
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-effect border-r border-white/10 hidden lg:block z-40"
    >
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 transition-transform group-hover:scale-110",
                  isActive && "text-white"
                )} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-tab"
                    className="absolute left-0 w-1 h-full bg-white rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 rounded-xl glass-effect">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 p-0.5">
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-white/60 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;