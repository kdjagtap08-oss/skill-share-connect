export type SkillCategory = 
  | 'technology'
  | 'music'
  | 'languages'
  | 'cooking'
  | 'arts'
  | 'fitness'
  | 'business'
  | 'science';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'expert';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface UserSkill {
  id: string;
  skillId: string;
  skill: Skill;
  proficiency?: ProficiencyLevel;
  type: 'knows' | 'wants';
}

export interface User {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar?: string;
  createdAt: string;
  skillsKnown: UserSkill[];
  skillsWanted: UserSkill[];
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Connection {
  id: string;
  user1Id: string;
  user2Id: string;
  skillId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'connection_request' | 'request_accepted' | 'request_declined' | 'new_message';
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export const SKILL_CATEGORIES: { value: SkillCategory; label: string; icon: string }[] = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'languages', label: 'Languages', icon: '🌍' },
  { value: 'cooking', label: 'Cooking', icon: '🍳' },
  { value: 'arts', label: 'Arts & Crafts', icon: '🎨' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'business', label: 'Business', icon: '📊' },
  { value: 'science', label: 'Science', icon: '🔬' },
];

export const PROFICIENCY_LEVELS: { value: ProficiencyLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

export const PREDEFINED_SKILLS: Skill[] = [
  // Technology
  { id: 'skill-1', name: 'JavaScript', category: 'technology' },
  { id: 'skill-2', name: 'Python', category: 'technology' },
  { id: 'skill-3', name: 'React', category: 'technology' },
  { id: 'skill-4', name: 'Web Design', category: 'technology' },
  { id: 'skill-5', name: 'Mobile Development', category: 'technology' },
  { id: 'skill-6', name: 'Data Science', category: 'technology' },
  // Music
  { id: 'skill-7', name: 'Guitar', category: 'music' },
  { id: 'skill-8', name: 'Piano', category: 'music' },
  { id: 'skill-9', name: 'Singing', category: 'music' },
  { id: 'skill-10', name: 'Music Production', category: 'music' },
  { id: 'skill-11', name: 'Drums', category: 'music' },
  // Languages
  { id: 'skill-12', name: 'Spanish', category: 'languages' },
  { id: 'skill-13', name: 'French', category: 'languages' },
  { id: 'skill-14', name: 'Mandarin', category: 'languages' },
  { id: 'skill-15', name: 'Japanese', category: 'languages' },
  { id: 'skill-16', name: 'German', category: 'languages' },
  // Cooking
  { id: 'skill-17', name: 'Baking', category: 'cooking' },
  { id: 'skill-18', name: 'Italian Cuisine', category: 'cooking' },
  { id: 'skill-19', name: 'Sushi Making', category: 'cooking' },
  { id: 'skill-20', name: 'Pastry', category: 'cooking' },
  // Arts
  { id: 'skill-21', name: 'Drawing', category: 'arts' },
  { id: 'skill-22', name: 'Painting', category: 'arts' },
  { id: 'skill-23', name: 'Photography', category: 'arts' },
  { id: 'skill-24', name: 'Pottery', category: 'arts' },
  // Fitness
  { id: 'skill-25', name: 'Yoga', category: 'fitness' },
  { id: 'skill-26', name: 'Weight Training', category: 'fitness' },
  { id: 'skill-27', name: 'Swimming', category: 'fitness' },
  { id: 'skill-28', name: 'Martial Arts', category: 'fitness' },
  // Business
  { id: 'skill-29', name: 'Marketing', category: 'business' },
  { id: 'skill-30', name: 'Public Speaking', category: 'business' },
  { id: 'skill-31', name: 'Accounting', category: 'business' },
  { id: 'skill-32', name: 'Project Management', category: 'business' },
  // Science
  { id: 'skill-33', name: 'Chemistry', category: 'science' },
  { id: 'skill-34', name: 'Physics', category: 'science' },
  { id: 'skill-35', name: 'Biology', category: 'science' },
  { id: 'skill-36', name: 'Astronomy', category: 'science' },
];
