export function generateOTP(length = 6): string {
  const digits = '0123456789';
  return Array.from(
    { length },
    () => digits[Math.floor(Math.random() * digits.length)],
  ).join('');
}
