import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const lines = [
    'Hi, Hana.',
    'Welcome to your little corner of the internet.',
    'Nothing to post.',
    'Nothing to prove.',
    'Just your space.',
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), (i + 1) * 1200));
    });
    timers.push(setTimeout(() => setShowButton(true), lines.length * 1200 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center space-y-6">
        <AnimatePresence mode="wait">
          {lines.map((line, i) => (
            i < step && (
              <motion.p
                key={i}
                className="text-xl md:text-2xl font-light"
                style={{ color: 'var(--text)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {line}
              </motion.p>
            )
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              className="hana-btn mt-12 text-lg px-8 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onComplete}
            >
              Enter
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
