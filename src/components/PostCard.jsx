
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, MoreHorizontal, Flag, Trash2, Send, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { cn } from '@/lib/utils';

const SlickArrow = ({ className, style, onClick, isLeft }) => (
  <div
    className={cn(
      className,
      'z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center',
      isLeft ? 'left-2' : 'right-2'
    )}
    style={{ ...style }}
    onClick={onClick}
  >
    {isLeft ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
  </div>
);

const Comment = ({ comment, onLike, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);

  const handleLike = () => {
    onLike(comment.id, !isLiked);
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="comment-bubble rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
          <AvatarFallback className="text-xs">{comment.author.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <span className="text-white text-sm">
            <span className="font-semibold">{comment.author.username}</span>{' '}
            {comment.text}
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-white/50 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</p>
            <button onClick={handleLike} className={`text-xs font-semibold ${isLiked ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}>
              {isLiked ? 'Liked' : 'Like'}
            </button>
            {likeCount > 0 && (
              <span className="text-white/50 text-xs">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            )}
          </div>
        </div>
        <button onClick={handleLike} className={`text-white/50 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}>
          <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [likers, setLikers] = useState([]);

  useEffect(() => {
    if (post && user) {
      setIsLiked(post.likes?.includes(user.id) || false);
      setLikeCount(post.likes?.length || 0);
      setComments(post.comments || []);
    }
  }, [post, user]);

  if (!post || !user) return null;

  const handleLike = () => {
    const posts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === post.id);
    if (postIndex === -1) return;

    const newIsLiked = !isLiked;
    let updatedLikes = posts[postIndex].likes || [];

    if (newIsLiked) {
      updatedLikes.push(user.id);
    } else {
      updatedLikes = updatedLikes.filter(id => id !== user.id);
    }

    posts[postIndex].likes = updatedLikes;
    localStorage.setItem('socialvibe_posts', JSON.stringify(posts));

    setIsLiked(newIsLiked);
    setLikeCount(updatedLikes.length);
    if(onUpdate) onUpdate({ ...post, likes: updatedLikes });
  };

  const handleComment = () => {
    if (!newComment.trim()) return;

    const posts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === post.id);
    if (postIndex === -1) return;

    const comment = {
      id: Date.now().toString(),
      author: { id: user.id, username: user.username, avatar: user.avatar },
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: []
    };

    const updatedComments = [...(posts[postIndex].comments || []), comment];
    posts[postIndex].comments = updatedComments;
    localStorage.setItem('socialvibe_posts', JSON.stringify(posts));

    setComments(updatedComments);
    setNewComment('');
    if(onUpdate) onUpdate({ ...post, comments: updatedComments });

    toast({ title: "Comment added", description: "Your comment has been posted!" });
  };

  const handleLikeComment = (commentId, shouldLike) => {
    const posts = JSON.parse(localStorage.getItem('socialvibe_posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === post.id);
    if (postIndex === -1) return;

    const commentIndex = posts[postIndex].comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;

    let commentLikes = posts[postIndex].comments[commentIndex].likes || [];
    if (shouldLike) {
      commentLikes.push(user.id);
    } else {
      commentLikes = commentLikes.filter(id => id !== user.id);
    }
    posts[postIndex].comments[commentIndex].likes = commentLikes;
    localStorage.setItem('socialvibe_posts', JSON.stringify(posts));

    setComments(posts[postIndex].comments);
    if(onUpdate) onUpdate({ ...post, comments: posts[postIndex].comments });
  };

  const handleReport = () => {
    toast({ title: "Post Reported", description: "Thank you for helping to keep TreeBeard safe." });
  };

  const handleDeletePost = () => {
    if (onDelete) onDelete(post.id);
  };

  const handleShareLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast({ title: "Link Copied!", description: "Post link copied to your clipboard." });
  };

  const handleShareMessage = () => {
    toast({ description: "🚧 Share in messenger isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const fetchLikers = () => {
    const allUsers = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    const postLikers = allUsers.filter(u => post.likes.includes(u.id));
    setLikers(postLikers);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: post.mediaUrls && post.mediaUrls.length > 1,
    prevArrow: <SlickArrow isLeft />,
    nextArrow: <SlickArrow />,
    dotsClass: "slick-dots slick-thumb",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="post-card rounded-2xl overflow-hidden glass-effect"
    >
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.author.username}`} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full profile-gradient p-0.5 group-hover:scale-105 transition-transform">
            <Avatar className="w-full h-full">
              <AvatarImage src={post.author.avatar} alt={post.author.username} />
              <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="text-white font-semibold group-hover:text-gray-300 transition-colors">{post.author.username}</h3>
            <p className="text-white/60 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-effect border-white/20">
             <DropdownMenuItem onClick={handleShareLink} className="cursor-pointer"><LinkIcon className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
            <DropdownMenuItem onClick={handleReport} className="cursor-pointer"><Flag className="mr-2 h-4 w-4" /> Report</DropdownMenuItem>
            {(user.id === post.author.id || user.role === 'admin') && (
              <DropdownMenuItem onClick={handleDeletePost} className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative bg-black aspect-square md:aspect-auto md:max-h-[70vh] overflow-hidden">
          {post.mediaUrls.length > 1 ? (
            <Slider {...sliderSettings} className="slick-container h-full">
              {post.mediaUrls.map((url, index) => (
                <div key={index} className="flex justify-center">
                  {post.mediaType === 'video' ? (
                    <video src={url} controls className="w-full max-w-full rounded-xl bg-dark p-4" />
                  ) : (
                    <img src={url} alt={`Post content ${index + 1}`} className="w-full max-w-full rounded-xl bg-dark p-4" />
                  )}
                </div>
              ))}
            </Slider>
          ) : (
            post.mediaType === 'video' ? (
              <video src={post.mediaUrls[0]} controls className="w-full max-w-full rounded-xl bg-dark p-4" />
            ) : (
              <img src={post.mediaUrls[0]} alt="Post content" className="w-full max-w-full rounded-xl bg-dark p-4" />
            )
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleLike} className={`hover:bg-white/10 ${isLiked ? 'text-red-500' : 'text-white/70'}`}>
              <Heart className={`w-6 h-6 transition-all ${isLiked ? 'fill-current like-animation' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowComments(!showComments)} className="text-white/70 hover:text-white hover:bg-white/10">
              <MessageCircle className="w-6 h-6" />
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Share className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-effect border-white/20">
                <DropdownMenuItem onClick={handleShareLink} className="cursor-pointer"><LinkIcon className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareMessage} className="cursor-pointer"><Send className="mr-2 h-4 w-4" /> Share in Messenger</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mb-2">
          <Dialog>
            <DialogTrigger asChild>
              <button onClick={fetchLikers} disabled={likeCount === 0} className="text-white font-semibold disabled:cursor-default">
                {likeCount} likes
              </button>
            </DialogTrigger>
            <DialogContent className="glass-effect border-white/20">
              <DialogHeader>
                <DialogTitle>Liked by</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {likers.map(liker => (
                  <div key={liker.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={liker.avatar} alt={liker.username} />
                      <AvatarFallback>{liker.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-semibold">{liker.username}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <span className="text-white">
            <span className="font-semibold">{post.author.username}</span>{' '}
            {post.caption}
          </span>
        </div>

        {comments.length > 0 && (
          <div className="mb-4">
            <button onClick={() => setShowComments(!showComments)} className="text-white/60 text-sm hover:text-white">
              View all {comments.length} comments
            </button>
          </div>
        )}

        {showComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mb-4">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} onLike={handleLikeComment} currentUserId={user.id} />
            ))}
          </motion.div>
        )}

        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex space-x-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="glass-effect border-white/20 text-white placeholder:text-white/50 resize-none min-h-[40px]"
              rows={1}
            />
            <Button onClick={handleComment} disabled={!newComment.trim()} className="floating-button text-black px-6">
              Post
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
