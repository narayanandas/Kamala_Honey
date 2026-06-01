import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

interface Bee {
  id: string;
  left: number;       // percentage from left
  size: number;       // font size in px
  duration: number;   // flight duration in seconds
  delay: number;      // startup delay in seconds
  swayX: number[];    // keyframes for horizontal sway (px)
  depth: 'front' | 'mid' | 'back';
  flip: boolean;      // face left or right based on initial sway direction
}

export const FlyingBees: React.FC = () => {
  const [bees, setBees] = useState<Bee[]>([]);
  const lastTouchTime = useRef<number>(0);

  const spawnFlock = useCallback((clientX?: number, clientY?: number) => {
    // Generate a massive swarm of 25 to 40 bees per interaction!
    const beeCount = 25 + Math.floor(Math.random() * 16); 
    const newBees: Bee[] = [];

    for (let i = 0; i < beeCount; i++) {
      const id = `${Date.now()}-${Math.random()}-${i}`;
      
      // Determine starting horizontal location
      let leftPercent: number;
      if (clientX !== undefined && Math.random() > 0.15) {
        // 85% of bees cluster around the click/tap location with variance
        const clickPercent = (clientX / window.innerWidth) * 100;
        // On mobile, keep the variance tighter so they remain visible on screen
        const maxVariance = window.innerWidth < 768 ? 20 : 35;
        const variance = (Math.random() - 0.5) * maxVariance; 
        leftPercent = Math.max(2, Math.min(98, clickPercent + variance));
      } else {
        // 15% spawn completely randomly across the screen width for background ambience
        leftPercent = 2 + Math.random() * 96;
      }

      // Determine 3D Depth Layer (Front, Mid, Back)
      // This creates a photographic depth-of-field experience
      const depthRand = Math.random();
      let depth: 'front' | 'mid' | 'back';
      let size = 20;
      let duration = 2.5;
      let delay = Math.random() * 0.45; // Staggered delays create a column of flying bees

      if (depthRand < 0.3) {
        // 1. BACK layer: Tiny, background bees, heavy blur, slow ascent, lower opacity
        depth = 'back';
        size = 11 + Math.floor(Math.random() * 7); // 11px to 17px
        duration = 3.6 + Math.random() * 2.2;     // 3.6s to 5.8s
        delay = Math.random() * 0.6;              // Dragged out delays
      } else if (depthRand > 0.8) {
        // 2. FRONT layer: Huge foreground bees, zoomed in, close to lens (motion blurred), extremely fast flyby
        depth = 'front';
        size = 38 + Math.floor(Math.random() * 18); // 38px to 56px
        duration = 1.1 + Math.random() * 0.7;       // 1.1s to 1.8s (Zippy!)
        delay = Math.random() * 0.25;               // Quick release
      } else {
        // 3. MID layer: Standard focused bees
        depth = 'mid';
        size = 20 + Math.floor(Math.random() * 14); // 20px to 33px
        duration = 2.0 + Math.random() * 1.3;       // 2.0s to 3.3s
      }

      // Create a wavy horizontal flight path for the sway
      const swayDirection = Math.random() > 0.5 ? 1 : -1;
      const flip = swayDirection < 0; // Flip emoji horizontally if moving leftwards
      
      // On mobile, scale down sway slightly so bees don't slide off-screen
      const mobileScale = window.innerWidth < 768 ? 0.65 : 1.0;
      const baseSway = (25 + Math.random() * 55) * swayDirection * mobileScale;
      
      const swayX = [
        0,
        baseSway * 0.7,
        -baseSway * 0.3,
        baseSway * 1.0,
        -baseSway * 0.1,
        baseSway * 0.4,
        0
      ];

      newBees.push({
        id,
        left: leftPercent,
        size,
        duration,
        delay,
        swayX,
        depth,
        flip
      });
    }

    setBees((prev) => [...prev, ...newBees]);
  }, []);

  useEffect(() => {
    const handleEvent = (clientX: number, clientY: number, target: HTMLElement) => {
      // Avoid spawning bees when clicking form fields, inputs, or selects
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.isContentEditable ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select')
      ) {
        return;
      }
      spawnFlock(clientX, clientY);
    };

    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore click if it was just preceded by a touch event to avoid double triggers on mobile
      if (Date.now() - lastTouchTime.current < 400) {
        return;
      }
      handleEvent(e.clientX, e.clientY, e.target as HTMLElement);
    };

    const handleGlobalTouch = (e: TouchEvent) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        lastTouchTime.current = Date.now();
        const touch = e.changedTouches[0];
        handleEvent(touch.clientX, touch.clientY, e.target as HTMLElement);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchend', handleGlobalTouch, { passive: true });
    
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchend', handleGlobalTouch);
    };
  }, [spawnFlock]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {bees.map((bee) => {
        // Adjust custom styles based on 3D depth layers to simulate deep focus fields
        let filter = 'none';
        let opacity = 0.85;
        let zIndex = 100;
        
        if (bee.depth === 'back') {
          filter = 'blur(1.6px)'; // Soft far focus blur
          opacity = 0.5;
          zIndex = 50;
        } else if (bee.depth === 'front') {
          filter = 'blur(1.0px)'; // Foreground motion/depth blur
          opacity = 0.95;
          zIndex = 200;
        } else {
          // Mid ground: perfect focus
          filter = 'none';
          opacity = 0.85;
          zIndex = 100;
        }

        return (
          <motion.div
            key={bee.id}
            initial={{ y: '105vh', x: 0, rotate: 0 }}
            animate={{
              y: '-15vh',
              x: bee.swayX,
              rotate: [0, -15, 15, -15, 15, 0]
            }}
            transition={{
              duration: bee.duration,
              delay: bee.delay,
              ease: 'easeInOut'
            }}
            onAnimationComplete={() => {
              setBees((prev) => prev.filter((b) => b.id !== bee.id));
            }}
            className="absolute select-none pointer-events-none transition-transform"
            style={{
              left: `${bee.left}%`,
              fontSize: `${bee.size}px`,
              filter,
              opacity,
              zIndex,
              transform: `scale(${bee.depth === 'front' ? 1.25 : bee.depth === 'back' ? 0.75 : 1.0}) ${bee.flip ? 'scaleX(-1)' : 'scaleX(1)'}`,
              textShadow: '0 4px 8px rgba(0,0,0,0.12)'
            }}
          >
            🐝
          </motion.div>
        );
      })}
    </div>
  );
};

