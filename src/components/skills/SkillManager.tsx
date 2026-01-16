import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SkillBadge } from './SkillBadge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserSkill, 
  Skill, 
  SkillCategory, 
  ProficiencyLevel,
  SKILL_CATEGORIES, 
  PROFICIENCY_LEVELS,
  PREDEFINED_SKILLS 
} from '@/types';
import { generateId, getUsers, saveUsers } from '@/lib/storage';
import { Plus, GraduationCap, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SkillManagerProps {
  type: 'knows' | 'wants';
}

export const SkillManager = ({ type }: SkillManagerProps) => {
  const { user, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | ''>('');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('beginner');
  const [customSkillName, setCustomSkillName] = useState('');

  if (!user) return null;

  const skills = type === 'knows' ? user.skillsKnown : user.skillsWanted;
  const title = type === 'knows' ? 'Skills I Know' : 'Skills I Want to Learn';
  const icon = type === 'knows' ? <GraduationCap className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />;
  const emptyMessage = type === 'knows' 
    ? 'Add skills you can teach others!' 
    : 'Add skills you want to learn!';

  const filteredSkills = selectedCategory 
    ? PREDEFINED_SKILLS.filter(s => s.category === selectedCategory)
    : PREDEFINED_SKILLS;

  const availableSkills = filteredSkills.filter(
    s => !skills.some(us => us.skillId === s.id)
  );

  const handleAddSkill = () => {
    if (!selectedSkillId && !customSkillName) {
      toast({
        title: "Select a skill",
        description: "Please select a skill or enter a custom one.",
        variant: "destructive",
      });
      return;
    }

    let skill: Skill;
    
    if (selectedSkillId) {
      const found = PREDEFINED_SKILLS.find(s => s.id === selectedSkillId);
      if (!found) return;
      skill = found;
    } else {
      // Create custom skill
      skill = {
        id: generateId(),
        name: customSkillName,
        category: selectedCategory as SkillCategory || 'technology',
      };
    }

    const newUserSkill: UserSkill = {
      id: generateId(),
      skillId: skill.id,
      skill,
      type,
      ...(type === 'knows' && { proficiency }),
    };

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) return;

    if (type === 'knows') {
      users[userIndex].skillsKnown.push(newUserSkill);
    } else {
      users[userIndex].skillsWanted.push(newUserSkill);
    }

    saveUsers(users);
    refreshUser();
    
    // Reset form
    setSelectedSkillId('');
    setCustomSkillName('');
    setProficiency('beginner');
    setIsOpen(false);
    
    toast({
      title: "Skill added!",
      description: `${skill.name} has been added to your ${type === 'knows' ? 'skills' : 'learning list'}.`,
    });
  };

  const handleRemoveSkill = (skillId: string) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) return;

    if (type === 'knows') {
      users[userIndex].skillsKnown = users[userIndex].skillsKnown.filter(s => s.id !== skillId);
    } else {
      users[userIndex].skillsWanted = users[userIndex].skillsWanted.filter(s => s.id !== skillId);
    }

    saveUsers(users);
    refreshUser();
    
    toast({
      title: "Skill removed",
      description: "The skill has been removed from your profile.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a skill {type === 'knows' ? 'you know' : 'to learn'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={(v) => {
                  setSelectedCategory(v as SkillCategory);
                  setSelectedSkillId('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skill</Label>
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or add custom</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Skill Name</Label>
                <Input 
                  placeholder="e.g., Salsa Dancing" 
                  value={customSkillName}
                  onChange={(e) => {
                    setCustomSkillName(e.target.value);
                    if (e.target.value) setSelectedSkillId('');
                  }}
                />
              </div>

              {type === 'knows' && (
                <div className="space-y-2">
                  <Label>Proficiency Level</Label>
                  <Select value={proficiency} onValueChange={(v) => setProficiency(v as ProficiencyLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleAddSkill} className="w-full gradient-primary">
                Add Skill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">{emptyMessage}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map(userSkill => (
              <SkillBadge
                key={userSkill.id}
                name={userSkill.skill.name}
                category={userSkill.skill.category}
                proficiency={type === 'knows' ? userSkill.proficiency : undefined}
                showCategory
                onRemove={() => handleRemoveSkill(userSkill.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
