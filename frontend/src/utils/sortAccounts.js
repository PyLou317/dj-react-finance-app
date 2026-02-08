export const sortAccounts = (accounts) => {
  if (!accounts || !Array.isArray(accounts)) return [];

  return [...accounts].sort((a, b) => {
    const getPriority = (acc) => {
      const name = acc.name.toLowerCase();
      const org = acc.org.domain.toLowerCase(); // SimpleFIN provides the domain

      // Scotiabank takes top priority
      if (org.includes('scotiabank')) {
        // If it's Scotia AND a Credit Card, maybe push it slightly lower than Scotia Cash
        return name.includes('visa') || name.includes('credit') ? 1 : 0;
      }

      // Other Credit Cards
      if (
        name.includes('visa') ||
        name.includes('mastercard') ||
        name.includes('credit')
      ) {
        return 3;
      }

      // Everything else (Other banks, etc.)
      return 2;
    };

    return getPriority(a) - getPriority(b);
  });
};
