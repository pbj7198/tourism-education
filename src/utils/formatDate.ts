import { Timestamp } from 'firebase/firestore';

export const formatDate = (date: Timestamp | Date) => {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 