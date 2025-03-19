/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F9FAFB",
                primary: "#059669",

                borderContainer: "#F3F4F6",

                textPrimary: "#1F2937",
                textSecondary: "#4B5563",
            },
            fontFamily: {
                'inter': ['Inter', 'serif'],
            },
        },
    },
    plugins: [],
}