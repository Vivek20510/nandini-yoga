import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PinModal = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  // Ref for the PIN input field
  const pinInputRef = useRef(null);

  // Focus the input field when the modal opens
  useEffect(() => {
    pinInputRef.current?.focus();
  }, []);

  const handleVerify = () => {
    const correctPin = import.meta.env.VITE_ADMIN_PIN;
    if (pin === correctPin) {
      setError('');
      onSuccess();
    } else {
      setError('Incorrect PIN. Try again.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#fffaf5] rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center font-serif text-[#444] relative"
          initial={{ scale: 0.9, y: -30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#5e3c58]">
            🔒 Enter Admin PIN
          </h2>

          <input
            ref={pinInputRef} // Focus input programmatically
            type="password"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={handleKeyDown} // Handle Enter key press
            className="border border-[#d3b8b0] px-3 py-2 w-full rounded-lg text-center text-xl tracking-widest bg-[#fefaf8] focus:outline-none focus:ring-2 focus:ring-[#c78da3] placeholder:text-[#baa9a3]"
            placeholder="••••"
          />

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-500 mt-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-between gap-3">
            <motion.button
              onClick={handleVerify}
              className="bg-[#a15e7c] text-white px-4 py-2 rounded-lg w-full hover:bg-[#8b4f6a] transition-all focus:outline-none focus:ring-2 focus:ring-[#d6a4b6]"
              whileTap={{ scale: 0.95 }}
            >
              Verify
            </motion.button>

            <motion.button
              onClick={onClose}
              className="bg-gray-200 text-[#444] px-4 py-2 rounded-lg w-full hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#ddd]"
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PinModal;
