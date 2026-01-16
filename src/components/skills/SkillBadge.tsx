import { Badge } from '@/components/ui/badge';
import { SkillCategory, SKILL_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  name: string;
  category: SkillCategory;
  proficiency?: 'beginner' | 'intermediate' | 'expert';
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
  onRemove?: () => void;
}

const categoryColors: Record<SkillCategory, string> = {
  technology: 'bg-technology/10 text-technology border-technology/30',
  music: 'bg-music/10 text-music border-music/30',
  languages: 'bg-languages/10 text-languages border-languages/30',
  cooking: 'bg-cooking/10 text-cooking border-cooking/30',
  arts: 'bg-arts/10 text-arts border-arts/30',
  fitness: 'bg-fitness/10 text-fitness border-fitness/30',
  business: 'bg-business/10 text-business border-business/30',
  science: 'bg-science/10 text-science border-science/30',
};

const proficiencyColors = {
  beginner: 'ring-1 ring-muted-foreground/30',
  intermediate: 'ring-2 ring-primary/50',
  expert: 'ring-2 ring-accent',
};

export const SkillBadge = ({ 
  name, 
  category, 
  proficiency, 
  size = 'md',
  showCategory = false,
  onRemove 
}: SkillBadgeProps) => {
  const categoryInfo = SKILL_CATEGORIES.find(c => c.value === category);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border transition-all hover:scale-105',
        categoryColors[category],
        proficiency && proficiencyColors[proficiency],
        sizeClasses[size],
        onRemove && 'pr-1'
      )}
    >
      {showCategory && categoryInfo && (
        <span className="mr-1">{categoryInfo.icon}</span>
      )}
      {name}
      {proficiency && (
        <span className="ml-1.5 opacity-70 text-xs capitalize">• {proficiency}</span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 hover:bg-foreground/10 rounded-full p-0.5"
        >
          ×
        </button>
      )}
    </Badge>
  );
};
