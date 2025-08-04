import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, X } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const MediaSelectionStep = ({ mediaPreviews, mediaType, onFileSelect, onNext, onRemoveMedia, onOpenChange }) => {
  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="relative flex-shrink-0 border-b border-white/10 p-3 flex-row items-center justify-between">
        <DialogClose asChild>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogClose>
        <DialogTitle className="font-semibold text-white">New Post</DialogTitle>
        <Button onClick={onNext} className="floating-button h-8 px-4 text-sm text-black">Next</Button>
      </DialogHeader>
      <div className="flex-grow overflow-y-auto p-4">
        <h3 className="mb-4 font-semibold text-white">Select Media ({mediaPreviews.length}/5)</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {mediaPreviews.map((preview, index) => (
            <motion.div
              key={preview}
              className="relative cursor-pointer overflow-hidden rounded-lg aspect-square"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <img src={preview} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/30"></div>
              <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => onRemoveMedia(index)}>
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
          {mediaPreviews.length < 5 && mediaType !== 'video' && (
            <label htmlFor="media-upload-grid" className="flex items-center justify-center transition-colors rounded-lg cursor-pointer aspect-square bg-white/10 hover:bg-white/20">
              <ImageIcon className="w-8 h-8 text-white/70" />
            </label>
          )}
        </div>
      </div>
      <input id="media-upload-grid" type="file" accept="image/*,video/*" onChange={onFileSelect} multiple className="hidden" />
    </div>
  );
};

export default MediaSelectionStep;