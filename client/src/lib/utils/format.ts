export const formatOutput = {
  price: (price: number) => {
    if (!price) return 'n/a';
    return (
      new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price) + ' USD'
    );
  },

  marketCap: (marketCap: number) => {
    if (!marketCap) return 'n/a';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(marketCap);
  },
};
