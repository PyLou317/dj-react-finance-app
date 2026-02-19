import { ListFilterPlus } from 'lucide-react';

export default function FilterBtn({ onClick, isOpen }) {
  return (
    <div
      className="flex flex-row gap-1 justify-start items-center text-sm cursor-pointer"
      onClick={onClick}
    >
      <ListFilterPlus size={15} />{' '}
      {isOpen ? <span>Close</span> : <span>Filter</span>}
    </div>
  );
}
