import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AssessmentWizard } from './AssessmentWizard';

export function AssessmentModal() {
  const [isOpen, setIsOpen] = useState(false);

  // First time visitor check
  useEffect(() => {
    const isCompleted = localStorage.getItem('assessmentCompleted');
    if (isCompleted !== 'true') {
      // Trigger modal 5 seconds after load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Set localStorage so they aren't bugged again in this session
    localStorage.setItem('assessmentCompleted', 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/90 backdrop-blur-md">
        <AssessmentWizard onClose={handleClose} isEmbedded={true} />
      </div>
    </AnimatePresence>
  );
}
