import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, MessageCircle, PlusSquare, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SearchModal from '@/components/SearchModal';

const Navbar = ({ onShowCreatePost }) => {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        className="fixed top-0 left-0 right-0 z-50 nav-blur"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-[120px] sm:w-[150px] h-auto flex items-center justify-center">
                 <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5f6d98e7-cb6d-4191-a977-0170af38ce47/8be392602380b408012733f0ff417bff.webp" alt="TreeBeard Logo" className="object-contain" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block"></span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <Button variant="ghost" onClick={() => setShowSearch(true)} className="w-full justify-start text-muted-foreground glass-effect">
                <Search className="w-4 h-4 mr-2" />
                Search users...
              </Button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)} className="md:hidden">
                <Search className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={onShowCreatePost} className="hover:bg-white/10 hidden sm:inline-flex">
                <PlusSquare className="w-5 h-5" />
              </Button>

              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="hover:bg-white/10 relative">
                  <Heart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Button>
              </Link>

              <Link to="/messages">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-effect border-white/20" align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user.username}`} className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.nav>
      <SearchModal open={showSearch} onOpenChange={setShowSearch} />
    </>
  );
};
export default Navbar;