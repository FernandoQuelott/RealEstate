var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#e9fff8",
                    100: "#c7ffe8",
                    200: "#8effd1",
                    300: "#4de9b2",
                    400: "#1ac68f",
                    500: "#0ba977",
                    600: "#07875f",
                    700: "#056b4c",
                    800: "#05553d",
                    900: "#064634"
                },
                ink: {
                    900: "#14121d",
                    700: "#353145",
                    500: "#5f5876"
                }
            },
            boxShadow: {
                soft: "0 12px 40px rgba(6, 70, 52, 0.12)",
                glass: "0 16px 60px rgba(20, 18, 29, 0.15)"
            }
        }
    },
    plugins: []
};
export default config;
