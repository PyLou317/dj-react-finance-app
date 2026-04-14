function CompanyLogo({ domain, name, className = 'w-5 h-5' }) {
  const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

  if (!domain && !name) return null;

  const src = domain
    ? `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}&format=webp`
    : `https://img.logo.dev/name/${name}?token=${LOGO_DEV_PUBLIC_KEY}&format=webp`;

  return (
    <img
      src={src}
      alt={`${src} logo`}
      className={`${className} object-contain rounded-full`}
      loading="lazy"
    />
  );
}

export default CompanyLogo;
