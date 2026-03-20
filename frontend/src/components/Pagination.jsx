export default function Pagination({
  previous,
  next,
  setSearchParams,
  currentPage,
}) {
  const handlePageDecrease = () => {
    const nextPage = Number(currentPage) - 1;
    setSearchParams((prev) => {
      prev.set('page', nextPage);
      return prev;
    });
  };

  const handlePageIncrease = () => {
    const nextPage = Number(currentPage) + 1;
    setSearchParams((prev) => {
      prev.set('page', nextPage);
      return prev;
    });
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={previous === null}
        onClick={handlePageDecrease}
        className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
      >
        &lt;
      </button>

      {Number(currentPage) > 1 && (
        <button
          onClick={handlePageDecrease}
          className={`flex items-center justify-center h-10 w-10 bg-white text-black rounded-full border border-gray-300`}
        >
          {Number(currentPage) - 1}
        </button>
      )}

      <button className="flex items-center justify-center h-10 w-10 bg-teal-500 text-white rounded-full">
        {Number(currentPage)}
      </button>

      {Number(currentPage) > 1 && (
        <button
          onClick={handlePageIncrease}
          className="flex items-center justify-center h-10 w-10 bg-white text-black rounded-full border border-gray-300"
        >
          {Number(currentPage) > 1 && Number(currentPage) + 1}
        </button>
      )}

      <button
        disabled={next === null}
        onClick={handlePageIncrease}
        className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
      >
        &gt;
      </button>
    </div>
  );
}
