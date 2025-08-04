import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - TreeBeard</title>
        <meta name="description" content="Log in to your TreeBeard account and connect with friends." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-48 mx-auto mb-4">
                <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5f6d98e7-cb6d-4191-a977-0170af38ce47/8be392602380b408012733f0ff417bff.webp" alt="TreeBeard Logo" className="object-contain" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
              <p className="text-white/70 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10 pr-10 glass-effect border-white/20 text-white placeholder:text-white/50" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/50 hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full floating-button text-white font-semibold py-3">{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>

            <div className="mt-6 text-center"><p className="text-white/70">Don't have an account?{' '}<Link to="/register" className="text-purple-300 hover:text-purple-200 font-medium">Sign up</Link></p></div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;