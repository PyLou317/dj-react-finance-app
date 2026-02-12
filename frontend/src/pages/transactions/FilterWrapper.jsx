import { X } from 'lucide-react';

export default function FilterWrapper({
  name,
  selectOnChange,
  selectValue,
  children,
  cancel,
}) {
  return (
    <div className="flex flex-row items-center gap-1">
      <select
        name={name}
        id={name}
        className="py-1 w-full"
        onChange={selectOnChange}
        value={selectValue}
      >
        {children}
      </select>
      {selectValue ? (
        <button type="button" onClick={cancel} className="cursor-pointer p-2 rounded-lg hover:bg-gray-100/50">
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
}
