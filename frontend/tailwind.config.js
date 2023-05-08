export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        highlight: "rgb(var(--highlight-color))",
        dimshadow: "rgb(var(--dimmer-shadow))",
        shadow: "rgb(var(--shadow-color))",
        accRed: "rgb(var(--accent-red))",
        accCyan: "rgb(var(--accent-cyan))",
        accYellow: "rgb(var(--accent-yellow))",
        accBlue: "rgb(var(--accent-blue))",
        accGreen: "rgb(var(--accent-green))",
      },
      fontFamily: {
        'jbmono': ['JetBrains Mono', 'monospace'],
        'bungee': ['Bungee', 'cursive']
      },
      animation: {
        'pulse-short': 'pulse 0.3s ease-in-out 1',
        'left-to-right': 'left-to-right 1',
        'shine': 'shine 2s infinite',
        'h-shake': 'h-shake 0.5s',
        'marquee': 'marquee 15s linear infinite',
      }
    },
  },
  plugins: [],
};
