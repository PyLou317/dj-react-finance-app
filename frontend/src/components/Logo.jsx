function CompanyLogo({ name, className = 'w-5 h-5' }) {
  const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

  if (!name) return null;

  const logoUrl = `https://img.logo.dev/name/${name}?token=${LOGO_DEV_PUBLIC_KEY}&format=webp`;

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={`${className} object-contain rounded-full`}
      loading="lazy"
    />
  );
}

export default CompanyLogo;
