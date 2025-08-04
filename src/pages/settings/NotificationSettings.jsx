import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Heart, MessageSquare, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    newFollowers: true,
    messages: true,
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      description: "🚧 This feature isn't fully implemented yet. Your preference is saved locally for this session. 🚀",
    });
  };

  const notificationOptions = [
    { id: 'likes', label: 'Likes', icon: Heart, description: 'When someone likes your post.' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, description: 'When someone comments on your post.' },
    { id: 'newFollowers', label: 'New Followers', icon: UserPlus, description: 'When someone new follows you.' },
    { id: 'messages', label: 'Direct Messages', icon: MessageSquare, description: 'When you receive a new message.' },
  ];

  return (
    <>
      <Helmet>
        <title>Notification Settings - TreeBeard</title>
        <meta name="description" content="Manage your notification settings on TreeBeard." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/settings" className="flex items-center space-x-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Settings</span>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
          </div>
          <p className="text-white/70 mb-8">Choose which notifications you want to receive.</p>
          
          <div className="glass-effect rounded-xl p-6 space-y-4">
            {notificationOptions.map(option => {
              const Icon = option.icon;
              return (
                <div key={option.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                  <div className="flex items-center space-x-4">
                    <Icon className="w-5 h-5 text-white/80" />
                    <div>
                      <Label htmlFor={option.id} className="text-base font-medium text-white">{option.label}</Label>
                      <p className="text-sm text-white/60">{option.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={option.id}
                    checked={notifications[option.id]}
                    onCheckedChange={() => handleToggle(option.id)}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotificationSettings;