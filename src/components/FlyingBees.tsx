import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface Bee {
  id: string;
  left: number;       // percentage from left
  size: number;       // font size in px
  duration: number;   // flight duration in seconds
  delay: number;      // startup delay in seconds
  swayX: number[];    // keyframes for horizontal sway (px)
  depth: 'front' | 'mid' | 'back';
}

export const FlyingBees: React.FC = () => {
  const [bees, setBees] = useState<Bee[]>([]);

  const spawnFlock = useCallback((clientX?: number, clientY?: number) => {
    const beeCount = 12 + Math.floor(Math.random() * 10); // Spawn 12 to 21 bees per click
    const newBees: Bee[] = [];

    for (let i = 0; i < beeCount; i++) {
      const id = `${Date.now()}-${Math.random()}`;
      
      // Determine starting horizontal location.
      // If clientX is provided, cluster most around the click location with a nice spread, and let others spawn across the page.
      let leftPercent: number;
      if (clientX !== undefined && Math.random() > 0.25) {
        // 75% of bees cluster around the click point with some spread
        const clickPercent = (clientX / window.innerWidth) * 100;
        const variance = (Math.random() - 0.5) * 40; // +/- 20% variance
        leftPercent = Math.max(3, Math.min(97, clickPercent + variance));
      } else {
        // 25% spawn completely randomly across the screen width
        leftPercent = 3 + Math.random() * 94;
      }

      const size = 16 + Math.floor(Math.random() * 26); // 16px to 42px
      
      // Assign depth layer for parallax effect
      let depth: 'front' | 'mid' | 'back';
      if (size < 22) {
        depth = 'back';
      } else if (size > 34) {
        depth = 'front';
      } else {
        depth = 'mid';
      }

      const duration = 1.8 + Math.random() * 1.6; // 1.8s to 3.4s
      const delay = Math.random() * 0.4; // Staggered delays create a flying column effect

      // Create a unique curvy horizontal flight path for the sway
      const swayDirection = Math.random() > 0.5 ? 1 : -1;
      const baseSway = (20 + Math.random() * 45) * swayDirection;
      const swayX = [
        0,
        baseSway * 0.8,
        -baseSway * 0.4,
        baseSway * 1.1,
        -baseSway * 0.2,
        baseSway * 0.5,
        0
      ];

      newBees.push({
        id,
        left: leftPercent,
        size,
        duration,
        delay,
        swayX,
        depth
      });
    }

    setBees((prev) => [...prev, ...newBees]);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Avoid spawning bees when clicking form fields to keep interactions normal
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }
      spawnFlock(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [spawnFlock]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {bees.map((bee) => {
        // Adjust style based on depth layer to simulate 3D camera depth field
        let filter = 'none';
        let opacity = 0.9;
        let zIndex = 100;
        
        if (bee.depth === 'back') {
          filter = 'blur(1px)';
          opacity = 0.55;
          zIndex = 50;
        } else if (bee.depth === 'front') {
          filter = 'blur(0.5px)';
          opacity = 0.95;
          zIndex = 150;
        } else {
          opacity = 0.8;
          zIndex = 100;
        }

        return (
          <motion.div
            key={bee.id}
            initial={{ y: '105vh', x: 0, rotate: 0 }}
            animate={{
              y: '-15vh',
              x: bee.swayX,
              rotate: [0, -12, 18, -18, 12, 0]
            }}
            transition={{
              duration: bee.duration,
              delay: bee.delay,
              ease: 'easeInOut'
            }}
            onAnimationComplete={() => {
              setBees((prev) => prev.filter((b) => b.id !== bee.id));
            }}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${bee.left}%`,
              fontSize: `${bee.size}px`,
              filter,
              opacity,
              zIndex,
              textShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            🐝
          </motion.div>
        );
      })}
    </div>
  );
};
