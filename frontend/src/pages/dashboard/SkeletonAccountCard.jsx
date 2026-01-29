export default function SkeletonAccountCard() {
  return (
    <div className="flex flex-col p-6 rounded-3xl min-w-80 min-h-50 border border-gray-400 bg-neutral-900 justify-between animate-pulse">
      <div className="w-8 h-8 rounded-2xl bg-neutral-700"></div>
      <div className="flex flex-row justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-neutral-600 rounded"></div>
        </div>
        <div className="size-6 rounded bg-neutral-700"></div>
      </div>
      <div className="h-4 w-48 bg-neutral-700 rounded"></div>
    </div>
  );
}
