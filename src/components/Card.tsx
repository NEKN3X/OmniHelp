const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="p-2 w-max">{children}</div>
    </>
  );
};

export default Card;
