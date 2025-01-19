export const maskUserId = (userId: string): string => {
  if (!userId) return '';
  
  const atIndex = userId.indexOf('@');
  const id = atIndex === -1 ? userId : userId.substring(0, atIndex);
  
  const visibleLength = 4;
  const hiddenLength = id.length - visibleLength;
  
  if (id.length <= visibleLength) {
    return id;
  }
  
  return id.substring(0, visibleLength) + '*'.repeat(hiddenLength);
}; 