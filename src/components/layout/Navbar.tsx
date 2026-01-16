import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MessageCircle, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUnreadNotificationCount, getMessages, getUserConversations } from '@/lib/storage';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) {
      setUnreadNotifications(getUnreadNotificationCount(user.id));
      
      // Count unread messages
      const conversations = getUserConversations(user.id);
      const messages = conversations.reduce((acc, conv) => {
        if (conv.lastMessage && !conv.lastMessage.read && conv.lastMessage.senderId !== user.id) {
          return acc + 1;
        }
        return acc;
      }, 0);
      setUnreadMessages(messages);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">SkillSwap</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/search" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Find Skills</span>
              </Link>
              <Link 
                to="/messages" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-2 -right-4 h-5 w-5 p-0 flex items-center justify-center gradient-accent text-white text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </Link>
              <Link 
                to="/notifications" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-4 h-5 w-5 p-0 flex items-center justify-center gradient-accent text-white text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="gradient-primary text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Log in
                </Button>
                <Button className="gradient-primary" onClick={() => navigate('/auth?tab=signup')}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link 
                to="/search" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5 text-primary" />
                <span>Find Skills</span>
              </Link>
              <Link 
                to="/messages" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Messages</span>
                {unreadMessages > 0 && (
                  <Badge className="ml-auto gradient-accent text-white">{unreadMessages}</Badge>
                )}
              </Link>
              <Link 
                to="/notifications" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="w-5 h-5 text-primary" />
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge className="ml-auto gradient-accent text-white">{unreadNotifications}</Badge>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
