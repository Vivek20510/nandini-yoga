import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PinModal = ({ onSuccess, onClose }) => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');

    // Auto-advance
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-verify when all filled
    if (value && index === 3) {
      const fullPin = [...newDigits.slice(0, 3), value.slice(-1)].join('');
      if (fullPin.length === 4) verifyPin(fullPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'Enter') {
      verifyPin(digits.join(''));
    }
  };

  const verifyPin = (pin) => {
    const correctPin = import.meta.env.VITE_ADMIN_PIN;
    if (pin === correctPin) {
      setError('');
      onSuccess();
    } else {
      setError('Incorrect PIN');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setDigits(['', '', '', '']);
        inputRefs[0].current?.focus();
      }, 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#0D1F2A]/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 bg-[#FAFAF7] rounded-3xl shadow-2xl w-full max-w-[340px] overflow-hidden"
        initial={{ scale: 0.92, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 16, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1D3C52] via-[#4A7A9B] to-[#1D3C52]" />

        <div className="px-8 pt-8 pb-9">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full text-[#A09880] hover:text-[#1D3C52] hover:bg-[#F0EDE0] transition-all duration-200"
          >
            <X size={15} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F0EDE0] flex items-center justify-center">
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <rect x="1" y="9" width="18" height="12" rx="3" stroke="#1D3C52" strokeWidth="1.5"/>
                <path d="M6 9V6a4 4 0 0 1 8 0v3" stroke="#1D3C52" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="15" r="1.5" fill="#1D3C52"/>
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-center text-[1.35rem] font-normal text-[#1D3C52] leading-snug mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Admin Access
          </h2>
          <p
            className="text-center text-[12px] text-[#8BA5B5] tracking-wide mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Enter your 4-digit PIN to continue
          </p>

          {/* PIN boxes */}
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center gap-3 mb-3"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 rounded-xl border text-center text-xl tracking-widest bg-white text-[#1D3C52] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-[#D8D2C4] focus:border-[#1D3C52] focus:ring-[#1D3C52]/15'
                } ${digit ? 'border-[#1D3C52]/40 bg-[#F4F1E6]' : ''}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            ))}
          </motion.div>

          {/* Error */}
          <div className="h-5 flex items-center justify-center mb-6">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-[12px] text-red-400"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-[#D8D2C4] text-[12px] tracking-[0.1em] uppercase font-medium text-[#8BA5B5] hover:border-[#1D3C52] hover:text-[#1D3C52] transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Cancel
            </button>
            <motion.button
              onClick={() => verifyPin(digits.join(''))}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-full bg-[#1D3C52] text-white text-[12px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300 shadow-md shadow-[#1D3C52]/20"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Verify
            </motion.button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default PinModal;
