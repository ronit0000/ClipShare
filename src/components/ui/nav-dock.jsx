import React, { useState, useRef, useCallback, useEffect } from 'react';

const NavDock = ({ items, className = '' }) => {
  const [mouseX, setMouseX] = useState(null);
  const [currentScales, setCurrentScales] = useState(items.map(() => 1));
  const dockRef = useRef(null);
  const itemRefs = useRef([]);
  const animationFrameRef = useRef(undefined);

  const baseSize = 14; // Reduced base font size for better mobile compatibility
  const maxScale = 1.5; // Maximum scale factor
  const minScale = 1.0;
  const effectWidth = 200; // Width of the magnification effect
  const baseSpacing = 32; // Increased base spacing between items

  // Magnification calculation
  const calculateTargetMagnification = useCallback((mousePosition) => {
    if (mousePosition === null) {
      return items.map(() => minScale);
    }

    return items.map((_, index) => {
      const itemElement = itemRefs.current[index];
      if (!itemElement) return minScale;

      const rect = itemElement.getBoundingClientRect();
      const dockRect = dockRef.current?.getBoundingClientRect();
      if (!dockRect) return minScale;

      const itemCenter = rect.left + rect.width / 2 - dockRect.left;
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      
      if (itemCenter < minX || itemCenter > maxX) {
        return minScale;
      }
      
      const theta = ((itemCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [items]);

  // Animation loop
  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const lerpFactor = mouseX !== null ? 0.15 : 0.1;

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - targetScales[index]) > 0.005
    );
    
    if (scalesNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, currentScales]);

  // Start/stop animation loop
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  // Mouse movement handler
  const handleMouseMove = useCallback((e) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  return (
    <div 
      ref={dockRef}
      className={`flex space-x-4 md:space-x-10 text-gray-300 font-iceland ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {items.map((item, index) => {
        const scale = currentScales[index];
        
        return (
          <span
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            className="cursor-pointer hover:text-white transition-colors duration-200 select-none px-1 md:px-2 text-sm md:text-base"
            onClick={item.onClick}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              fontSize: `${baseSize * scale}px`,
              transition: mouseX === null ? 'transform 0.3s ease-out' : 'none'
            }}
          >
            {item.label}
          </span>
        );
      })}
    </div>
  );
};

export default NavDock;