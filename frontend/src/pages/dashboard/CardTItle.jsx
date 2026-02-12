export default function CardTitle({ name, subTitle }) {
  return (
    <div className="flex flex-col mb-2">
      <h1 className="font-bold uppercase">{name}</h1>
      <small className="text-gray-400 text-xs">{subTitle}</small>
    </div>
  );
}
