export const Button = ({ children, onClick, type = "button", variant = "primary", ...props }) => {
  const base = "w-full h-[44px] rounded-[15px] font-semibold text-[16px] transition-all duration-200 cursor-pointer shadow-[0px_4px_6px_0px_rgba(0,0,0,0.22)]";

  const variants = {
    primary: "bg-[#ffe14e] text-[#192853] hover:brightness-105 active:scale-[0.98]",
    outline: "bg-transparent border border-white text-white hover:bg-white/10 flex items-center justify-center gap-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary}`}
      {...props}
    >
      {children}
    </button>
  );
};
