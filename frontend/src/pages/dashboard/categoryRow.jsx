import { capitalize } from "../../utils/capitalizeFirstLetter";

export default function CategoryRow({ category }) {
  // Format the currency to look professional
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(category.category_sum));

  return (
    <li className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-100">
      <div className="flex items-center gap-x-3">
        {/* Category Icon/Indicator */}
        {/* <div 
          className="w-2 h-8 rounded-full" 
          style={{ backgroundColor: category.color || '#cbd5e1' }}
        /> */}
        
        <div>
          <p className="text-sm font-medium text-gray-700">
            {capitalize(category.name)}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Category
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-gray-900">
          {formattedAmount}
        </p>
        <p className="text-[10px] text-red-500 font-medium">
          Spent this month
        </p>
      </div>
    </li>
  );
}