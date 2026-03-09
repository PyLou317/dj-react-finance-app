import { Landmark } from 'lucide-react';

export default function NoDataAccountCard() {
  return (
    <div className="flex flex-col p-6 rounded-3xl min-w-80 min-h-50 border border-gray-400 bg-neutral-900 justify-between">
      <div className="flex w-8 h-8 rounded-2xl items-center justify-center">
        <Landmark className='text-white'/>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-40 text-gray-100 rounded">No Data</div>
        </div>
      </div>
      <div className="h-4 w-48 text-gray-100 rounded">Please sync accounts</div>
    </div>
  );
}