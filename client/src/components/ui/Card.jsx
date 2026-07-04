function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-zinc-900
        rounded-xl
        border
        border-zinc-800
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;