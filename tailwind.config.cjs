/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                'xsm': '320px',
                'md': '750px',
                'lg': '1150px'
            },
        },
    },
    plugins: [
        function({ addVariant }) {
            addVariant('child', '& > *');
            addVariant('child-hover', '& > *:hover');
        },
        require('@tailwindcss/aspect-ratio')

    ],
};