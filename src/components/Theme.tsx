const themeObject = (theme: string) => {
  return {
    type: theme,
    primary: theme !== "dark" ? "bg-[#060000] text-[#ffffff]" : "bg-[#ffffff] text-[#060000]",  /* black and white */
    secondary: theme !== "dark" ? "bg-[#121212] text-[#fafafa]" : "bg-[#fafafa] text-[#121212]", /* dark gray and sligtly darker white */
    tertiary: theme !== "dark" ? "bg-[#262626] text-[#f0f0f0]" : "bg-[#f0f0f0] text-[#262626]", /* light gray and darker white */
    accent: "bg-red-300",
  };
};

export default themeObject;
