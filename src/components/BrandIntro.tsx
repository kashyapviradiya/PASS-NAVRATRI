'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function BrandIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
    
    // Prevent body scrolling during intro
    document.body.style.overflow = 'hidden';

    // Duration config
    const timer = setTimeout(() => {
      setShowIntro(false);
      document.body.style.overflow = 'auto';
    }, shouldReduceMotion ? 500 : 1600); // Shorter for reduced motion

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [shouldReduceMotion]);

  if (!showIntro && isMounted) return null;

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="brand-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF8F6] pointer-events-auto"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
            transition={{ 
              duration: shouldReduceMotion ? 0.3 : 1.0, 
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <img 
              src="/brand/raaspass-logo.svg" 
              alt="RaasPass" 
              className="w-40 sm:w-52 h-auto object-contain" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
