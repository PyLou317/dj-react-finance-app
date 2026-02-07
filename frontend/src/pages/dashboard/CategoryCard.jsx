import Card from './Card';
import CardTitle from './CardTItle';
import CategoryRow from './categoryRow';
import { Link } from 'react-router-dom';
import NoDataAvailable from './NoDataAvailable';

export default function CategoryCard({ categoryTotals }) {
  const sortedCategoryTotals = categoryTotals?.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <Card>
      <div className="flex flex-row items-start justify-between">
        <CardTitle name="Categories" />
        <Link to="/categories-list">
          <button className="text-sm pt-1 pe-2 hover:cursor-pointer">
            View All
          </button>
        </Link>
      </div>
      <div className="overflow-auto">
        {sortedCategoryTotals?.length === 0 ? (
          <NoDataAvailable />
        ) : (
          <ul className="overflow-auto scrollbar-hide">
            {sortedCategoryTotals?.map((category) => (
              <CategoryRow category={category} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
