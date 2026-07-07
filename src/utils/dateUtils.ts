/**
 * Returns today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
