import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InitialStep = ({ onFileSelect, onOpenChange }) => {
  return (
    <motion.div
      key="initial"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col justify-center min-h-[400px] p-8 text-center"
    >
      <DialogClose asChild>
        <Button variant="ghost" className="absolute left-4 top-4" onClick={() => onOpenChange(false)}>Close</Button>
      </DialogClose>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-700 to-gray-900">
          <ImageIcon className="w-8 h-8 text-white" />
          <Video className="w-8 h-8 ml-1 text-white" />
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-white">Upload Photos or Video</h3>
          <p className="mb-4 text-sm text-white/60">You can upload up to 5 photos or 1 video.</p>
          <label htmlFor="media-upload" className="w-full">
            <Button type="button" variant="outline" className="w-full text-white border-white/20 glass-effect hover:bg-white/10" asChild>
              <span>Select from computer</span>
            </Button>
          </label>
        </div>
      </div>
      <input id="media-upload" type="file" accept="image/*,video/*" onChange={onFileSelect} multiple className="hidden" />
    </motion.div>
  );
};

export default InitialStep;