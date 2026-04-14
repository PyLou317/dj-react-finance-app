export default function UploadWrapper({ children }) {
  return (
    <div className="flex flex-col gap-5 p-20 w-full justify-center border-2 border-gray-200 rounded-2xl shadow-sm bg-white">
      {children}
    </div>
  );
}
