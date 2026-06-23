const logoImg = "https://www.figma.com/api/mcp/asset/22887154-a5bd-4d01-80aa-c980e9643bbb";

export const Logo = ({ size = "large" }) => {
  const imgSize = size === "large" ? "w-[216px] h-[216px]" : "w-[140px] h-[140px]";
  return (
    <div className="flex flex-col items-center">
      <img src={logoImg} alt="Evenza Logo" className={imgSize + " object-contain"} />
    </div>
  );
};
