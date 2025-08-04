import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

const Saved = () => {
  return (
    <>
      <Helmet>
        <title>Saved Posts - JamesGram</title>
        <meta name="description" content="View your saved posts on JamesGram." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="glass-effect rounded-2xl p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Saved Posts</h1>
            <p className="text-white/70">
              You haven't saved any posts yet.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Saved;