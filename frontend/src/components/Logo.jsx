function CompanyLogo({ name, className = 'w-5 h-5' }) {
  const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

  if (!name) return null;

  return (
    <img
      src={`https://img.logo.dev/name/${name}?token=${LOGO_DEV_PUBLIC_KEY}`}
      alt="Company logo"
      className={`${className} object-contain rounded-full border border-gray-200`}
    />
  );
}

export default CompanyLogo;
