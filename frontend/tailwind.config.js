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
      }
    },
  },
  plugins: [],
};
