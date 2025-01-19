export const maskUserId = (email: string | null): string => {
  if (!email) return '익명';
  
  const userId = email.split('@')[0];
  if (userId.length <= 4) {
    return userId + '*****';
  }
  return userId.slice(0, 4) + '*****';
}; 