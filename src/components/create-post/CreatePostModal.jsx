import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InitialStep from '@/components/create-post/InitialStep';
import MediaSelectionStep from '@/components/create-post/MediaSelectionStep';
import CaptionStep from '@/components/create-post/CaptionStep';
import TagUsersModal from '@/components/create-post/TagUsersModal';

const CreatePostModal = ({ open, onOpenChange, onPostCreated }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showTagUsersModal, setShowTagUsersModal] = useState(false);

  const resetState = () => {
    setCaption('');
    setMediaFiles([]);
    setMediaPreviews([]);
    setMediaType(null);
    setLoading(false);
    setStep(1);
    setTaggedUsers([]);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const firstFileType = files[0].type.startsWith('image/') ? 'image' : (files[0].type.startsWith('video/') ? 'video' : null);

    if (firstFileType === null) {
      toast({ title: "Invalid file type", description: "Please select image or video files.", variant: "destructive" });
      return;
    }

    if (firstFileType === 'video' && (files.length > 1 || mediaFiles.length > 0)) {
      toast({ title: "Unsupported Upload", description: "You can only upload one video at a time.", variant: "destructive" });
      return;
    }

    const currentFileCount = mediaFiles.length;
    let allowedNewFilesCount = (firstFileType === 'image') ? 5 - currentFileCount : 1 - currentFileCount;

    if (files.length > allowedNewFilesCount) {
      toast({ title: "Too many files", description: `You can only select ${allowedNewFilesCount} more files.`, variant: "destructive" });
      files.splice(allowedNewFilesCount);
    }

    const previews = [];
    const newFiles = [];

    for (const file of files) {
      const currentFileType = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : null);
      if (mediaType && mediaType !== currentFileType) {
        toast({ title: "Mixed file types", description: `Cannot mix photos and videos. Please upload only ${mediaType}s.`, variant: "destructive" });
        continue;
      }
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        toast({ title: `File ${file.name} is too large`, description: "Please select files smaller than 25MB.", variant: "destructive" });
        continue;
      }
      newFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }
    
    if (newFiles.length > 0) {
      setMediaType(firstFileType);
      setMediaFiles(prev => [...prev, ...newFiles]);
      setMediaPreviews(prev => [...prev, ...previews]);
    }
  };
  
  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    if (mediaFiles.length === 1) setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!caption.trim() && mediaFiles.length === 0) {
      toast({ title: "Empty post", description: "Please add a caption or media to your post.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const mediaUrls = await Promise.all(mediaFiles.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));

      const newPost = {
        id: Date.now().toString(),
        author: { id: user.id, username: user.username, avatar: user.avatar },
        caption: caption.trim(),
        mediaUrls,
        mediaType,
        likes: [],
        comments: [],
        taggedUsers: taggedUsers.map(u => ({ id: u.id, username: u.username })),
        createdAt: new Date().toISOString()
      };

      const posts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('socialvibe_posts', JSON.stringify(posts));

      const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].postsCount = (users[userIndex].postsCount || 0) + 1;
        localStorage.setItem('socialvibe_users', JSON.stringify(users));
      }

      toast({ title: "Post created!", description: "Your post has been shared." });
      if (onPostCreated) onPostCreated();
      handleOpenChange(false);
      navigate('/', { replace: true, state: { refresh: true } });

    } catch (error) {
      toast({ title: "Failed to create post", description: error.name === 'QuotaExceededError' ? "Storage is full." : "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (mediaFiles.length > 0) setStep(2);
    else toast({ title: "No media selected", description: "Please select photos or a video to continue.", variant: "destructive" });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else {
      setMediaFiles([]);
      setMediaPreviews([]);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false} className="glass-effect p-0 border-white/20 sm:max-w-4xl max-w-full w-full h-full sm:h-[80vh] sm:w-[90vw] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {mediaPreviews.length === 0 ? (
              <InitialStep key="initial" onFileSelect={handleFileSelect} onOpenChange={onOpenChange} />
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                {step === 1 ? (
                  <MediaSelectionStep
                    mediaPreviews={mediaPreviews}
                    mediaType={mediaType}
                    onFileSelect={handleFileSelect}
                    onNext={handleNext}
                    onRemoveMedia={removeMedia}
                    onOpenChange={onOpenChange}
                  />
                ) : (
                  <CaptionStep
                    user={user}
                    caption={caption}
                    setCaption={setCaption}
                    mediaPreviews={mediaPreviews}
                    mediaType={mediaType}
                    taggedUsers={taggedUsers}
                    loading={loading}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    onTagUsers={() => setShowTagUsersModal(true)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      <TagUsersModal 
        open={showTagUsersModal}
        onOpenChange={setShowTagUsersModal}
        onConfirm={setTaggedUsers}
        initialTaggedUsers={taggedUsers}
      />
    </>
  );
};

export default CreatePostModal;