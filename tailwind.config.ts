import type { Config } from 'tailwindcss'

export default <Config>{
  content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B485B",
        secondary: "#092B34",
        accent: "#D24600",
        accentDark: "#471503",
        white: "#FFFFFF",
        grayLight: "#F3F3F3",
        black: "#000000",
      },
      ringColor: theme => ({ DEFAULT: theme("colors.primary") }),
    },
  },
  plugins: [],
}