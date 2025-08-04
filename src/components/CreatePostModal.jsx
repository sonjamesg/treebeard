import React, { useState, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, Video, UserPlus, CheckCircle, X, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import Slider from "react-slick";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: mediaPreviews.length > 1,
  };

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
    let allowedNewFilesCount;
    if (firstFileType === 'image') {
      allowedNewFilesCount = 5 - currentFileCount;
    } else {
      allowedNewFilesCount = 1 - currentFileCount;
    }

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
      if (file.size > 25 * 1024 * 1024) { // 25MB limit per file
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
    const newMediaFiles = [...mediaFiles];
    const newMediaPreviews = [...mediaPreviews];
    newMediaFiles.splice(index, 1);
    newMediaPreviews.splice(index, 1);
    setMediaFiles(newMediaFiles);
    setMediaPreviews(newMediaPreviews);

    if (newMediaFiles.length === 0) {
      setMediaType(null);
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim() && mediaFiles.length === 0) {
      toast({ title: "Empty post", description: "Please add a caption or media to your post.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const mediaUrls = await Promise.all(mediaFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));

      const newPost = {
        id: Date.now().toString(),
        author: { id: user.id, username: user.username, avatar: user.avatar },
        caption: caption.trim(),
        mediaUrls: mediaUrls,
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
      if (error.name === 'QuotaExceededError') {
        toast({ title: "Storage Full", description: "Cannot create post, local storage is full. Please clear some old posts.", variant: "destructive" });
      } else {
        toast({ title: "Failed to create post", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTagUsers = () => {
    setShowTagUsersModal(true);
  };
  
  const onTagUsersConfirm = (selectedUsers) => {
    setTaggedUsers(selectedUsers);
    setShowTagUsersModal(false);
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setMediaFiles([]);
      setMediaPreviews([]);
    }
  };

  const handleNext = () => {
    if (mediaFiles.length > 0) {
      setStep(2);
    } else {
      toast({ title: "No media selected", description: "Please select photos or a video to continue.", variant: "destructive" });
    }
  };
  
  const renderStepOne = () => (
    <div className="flex flex-col h-full">
      <DialogHeader className="relative flex-shrink-0 border-b border-white/10 p-3 flex-row items-center justify-between">
         <DialogClose asChild>
          <Button variant="ghost">Close</Button>
        </DialogClose>
        <DialogTitle className="font-semibold text-white">New Post</DialogTitle>
        <Button onClick={handleNext} className="floating-button h-8 px-4 text-sm text-black">Next</Button>
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
              <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeMedia(index)}>
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
      <input id="media-upload-grid" type="file" accept="image/*,video/*" onChange={handleFileSelect} multiple className="hidden" />
    </div>
  );

  const renderStepTwo = () => (
    <div className="flex flex-col md:flex-row h-full">
      <div className="relative w-full bg-black md:w-[60%] rounded-bl-lg">
        {mediaPreviews.length > 0 && (
          <Slider {...sliderSettings} className="h-full">
            {mediaPreviews.map((preview, index) => (
              <div key={index} className="relative h-[400px] md:h-full">
                {mediaType === 'image' ? (
                  <img src={preview} alt={`Preview ${index + 1}`} className="object-contain w-full h-full" />
                ) : (
                  <video src={preview} controls className="object-contain w-full h-full" />
                )}
              </div>
            ))}
          </Slider>
        )}
      </div>
      <div className="flex flex-col w-full p-4 md:w-[40%]">
        <div className="flex items-center mb-4 space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-white">{user.username}</span>
        </div>
        <Textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="flex-grow text-white border-white/20 glass-effect placeholder:text-white/50"
          maxLength={2200}
        />
        <p className="mt-1 mb-4 text-sm text-right text-white/50">{caption.length}/2200</p>
        
        <Button variant="ghost" onClick={handleTagUsers} className="justify-start w-full p-2 text-white/80 rounded-lg hover:bg-white/10">
          <UserPlus className="w-5 h-5 mr-2" />
          Tag people
        </Button>
        {taggedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {taggedUsers.map(u => (
              <div key={u.id} className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-full bg-white/20">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={u.avatar} alt={u.username} />
                  <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                {u.username}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="glass-effect p-0 border-white/20 sm:max-w-4xl max-w-full w-full h-full sm:h-[80vh] sm:w-[90vw] flex flex-col" onInteractOutside={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {mediaPreviews.length === 0 && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-center min-h-[400px] p-8 text-center"
              >
                <DialogClose asChild>
                   <Button variant="ghost" className="absolute left-4 top-4">Close</Button>
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
                <input id="media-upload" type="file" accept="image/*,video/*" onChange={handleFileSelect} multiple className="hidden" />
              </motion.div>
            )}

            {mediaPreviews.length > 0 && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {step === 1 && renderStepOne()}
                {step === 2 && (
                  <>
                    <DialogHeader className="relative flex items-center justify-between flex-shrink-0 p-3 border-b border-white/10">
                      <Button variant="ghost" size="icon" onClick={handleBack} className="absolute left-3 top-1/2 -translate-y-1/2"><ArrowLeft className="w-5 h-5" /></Button>
                      <DialogTitle className="flex-1 font-semibold text-center text-white">Create New Post</DialogTitle>
                      <Button onClick={handleSubmit} disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 px-4 text-sm text-black floating-button">{loading ? 'Sharing...' : 'Share'}</Button>
                    </DialogHeader>
                    {renderStepTwo()}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      <TagUsersModal 
        open={showTagUsersModal}
        onOpenChange={setShowTagUsersModal}
        onConfirm={onTagUsersConfirm}
        initialTaggedUsers={taggedUsers}
      />
    </>
  );
};

const TagUsersModal = ({ open, onOpenChange, onConfirm, initialTaggedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState(initialTaggedUsers);
    const { user: currentUser } = useAuth();
  
    useEffect(() => {
        if (open) {
          const usersData = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
          // Filter out the current user from the list
          setAllUsers(usersData.filter(u => u.id !== currentUser.id));
          setSelectedUsers(initialTaggedUsers);
        }
    }, [open, initialTaggedUsers, currentUser.id]);

    const handleToggleUser = (userToToggle) => {
        setSelectedUsers(prev => {
            const isSelected = prev.some(u => u.id === userToToggle.id);
            if (isSelected) {
                return prev.filter(u => u.id !== userToToggle.id);
            } else {
                return [...prev, userToToggle];
            }
        });
    };
  
    const filteredUsers = allUsers.filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConfirm = () => {
        onConfirm(selectedUsers);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-effect p-0 border-white/20 sm:max-w-md">
                <DialogHeader className="p-4 border-b border-white/10">
                    <DialogTitle className="text-white text-center">Tag People</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <Input 
                            placeholder="Search for people..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 glass-effect border-white/20 text-white"
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredUsers.map(u => {
                            const isSelected = selectedUsers.some(su => su.id === u.id);
                            return (
                                <div key={u.id} onClick={() => handleToggleUser(u)} className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-white/10">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={u.avatar} alt={u.username} />
                                            <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-white">{u.username}</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-white/50'}`}>
                                      {isSelected && <CheckCircle className="w-4 h-4 text-white"/>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t border-white/10">
                    <Button onClick={handleConfirm} className="floating-button text-black">Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePostModal;