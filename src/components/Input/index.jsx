export const Input = ({ label, value, onChange, type = "text", placeholder = "", icon, ...props }) => (
  <div className="relative w-full">
    {icon && (
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#515569]">
        {icon}
      </span>
    )}
    <input
      className={`
        w-full h-[50px] bg-white rounded-[30px] shadow-[0px_3px_2.5px_rgba(0,0,0,0.05)]
        text-[#515569] font-medium text-[16px] placeholder-[#515569]
        focus:outline-none focus:ring-2 focus:ring-[#ffe14e]
        ${icon ? "pl-11 pr-4" : "px-5"}
      `}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      {...props}
    />
  </div>
);
