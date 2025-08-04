import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const Notifications = () => {
  return (
    <>
      <Helmet>
        <title>Notifications - JamesGram</title>
        <meta name="description" content="View your notifications on JamesGram." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="glass-effect rounded-2xl p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
              <Bell className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-white/70">
              This is where you'll see updates about your account.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Notifications;