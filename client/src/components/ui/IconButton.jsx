function IconButton({
  children,
  onClick,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`
        p-2
        rounded-lg
        hover:bg-zinc-800
        transition
        text-gray-300
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default IconButton;