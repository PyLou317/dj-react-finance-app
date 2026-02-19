import Loader from '../../components/Loader';

export default function TransactionStatBar({ isPending, count, totalSum }) {
  return (
    <div className="flex flex-row mb-2 text-sm items-start justify-between text-gray-400">
      <div className="flex flex-col gap-1">
        <p className="text-lg">Sum</p>
        <span className="text-3xl font-bold text-gray-900">
          {isPending ? (
            <Loader />
          ) : (
            `${totalSum >= 0 ? '+' : '-'} $${Math.abs(totalSum).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`
          )}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg">Count</p>
        <span className="text-3xl font-bold text-gray-900">
          {isPending ? (
            <Loader />
          ) : (
            count?.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          )}
        </span>
      </div>
    </div>
  );
}
