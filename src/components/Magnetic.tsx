import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useGesture } from '@use-gesture/react';

interface MagneticProps {
  children: React.ReactElement;
  className?: string;
  strength?: number; // Pull multiplier (0.1 to 1.0)
}

export const Magnetic: React.FC<MagneticProps> = ({ 
  children, 
  className = '', 
  strength = 0.35 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Soft spring physics configuration
  const springConfig = { stiffness: 120, damping: 14, mass: 0.8 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const bind = useGesture({
    onMove: ({ xy: [clientX, clientY] }) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate offset vector from center to mouse position
        const offsetLimitX = rect.width * 0.8;
        const offsetLimitY = rect.height * 0.8;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Constrain movement within limits and apply pull strength
        const pullX = Math.max(-offsetLimitX, Math.min(offsetLimitX, distanceX)) * strength;
        const pullY = Math.max(-offsetLimitY, Math.min(offsetLimitY, distanceY)) * strength;

        x.set(pullX);
        y.set(pullY);
      }
    },
    onHover: ({ hovering }) => {
      if (!hovering) {
        // Smoothly snap back to origin when mouse leaves hover target
        x.set(0);
        y.set(0);
      }
    }
  }, {
    eventOptions: { passive: false }
  });

  return (
    <div 
      ref={ref} 
      {...bind()} 
      className={`inline-flex items-center justify-center cursor-pointer ${className}`}
      style={{ touchAction: 'none' }}
    >
      <motion.div 
        style={{ x: springX, y: springY }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
};
