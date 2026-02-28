/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#059669",
          50: "#ecfdf5",
        },
        surface: {
          DEFAULT: "#0f1117",
          50: "#f8f9fb",
          100: "#eef0f4",
          200: "#d5dae3",
          700: "#1a1d27",
          800: "#141620",
          900: "#0f1117",
        },
        panel: {
          DEFAULT: "#171923",
          light: "#1e2130",
          hover: "#232639",
        },
        bubble: {
          out: "#10b981",
          "out-dark": "#059669",
          in: "#1e2130",
        },
        muted: {
          DEFAULT: "#64748b",
          light: "#94a3b8",
          dark: "#475569",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 20px rgba(16, 185, 129, 0.15)",
        "soft-xl": "0 20px 60px rgba(0, 0, 0, 0.3)",
        float: "0 8px 32px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        "gradient-bubble": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-surface": "linear-gradient(180deg, #171923 0%, #0f1117 100%)",
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.6, transform: "scale(1.15)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideLeft: {
          from: { opacity: 0, transform: "translateX(12px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
