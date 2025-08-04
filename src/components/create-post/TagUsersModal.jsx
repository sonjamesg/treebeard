import React, { useState, useEffect } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TagUsersModal = ({ open, onOpenChange, onConfirm, initialTaggedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState(initialTaggedUsers);
    const { user: currentUser } = useAuth();
  
    useEffect(() => {
        if (open) {
          const usersData = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
          setAllUsers(usersData.filter(u => u.id !== currentUser.id));
          setSelectedUsers(initialTaggedUsers);
        }
    }, [open, initialTaggedUsers, currentUser.id]);

    const handleToggleUser = (userToToggle) => {
        setSelectedUsers(prev => 
            prev.some(u => u.id === userToToggle.id)
                ? prev.filter(u => u.id !== userToToggle.id)
                : [...prev, userToToggle]
        );
    };
  
    const filteredUsers = allUsers.filter(u => 
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConfirm = () => {
        onConfirm(selectedUsers);
        onOpenChange(false);
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

export default TagUsersModal;