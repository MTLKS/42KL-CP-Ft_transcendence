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
      },
      fontFamily: {
        'jbmono': ['JetBrains Mono', 'monospace'],
        'bungee': ['Bungee', 'cursive']
      },
      animation: {
        'pulse-short': 'pulse 0.3s ease-in-out 1',
        'right-to-left': 'right-to-left 0.5s ease-out 1'
      }
    },
  },
  plugins: [],
};
