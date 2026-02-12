import FilterBtn from './FilterBtn';

export default function FilterComponent({
  openFilters,
  clearFilters,
  setOpenFilters,
}) {
  return (
    // Used w-full to align with card layouts, added padding for breathing room
    <div className="flex items-center justify-between w-full mb-4 px-1">
      <FilterBtn
        onClick={() => setOpenFilters(!openFilters)}
        isOpen={openFilters}
      />

      {openFilters ? (
        <button
          className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors cursor-pointer"
          onClick={clearFilters}
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
