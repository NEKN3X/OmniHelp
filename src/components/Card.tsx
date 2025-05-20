const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="w-xs p-2">{children}</div>
    </>
  );
};

export default Card;
