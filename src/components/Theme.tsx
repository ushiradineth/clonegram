const themeObject = (theme: string) => {
  return {
    type: theme,
    primary: theme === "dark" ? " bg-zinc-900 text-white " : " bg-white text-black ",
    secondary: theme === "dark" ? " bg-zinc-800 text-white " : " bg-gray-100 text-black ",
    tertiary: theme === "dark" ? " bg-zinc-700 text-white " : " bg-gray-200 text-black ",
  };
};

export default themeObject;
