export default function Pagination({ previous, next, page, setPage }) {
  return (
    <div className="flex gap-2">
      <button
        disabled={previous === null}
        onClick={() => setPage((prev) => prev - 1)}
        className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
      >
        &lt;
      </button>
      <button className="flex items-center justify-center h-10 w-10 bg-teal-500 text-white rounded-full">
        {page}
      </button>
      <button
        disabled={next === null}
        onClick={() => setPage((prev) => prev + 1)}
        className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300"
      >
        &gt;
      </button>
    </div>
  );
}
