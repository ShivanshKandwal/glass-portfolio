import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  shadowColor?: string; // custom pastel color for hover shadow (e.g. rgba for glowing shadows)
  delay?: number;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  shadowColor = 'rgba(251, 113, 133, 0.48)', // High-saturation rose glow default
  delay = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{
        scale: 1.015,
        y: -6,
        backgroundColor: "rgba(255, 255, 255, 0.55)",
        borderColor: "rgba(255, 255, 255, 0.75)",
        boxShadow: `0 20px 40px -15px rgba(60, 54, 51, 0.08), 0 15px 30px -10px ${shadowColor}`,
      }}
      onClick={onClick}
      className={`glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};
