import Card from './Card';
import CardTitle from './CardTItle';
import CategoryRow from './categoryRow';
import { Link } from 'react-router-dom';
import NoDataAvailable from './NoDataAvailable';

export default function CategoryCard({ categoryTotals }) {
  const sortedCategoryTotals = categoryTotals?.sort(
    (a, b) => Number(a.category_sum) - Number(b.category_sum),
  );
  const slicedCategories = sortedCategoryTotals?.slice(0, 5);

  return (
    <Card>
      <div className="flex flex-row items-start justify-between">
        <CardTitle name="Categories" subTitle="Top 5 categories" />
        <Link to="/categories">
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
            {slicedCategories?.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
