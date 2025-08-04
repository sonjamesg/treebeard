import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Settings, UserPlus, UserMinus, Grid, Edit, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostCard from '@/components/PostCard';
import EditProfileModal from '@/components/EditProfileModal';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  const isOwnProfile = user && profileUser && user.id === profileUser.id;

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    const foundUser = users.find(u => u.username === username);
    if (foundUser) {
      const posts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
      const userPosts = posts.filter(post => post.author.id === foundUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProfileUser(foundUser);
      setUserPosts(userPosts);
      if (user) {
        setIsFollowing(user.following?.includes(foundUser.id) || false);
      }
    } else {
      setProfileUser(null);
    }
  }, [username, user]);

  const handleFollowToggle = () => {
    if (!user || !profileUser) return;
    const allUsers = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    const currentUserIndex = allUsers.findIndex(u => u.id === user.id);
    const profileUserIndex = allUsers.findIndex(u => u.id === profileUser.id);
    if (currentUserIndex === -1 || profileUserIndex === -1) return;

    if (isFollowing) {
      allUsers[currentUserIndex].following = allUsers[currentUserIndex].following.filter(id => id !== profileUser.id);
      allUsers[profileUserIndex].followers = allUsers[profileUserIndex].followers.filter(id => id !== user.id);
      toast({ title: "Unfollowed", description: `You unfollowed ${profileUser.username}` });
    } else {
      allUsers[currentUserIndex].following.push(profileUser.id);
      allUsers[profileUserIndex].followers.push(user.id);
      toast({ title: "Following", description: `You are now following ${profileUser.username}` });
    }
    
    localStorage.setItem('socialvibe_users', JSON.stringify(allUsers));
    updateProfile({ following: allUsers[currentUserIndex].following });
    setProfileUser(allUsers[profileUserIndex]);
    setIsFollowing(!isFollowing);
  };
  
  const handlePostUpdate = (updatedPost) => {
    setUserPosts(userPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };
  
  const handleDeletePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const updatedPosts = allPosts.filter(p => p.id !== postId);
    localStorage.setItem('socialvibe_posts', JSON.stringify(updatedPosts));
    setUserPosts(userPosts.filter(p => p.id !== postId));
    toast({ title: "Post Deleted", description: "The post has been removed successfully." });
  };
  
  const onProfileUpdate = (updates) => {
    setProfileUser({ ...profileUser, ...updates });
  };
  
  if (!profileUser) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-white mb-2">User not found</h2><p className="text-white/70">The profile you're looking for doesn't exist.</p></div></div>;
  
  return (
    <>
      <Helmet><title>{profileUser.username} - TreeBeard</title><meta name="description" content={`View ${profileUser.username}'s profile and posts on TreeBeard.`} /></Helmet>
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 rounded-full profile-gradient p-1"><Avatar className="w-full h-full"><AvatarImage src={profileUser.avatar} alt={profileUser.username} /><AvatarFallback className="text-2xl">{profileUser.username[0].toUpperCase()}</AvatarFallback></Avatar></div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                <h1 className="text-2xl font-bold text-white mb-2 sm:mb-0">{profileUser.username}</h1>
                <div className="flex justify-center space-x-2">
                  {isOwnProfile ? (<><Button onClick={() => setShowEditProfile(true)} variant="outline" className="glass-effect border-white/20 text-white hover:bg-white/10"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button><Button onClick={() => navigate('/settings')} variant="outline" className="glass-effect border-white/20 text-white hover:bg-white/10"><Settings className="w-4 h-4" /></Button></>) : (<div className="flex space-x-2"><Button onClick={handleFollowToggle} className={isFollowing ? "glass-effect border-white/20 text-white hover:bg-white/10" : "floating-button text-black"} variant={isFollowing ? "outline" : "default"}>{isFollowing ? <><UserMinus className="w-4 h-4 mr-2" />Unfollow</> : <><UserPlus className="w-4 h-4 mr-2" />Follow</>}</Button><Button asChild variant="outline" className="glass-effect border-white/20 text-white hover:bg-white/10"><Link to={`/messages/${profileUser.username}`}><MessageSquare className="w-4 h-4 mr-2" />Message</Link></Button></div>)}
                </div>
              </div>
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center"><div className="text-xl font-bold text-white">{userPosts.length}</div><div className="text-white/70 text-sm">Posts</div></div>
                <div className="text-center"><div className="text-xl font-bold text-white">{profileUser.followers?.length || 0}</div><div className="text-white/70 text-sm">Followers</div></div>
                <div className="text-center"><div className="text-xl font-bold text-white">{profileUser.following?.length || 0}</div><div className="text-white/70 text-sm">Following</div></div>
              </div>
              {profileUser.bio && <p className="text-white/80 mb-2">{profileUser.bio}</p>}
              {profileUser.website && (
                <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start text-blue-400 hover:text-blue-300 transition-colors">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span className="font-semibold">{profileUser.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
        
        <div className="border-b border-white/20 mb-8"><div className="flex justify-center"><Button variant="ghost" className="text-white/70 data-[state=active]:text-white data-[state=active]:border-b-2 border-white"><Grid className="w-4 h-4 mr-2" />Posts</Button></div></div>

        <div className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} onUpdate={handlePostUpdate} onDelete={handleDeletePost} />)
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><div className="glass-effect rounded-2xl p-8"><div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center"><Grid className="w-12 h-12 text-white" /></div><h2 className="text-xl font-semibold text-white mb-2">No posts yet</h2><p className="text-white/70">{isOwnProfile ? "Share your first moment with the world!" : `${profileUser.username} hasn't shared anything yet.`}</p></div></motion.div>
          )}
        </div>
      </div>
      <EditProfileModal open={showEditProfile} onOpenChange={setShowEditProfile} user={profileUser} onProfileUpdate={onProfileUpdate} />
    </>
  );
};

export default Profile;