'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  slug: string;
  iconName: string;
  count: number;
  index: number;
}

const iconMap: Record<string, keyof typeof LucideIcons> = {
  'circle-dot': 'CircleDot',
  'wrench': 'Wrench',
  'zap': 'Zap',
  'hammer': 'Hammer',
  'ruler': 'Ruler',
  'droplets': 'Droplets',
  'plug': 'Plug',
  'car': 'Car',
  'leaf': 'Leaf',
  'arrow-up': 'ArrowUp',
  'package': 'Package',
  'more-horizontal': 'MoreHorizontal',
};

const bgColors = [
  'bg-brand-50 hover:bg-brand-100 text-brand-600',
  'bg-blue-50 hover:bg-blue-100 text-blue-600',
  'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
  'bg-purple-50 hover:bg-purple-100 text-purple-600',
  'bg-rose-50 hover:bg-rose-100 text-rose-600',
  'bg-amber-50 hover:bg-amber-100 text-amber-600',
  'bg-cyan-50 hover:bg-cyan-100 text-cyan-600',
  'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
  'bg-lime-50 hover:bg-lime-100 text-lime-600',
  'bg-pink-50 hover:bg-pink-100 text-pink-600',
  'bg-teal-50 hover:bg-teal-100 text-teal-600',
  'bg-gray-50 hover:bg-gray-100 text-gray-600',
];

export default function CategoryCard({ name, slug, iconName, count, index }: CategoryCardProps) {
  const iconKey = iconMap[iconName] || 'Wrench';
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconKey];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <Link
      href={`/tools?category=${slug}`}
      className={cn(
        'group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg',
        bgColor
      )}
      id={`category-${slug}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-dark-900 leading-tight">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{count} tools</p>
      </div>
    </Link>
  );
}
