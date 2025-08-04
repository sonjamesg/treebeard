import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Edit, Save, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (!formData.username.trim()) {
      toast({
        title: "Username required",
        description: "Username cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const emailChanged = user.email !== formData.email;

    updateUser({ ...user, ...formData });
    
    if (emailChanged) {
        toast({
            title: "Confirm Your New Email",
            description: "A confirmation link has been sent to your new email. Please verify to complete the change. (This is a simulation)",
        });
    } else {
        toast({
            title: "Profile Updated",
            description: "Your account details have been saved.",
        });
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>Account Settings - TreeBeard</title>
        <meta name="description" content="Manage your account settings on TreeBeard." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/settings" className="flex items-center space-x-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Settings</span>
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="floating-button text-black">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="ghost" className="text-white hover:bg-white/10">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <p className="text-white/70 mb-8">Manage your public profile information.</p>
          
          <div className="glass-effect rounded-xl p-6 space-y-6">
            <div>
              <Label htmlFor="username" className="text-white/80">Username</Label>
              <Input 
                id="username" 
                value={formData.username} 
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-2 glass-effect border-white/20 text-white placeholder:text-white/50 disabled:opacity-70"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10 mt-2 glass-effect border-white/20 text-white placeholder:text-white/50 disabled:opacity-70"
                />
              </div>
              {isEditing && <p className="text-xs text-white/50 mt-2">Changing your email requires verification.</p>}
            </div>
            <div>
              <Label htmlFor="bio" className="text-white/80">Bio</Label>
              <Textarea 
                id="bio" 
                value={formData.bio} 
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-2 glass-effect border-white/20 text-white placeholder:text-white/50 disabled:opacity-70"
                rows={3}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AccountSettings;