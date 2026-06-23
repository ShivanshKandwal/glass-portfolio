import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl: string;
  stars: string;
  language: string;
}

interface ProjectRowProps {
  project: ProjectData;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({ 
  project, 
  onHoverStart, 
  onHoverEnd,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onToggleExpand();
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="flex items-center justify-between py-5 cursor-pointer group transition-colors duration-300 w-full text-left select-none outline-none"
    >
      {/* Title & Description */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6 flex-1 min-w-0 pr-4">
        <h3 className={`font-serif text-lg md:text-xl font-medium transition-colors duration-300 shrink-0 ${
          isExpanded ? 'text-purple-600' : 'text-[#3C3633] group-hover:text-purple-600'
        }`}>
          {project.title}
        </h3>
        <p className="text-sm text-[#7D7468] max-w-sm md:max-w-xl truncate">
          {project.description}
        </p>
      </div>

      {/* Badges, stars & icons */}
      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        <div className="hidden sm:flex gap-1.5">
          {project.tags.slice(0, 2).map((tag, i) => (
            <span 
              key={i} 
              className="text-xs bg-[#F5EFE6]/60 text-[#7D7468] px-2.5 py-1 rounded-full border border-[#E6DFD5]/50 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-[#908576] font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>{project.language}</span>
        </div>

        <span className="text-xs text-[#908576] font-mono">
          ★ {project.stars}
        </span>
        
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
          isExpanded 
            ? 'bg-purple-100 border-purple-300 text-purple-600' 
            : 'bg-white/20 border-white/50 text-[#7D7468] group-hover:bg-purple-50 group-hover:border-purple-300 group-hover:text-purple-600'
        }`}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
};

