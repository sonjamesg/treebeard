import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register({ username: formData.username, email: formData.email, password: formData.password });
      navigate('/');
    } catch (error) {
      // Error handled in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - SocialVibe</title>
        <meta name="description" content="Create your SocialVibe account and start sharing your moments." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4"><span className="text-white font-bold text-2xl">S</span></div>
              <h1 className="text-2xl font-bold gradient-text">Join SocialVibe</h1>
              <p className="text-white/70 mt-2">Create your account to get started</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input id="username" type="text" placeholder="Choose a username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10 pr-10 glass-effect border-white/20 text-white placeholder:text-white/50" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/50 hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50" required />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full floating-button text-white font-semibold py-3">{loading ? 'Creating Account...' : 'Create Account'}</Button>
            </form>
            <div className="mt-6 text-center"><p className="text-white/70">Already have an account?{' '}<Link to="/login" className="text-purple-300 hover:text-purple-200 font-medium">Sign in</Link></p></div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;