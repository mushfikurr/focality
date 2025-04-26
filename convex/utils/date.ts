export function getTodayDayNumber(offsetDays = 0) {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  now.setDate(now.getDate() + offsetDays);
  return Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
}
