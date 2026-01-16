import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { SkillManager } from '@/components/skills/SkillManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { Search, MessageCircle, Users, Bell } from 'lucide-react';
import { getUserConnections, getUserNotifications, getUserConversations } from '@/lib/storage';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" />;

  const connections = getUserConnections(user.id);
  const notifications = getUserNotifications(user.id).filter(n => !n.read);
  const conversations = getUserConversations(user.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-16 h-16 ring-4 ring-primary/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl gradient-primary text-white">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Ready to learn something new?</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Search, label: 'Find Skills', to: '/search', color: 'gradient-primary' },
            { icon: MessageCircle, label: 'Messages', to: '/messages', count: conversations.length },
            { icon: Users, label: 'Connections', to: '/connections', count: connections.length },
            { icon: Bell, label: 'Notifications', to: '/notifications', count: notifications.length },
          ].map((item, i) => (
            <Link key={i} to={item.to}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${item.color || 'bg-muted'} flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    {item.count !== undefined && (
                      <p className="text-sm text-muted-foreground">{item.count} active</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Skills Management */}
        <div className="grid md:grid-cols-2 gap-6">
          <SkillManager type="knows" />
          <SkillManager type="wants" />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
