import CompanyLogo from '@/components/Logo';

export default function SupportedBanksSelectionRow({
  bankUrl,
  name,
  isSelected,
  onSelect,
}) {
  return (
    <div
      className={`flex flex-col items-center gap-y-2 text-xs ${isSelected ? 'text-gray-600' : 'text-gray-400/75'}`}
    >
      <div
        key={bankUrl}
        onClick={onSelect}
        className={`transition-transform hover:scale-110 cursor-pointer ${isSelected ? 'border-4 border-blue-500 rounded-full' : 'border-4 border-transparent'}`}
      >
        <CompanyLogo domain={bankUrl} className="size-14" />
      </div>
      <span className="max-w-20 text-center">{name}</span>
    </div>
  );
}
