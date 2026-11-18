import {
  BarChart3,
  Calendar,
  Compass,
  Film,
  Layers,
  Megaphone,
  MessageCircle,
  Palette,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

interface IconResolverProps {
  name: string;
  className?: string;
}

export function IconResolver({ name, className = 'w-5 h-5' }: IconResolverProps) {
  switch (name) {
    case 'Target':
      return <Target className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'MessageCircle':
      return <MessageCircle className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'Users':
      return <Users className={className} />;
    default:
      return <Layers className={className} />;
  }
}
