import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { UserCard } from '@/components/users/UserCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers, getOrCreateConversation } from '@/lib/storage';
import { SKILL_CATEGORIES, SkillCategory } from '@/types';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | 'all'>('all');

  if (!user) return <Navigate to="/auth" />;

  const allUsers = getUsers().filter(u => u.id !== user.id);
  
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = searchQuery === '' || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.skillsKnown.some(s => s.skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' ||
      u.skillsKnown.some(s => s.skill.category === categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const handleMessage = (targetUser: typeof allUsers[0]) => {
    const conversation = getOrCreateConversation([user.id, targetUser.id]);
    navigate(`/messages/${conversation.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Find Skills</h1>
        <p className="text-muted-foreground mb-6">Search for people who can teach you new skills</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or skill..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={v => setCategoryFilter(v as SkillCategory | 'all')}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {SKILL_CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No users found matching your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(u => (
              <UserCard key={u.id} user={u} onMessage={() => handleMessage(u)} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
