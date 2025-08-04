import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const MobileBottomNav = ({ onShowCreatePost }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { icon: Home, path: '/' },
    { icon: Search, path: '/explore' },
    { icon: PlusSquare, action: onShowCreatePost },
    { icon: User, path: `/profile/${user.username}` },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 h-16 nav-blur border-t border-white/10 lg:hidden z-50"
    >
      <div className="flex justify-around items-center h-full">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;

          const content = (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-white/70")} />
              {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
            </div>
          );

          if (item.action) {
            return (
              <button key={index} onClick={item.action} className="flex-1 h-full">
                {content}
              </button>
            );
          }

          return (
            <Link key={item.path || index} to={item.path} className="flex-1 h-full">
              {content}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;