/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                'md': '750px',
                'lg': '1150px'
            },
        },
    },
    plugins: [],
};