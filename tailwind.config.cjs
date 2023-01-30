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
            animation: {
                float: 'float 12s infinite linear',
                'float-fast': 'float 10s infinite linear',
                'float-fastest': 'float 8s infinite linear',
            },
            keyframes: {
                float: {
                    '0%': {
                        transform: ' rotate(-0.001deg) translate3d(15px, 0, 0) rotate(-0.001deg)',
                    },
                    '100%': {
                        transform: 'rotate(360.001deg) translate3d(15px, 0, 0) rotate(-360.001deg)',
                    },
                },
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