function Input({
  type = "text",
  placeholder,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`
        w-full
        bg-zinc-900
        border
        border-zinc-700
        rounded-xl
        px-4
        py-3
        outline-none
        text-white
        focus:border-blue-500
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;