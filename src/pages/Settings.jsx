import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Lock, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Settings = () => {
  const settingsOptions = [
    { icon: User, label: 'Account', description: 'Manage your account details.', link: '/settings/account' },
    { icon: Lock, label: 'Privacy & Security', description: 'Control your privacy settings.', link: '/settings/privacy' },
    { icon: Bell, label: 'Notifications', description: 'Adjust your notification preferences.', link: '/settings/notifications' },
  ];

  return (
    <>
      <Helmet>
        <title>Settings - TreeBeard</title>
        <meta name="description" content="Manage your settings on TreeBeard." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-white/70">Manage your account and preferences</p>
        </motion.div>

        <div className="space-y-4">
          {settingsOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={option.link} className="block">
                  <div className="glass-effect rounded-xl p-6 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Icon className="w-6 h-6 text-white/80" />
                      <div>
                        <h2 className="text-lg font-semibold text-white">{option.label}</h2>
                        <p className="text-sm text-white/60">{option.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/70" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Settings;