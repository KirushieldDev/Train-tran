import type {Config} from "tailwindcss";

export default {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                primary: "var(--color-primary)",
                primaryLight: "var(--color-primary-light)",
                primaryDark: "var(--color-primary-dark)",

                borderContainer: "var(--color-borderContainer)",

                textPrimary: "var(--color-textPrimary)",
                textSecondary: "var(--color-textSecondary)",
            },
        },
    },
    plugins: [],
} satisfies Config;
