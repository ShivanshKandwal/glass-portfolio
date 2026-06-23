import React from 'react';
import { motion } from 'framer-motion';

interface DragPhotoProps {
  src: string;
  alt: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  initialRotate?: number;
  initialX?: number;
  initialY?: number;
  caption?: string;
}

export const DragPhoto: React.FC<DragPhotoProps> = ({
  src,
  alt,
  className = '',
  containerRef,
  initialRotate = 0,
  initialX = 0,
  initialY = 0,
  caption = 'Snapshot'
}) => {
  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.15}
      // Physics config for natural inertia + bouncy boundary collisions
      dragTransition={{ 
        bounceStiffness: 300, 
        bounceDamping: 18, 
        power: 0.15,
        timeConstant: 250
      }}
      initial={{ x: initialX, y: initialY, rotate: initialRotate }}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 0, 
        zIndex: 50,
        boxShadow: "0 25px 50px -12px rgba(60, 54, 51, 0.25)"
      }}
      className={`absolute cursor-grab active:cursor-grabbing bg-[#FFFDF9] p-3 pb-8 rounded-xl shadow-md border border-[#EBE6DD] w-48 md:w-56 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Photo Slot */}
      <div className="w-full aspect-[4/3] bg-neutral-100 overflow-hidden rounded-lg mb-3 select-none pointer-events-none">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false} 
        />
      </div>
      {/* Handwriting label */}
      <p className="text-center font-serif text-sm text-[#7D7468] italic select-none pointer-events-none">
        {caption}
      </p>
    </motion.div>
  );
};
