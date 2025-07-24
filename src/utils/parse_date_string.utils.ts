export function parseDateString(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`);
}
