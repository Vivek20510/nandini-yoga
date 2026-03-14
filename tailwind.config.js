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
        slideInLeft: "slideInLeft 0.6s ease-out",
        slideInRight: "slideInRight 0.6s ease-out",
        bounceIn: "bounceIn 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 2s infinite",
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
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "gradient-modern": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-peach": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-mint": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      },
    },
  },
  plugins:[require('@tailwindcss/line-clamp')],
};
