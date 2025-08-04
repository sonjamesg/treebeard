
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const EditProfileModal = ({ open, onOpenChange, user, onProfileUpdate }) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', bio: '', avatar: '', website: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        website: user.website || ''
      });
    }
  }, [user]);

  if (!user) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = updateUser(formData);
      if (success) {
        onProfileUpdate(formData);
        toast({ title: "Profile updated", description: "Your changes have been saved." });
        onOpenChange(false);
      } else {
        throw new Error("Update failed.");
      }
    } catch (error) {
      toast({ title: "Update failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ title: "Image too large", description: "Please select an image smaller than 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/20 max-w-md">
        <DialogHeader><DialogTitle className="text-white text-center">Edit Profile</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full profile-gradient p-1">
                <Avatar className="w-full h-full">
                  <AvatarImage src={formData.avatar} alt={formData.username} />
                  <AvatarFallback className="text-xl">{formData.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
              <Button type="button" onClick={triggerFileSelect} size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full floating-button"><Camera className="w-4 h-4" /></Button>
            </div>
            <p className="text-white/60 text-sm text-center">Click the camera icon to change your avatar</p>
          </div>
          <div className="space-y-2"><Label htmlFor="username" className="text-white">Username</Label><Input id="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="glass-effect border-white/20 text-white placeholder:text-white/50" required /></div>
          <div className="space-y-2"><Label htmlFor="website" className="text-white">Website</Label><Input id="website" placeholder="https://your-website.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="glass-effect border-white/20 text-white placeholder:text-white/50" /></div>
          <div className="space-y-2"><Label htmlFor="bio" className="text-white">Bio</Label><Textarea id="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="glass-effect border-white/20 text-white placeholder:text-white/50" maxLength={150} /><p className="text-white/50 text-sm text-right">{formData.bio?.length || 0}/150</p></div>
          <div className="flex space-x-3"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 glass-effect border-white/20 text-white hover:bg-white/10">Cancel</Button><Button type="submit" disabled={loading} className="flex-1 floating-button text-black">{loading ? 'Saving...' : 'Save Changes'}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
