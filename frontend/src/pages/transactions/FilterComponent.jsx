import FilterBtn from './FilterBtn';

export default function FilterComponent({
  openFilters,
  setOpenFilters,
}) {
  return (
    // Used w-full to align with card layouts, added padding for breathing room
    <div className="flex items-center justify-between w-full px-1">
      <FilterBtn
        onClick={() => setOpenFilters(!openFilters)}
        isOpen={openFilters}
      />
    </div>
  );
}
