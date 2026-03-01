/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        yoga: {
          base: "#F8F5F2",        // Warm Linen – Background
          dark: "#3E3E3E",        // Deep Charcoal – Primary text
          accent: "#A9B9A4",      // Sage Green – Buttons, icons
          accentDark: "#8AA88F",  // Darker Sage – Hover state
          muted: "#D3D3D3",       // Fog Grey – Subtext, borders
          border: "#E6E6FA",      // Lavender Mist – Highlights/borders
          soft: "#FFF9F6",        // Off-white – Subtle sections
          highlight: "#D27D56",   // Clay Rose – CTAs and highlights
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out",
        fade: "fade 1s ease-in-out",
        slowPulse: "pulse 4s ease-in-out infinite",
        'spin-slow': 'spin 12s linear infinite',    
        
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins:[require('@tailwindcss/line-clamp')],
};
