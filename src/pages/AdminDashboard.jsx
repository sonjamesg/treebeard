import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, Users, FileText, AlertTriangle, Ban, Trash2, Eye, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalReports: 0, bannedUsers: 0 });
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const savedUsers = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    const savedPosts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const savedReports = JSON.parse(localStorage.getItem('socialvibe_reports') || '[]');
    
    setUsers(savedUsers);
    setPosts(savedPosts);
    setReports(savedReports);
    setStats({
      totalUsers: savedUsers.length,
      totalPosts: savedPosts.length,
      totalReports: savedReports.length,
      bannedUsers: savedUsers.filter(u => u.banned).length
    });
  };

  const handleUserBan = (userId, isBanned) => {
    const updatedUsers = users.map(user => user.id === userId ? { ...user, banned: !isBanned } : user);
    localStorage.setItem('socialvibe_users', JSON.stringify(updatedUsers));
    loadData();
    toast({ title: `User ${!isBanned ? 'banned' : 'unbanned'}`, description: `User account status has been updated.` });
  };
  
  const handleUserRemove = (userIdToRemove) => {
    let updatedUsers = users.filter(user => user.id !== userIdToRemove);
    localStorage.setItem('socialvibe_users', JSON.stringify(updatedUsers));

    let updatedPosts = posts.filter(post => post.author.id !== userIdToRemove);
    localStorage.setItem('socialvibe_posts', JSON.stringify(updatedPosts));

    loadData();
    toast({ title: "User Removed", description: "The user and all their content have been permanently removed." });
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('socialvibe_posts', JSON.stringify(updatedPosts));
    loadData();
    toast({ title: "Post deleted", description: "Post has been removed from the platform." });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'reports', label: 'Reports', icon: AlertTriangle }
  ];

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="admin-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
  );

  return (
    <>
      <Helmet><title>Admin Dashboard - TreeBeard</title></Helmet>
      <div className="max-w-6xl mx-auto p-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8"><div className="flex items-center space-x-3 mb-4"><Shield className="w-8 h-8 text-purple-400" /><h1 className="text-3xl font-bold text-white">Admin Dashboard</h1></div><p className="text-white/70">Manage users, content, and platform moderation</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8"><div className="flex space-x-1 glass-effect rounded-xl p-1">{tabs.map((tab) => <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} onClick={() => setActiveTab(tab.id)} className={`flex-1 ${activeTab === tab.id ? 'floating-button text-black' : 'text-white/70 hover:text-white hover:bg-white/10'}`}><tab.icon className="w-4 h-4 mr-2" />{tab.label}</Button>)}</div></motion.div>
        
        {activeTab === 'overview' && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="text-blue-400" /><StatCard icon={FileText} title="Total Posts" value={stats.totalPosts} color="text-green-400" /><StatCard icon={AlertTriangle} title="Reports" value={stats.totalReports} color="text-yellow-400" /><StatCard icon={Ban} title="Banned Users" value={stats.bannedUsers} color="text-red-400" /></motion.div>}
        
        {activeTab === 'users' && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-panel rounded-xl p-6"><h2 className="text-xl font-bold text-white mb-6">User Management</h2><div className="space-y-4">{users.map((user) => <div key={user.id} className="flex items-center justify-between p-4 glass-effect rounded-lg"><div className="flex items-center space-x-4"><Avatar><AvatarImage src={user.avatar} alt={user.username} /><AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback></Avatar><div><h3 className="text-white font-semibold">{user.username}</h3><p className="text-white/60 text-sm">{user.email}</p><div className="flex items-center space-x-4 text-xs text-white/50"><span>Role: {user.role || 'user'}</span>{user.banned && <span className="text-red-400 font-bold">BANNED</span>}</div></div></div><div className="flex space-x-2"><Button asChild variant="outline" size="icon" className="glass-effect border-white/20 text-white hover:bg-white/10"><Link to={`/profile/${user.username}`}><Eye className="w-4 h-4" /></Link></Button>{user.role !== 'admin' && (<><Button variant={user.banned ? "default" : "secondary"} size="icon" onClick={() => handleUserBan(user.id, user.banned)} className={user.banned ? "floating-button text-black" : "glass-effect border-white/20 text-white hover:bg-white/10"}>{user.banned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="icon"><UserX className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent className="glass-effect border-white/20"><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action will permanently delete the user @{user.username} and all of their posts. This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUserRemove(user.id)} className="bg-red-600 hover:bg-red-700">Delete User</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>)}</div></div>)}</div></motion.div>}
        
        {activeTab === 'posts' && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-panel rounded-xl p-6"><h2 className="text-xl font-bold text-white mb-6">Content Management</h2><div className="space-y-4">{posts.map((post) => <div key={post.id} className="flex items-center justify-between p-4 glass-effect rounded-lg"><div className="flex items-center space-x-4"><img src={post.mediaUrls[0]} alt="Post" className="w-16 h-16 object-cover rounded-lg" /><div><h3 className="text-white font-semibold">@{post.author.username}</h3><p className="text-white/80 text-sm line-clamp-2">{post.caption}</p></div></div><Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}><Trash2 className="w-4 h-4" /></Button></div>)}</div></motion.div>}

        {activeTab === 'reports' && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-panel rounded-xl p-6"><h2 className="text-xl font-bold text-white mb-6">Content Reports</h2>{reports.length === 0 ? <div className="text-center py-12"><AlertTriangle className="w-16 h-16 text-white/30 mx-auto mb-4" /><h3 className="text-white font-semibold mb-2">No reports</h3><p className="text-white/60">All content is clean! No reports to review.</p></div> : <div className="space-y-4">{reports.map((report) => <div key={report.id} className="p-4 glass-effect rounded-lg"><div className="flex items-center justify-between mb-2"><h3 className="text-white font-semibold">Report for Post #{report.postId}</h3><span className="text-xs text-white/50">{new Date(report.createdAt).toLocaleDateString()}</span></div><p className="text-white/80 text-sm mb-4">Reason: {report.reason}</p><div className="flex space-x-2"><Button variant="outline" size="sm" className="glass-effect border-white/20 text-white hover:bg-white/10" onClick={() => toast({description: 'Feature not implemented'})}>Review</Button><Button variant="destructive" size="sm" onClick={() => deletePost(report.postId)}>Delete Post</Button></div></div>)}</div>}</motion.div>}
      </div>
    </>
  );
};

export default AdminDashboard;