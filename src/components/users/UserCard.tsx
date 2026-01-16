import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SkillBadge } from '@/components/skills/SkillBadge';
import { User } from '@/types';
import { MessageCircle, UserPlus } from 'lucide-react';

interface UserCardProps {
  user: User;
  showConnect?: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
  highlightSkill?: string;
}

export const UserCard = ({ 
  user, 
  showConnect = true, 
  onConnect,
  onMessage,
  highlightSkill 
}: UserCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden group">
      <div className="h-16 gradient-primary opacity-80" />
      <CardContent className="-mt-8 pb-4">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-16 h-16 border-4 border-background shadow-lg">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xl gradient-primary text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <Link to={`/user/${user.id}`} className="mt-3">
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
              {user.name}
            </h3>
          </Link>
          
          {user.bio && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}

          {user.skillsKnown.length > 0 && (
            <div className="mt-4 w-full">
              <p className="text-xs text-muted-foreground mb-2">Can teach:</p>
              <div className="flex flex-wrap justify-center gap-1">
                {user.skillsKnown.slice(0, 3).map(skill => (
                  <SkillBadge
                    key={skill.id}
                    name={skill.skill.name}
                    category={skill.skill.category}
                    proficiency={skill.proficiency}
                    size="sm"
                  />
                ))}
                {user.skillsKnown.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{user.skillsKnown.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {showConnect && (
            <div className="flex gap-2 mt-4 w-full">
              {onConnect && (
                <Button 
                  size="sm" 
                  className="flex-1 gradient-primary"
                  onClick={onConnect}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              )}
              {onMessage && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={onMessage}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
