import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const PrivacySettings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Your new password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
        toast({
            title: "Password too short",
            description: "Your new password must be at least 6 characters long.",
            variant: "destructive",
        });
        return;
    }

    const success = updateUser({ 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
    }, true);

    if (success) {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const showNotImplementedToast = () => {
    toast({
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Privacy & Security - TreeBeard</title>
        <meta name="description" content="Manage your privacy and security settings on TreeBeard." />
      </Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/settings" className="flex items-center space-x-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Settings</span>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Privacy & Security</h1>
          </div>
          <p className="text-white/70 mb-8">Manage how your information is protected.</p>
          
          <div className="glass-effect rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <KeyRound className="w-6 h-6 mr-3" />
                Change Password
            </h2>
            <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                   <div className="relative">
                     <Input 
                        id="currentPassword" 
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-2 glass-effect border-white/20 text-white placeholder:text-white/50"
                     />
                     <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                        {showCurrentPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                     </button>
                   </div>
                </div>
                 <div>
                  <Label htmlFor="newPassword">New Password</Label>
                   <div className="relative">
                     <Input 
                        id="newPassword" 
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-2 glass-effect border-white/20 text-white placeholder:text-white/50"
                     />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                        {showNewPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                     </button>
                   </div>
                </div>
                 <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-2 glass-effect border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button onClick={handleChangePassword} className="floating-button text-black font-semibold">Update Password</Button>
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Other Settings</h2>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white">Private Account</h3>
                        <p className="text-white/60 text-sm">When your account is private, only people you approve can see your photos and videos on TreeBeard.</p>
                    </div>
                    <Button onClick={showNotImplementedToast} size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white">Two-Factor Authentication</h3>
                        <p className="text-white/60 text-sm">Add an extra layer of security to your account.</p>
                    </div>
                    <Button onClick={showNotImplementedToast} size="sm">Set Up</Button>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacySettings;