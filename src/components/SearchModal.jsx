import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const SearchModal = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (open) {
      const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
      setAllUsers(users);
      loadRecentSearches();
    } else {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allUsers]);

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('socialvibe_recent_searches') || '[]');
    setRecentSearches(recent);
  };

  const addToRecentSearches = (user) => {
    let recent = JSON.parse(localStorage.getItem('socialvibe_recent_searches') || '[]');
    recent = recent.filter(u => u.id !== user.id);
    const updated = [user, ...recent].slice(0, 5);
    localStorage.setItem('socialvibe_recent_searches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const handleUserClick = (user) => {
    addToRecentSearches(user);
    onOpenChange(false);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('socialvibe_recent_searches');
    setRecentSearches([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Search</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50"
              autoFocus
            />
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-hide">
            {searchTerm.trim() ? (
              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Link to={`/profile/${user.username}`} onClick={() => handleUserClick(user)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1"><h3 className="text-white font-semibold">{user.username}</h3></div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8"><User className="w-12 h-12 text-white/30 mx-auto mb-2" /><p className="text-white/60">No users found</p></div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <>
                    <div className="flex items-center justify-between"><h3 className="text-white font-semibold">Recent</h3><Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-white/60 hover:text-white">Clear all</Button></div>
                    <div className="space-y-2">
                      {recentSearches.map((user) => (
                        <Link key={user.id} to={`/profile/${user.username}`} onClick={() => handleUserClick(user)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                          <Avatar><AvatarImage src={user.avatar} alt={user.username} /><AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback></Avatar>
                          <div className="flex-1"><h3 className="text-white font-semibold">{user.username}</h3></div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
                {recentSearches.length === 0 && (
                  <div className="text-center py-8"><Search className="w-12 h-12 text-white/30 mx-auto mb-2" /><p className="text-white/60">Start typing to search for users</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;