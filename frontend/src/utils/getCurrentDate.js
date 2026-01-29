export function getCurrentDate() {
  let newDate = new Date();
  const date = newDate.getDate();
  const shortMonthName = newDate.toLocaleString('default', { month: 'short' });
  const year = newDate.getFullYear();

  return `${shortMonthName} ${date}, ${year}`;
}
