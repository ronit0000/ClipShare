/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'iceland': ['Iceland', 'sans-serif'],
        'mono': ['Iceland', 'monospace'],
      },
      fontSize: {
        'h1': ['80px', { lineHeight: '1.1' }],
        'h1-mobile': ['48px', { lineHeight: '1.1' }],
        'logo': ['64px', { lineHeight: '1.1' }],
        'logo-mobile': ['40px', { lineHeight: '1.1' }],
        'h2': ['56px', { lineHeight: '1.2' }],
        'h2-mobile': ['36px', { lineHeight: '1.2' }],
        'h3': ['32px', { lineHeight: '1.3' }],
        'h3-mobile': ['24px', { lineHeight: '1.3' }],
        'h4': ['20px', { lineHeight: '1.4' }],
        'h4-mobile': ['18px', { lineHeight: '1.4' }],
      },
      animation: {
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
      keyframes: {
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
      },
    },
  },
  plugins: [],
}
