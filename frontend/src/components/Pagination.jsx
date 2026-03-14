export default function Pagination({
  previous,
  next,
  page,
  setPage,
  setSearchParams,
}) {
  const handlePageDecrease = () => {
    setPage((prev) => prev - 1);

    setSearchParams({ page: page });
  };

  const handlePageIncrease = () => {
    setPage((prev) => prev + 1);

    setSearchParams({ page: page });
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
      <button className="flex items-center justify-center h-10 w-10 bg-teal-500 text-white rounded-full">
        {page}
      </button>
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
