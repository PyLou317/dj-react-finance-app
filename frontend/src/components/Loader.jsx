const Loader = ({ size }) => {
  return (
    <div className="flex justify-start items-center">
      <div
        className={`animate-spin rounded-full w-${size} h-${size} border-4 border-gray-300 border-t-blue-500`}
      ></div>
    </div>
  );
};

export default Loader;
