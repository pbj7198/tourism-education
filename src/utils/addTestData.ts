import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const testPosts = [
  {
    title: '2024년 한국관광교육연구회 정기총회 개최 안내',
    content: `안녕하세요, 한국관광교육연구회 회원 여러분

2024년 한국관광교육연구회 정기총회를 다음과 같이 개최하고자 합니다.

■ 일시: 2024년 4월 12일(금) 14:00
■ 장소: 서울 더케이호텔 3층 크리스탈룸
■ 안건: 
  1. 2023년 사업보고 및 결산
  2. 2024년 사업계획 및 예산
  3. 임원 선출
  4. 기타 안건

많은 참석 부탁드립니다.`,
    author: '관리자',
    createdAt: '2024-03-15',
    views: 45
  },
  {
    title: '관광 교사 연수 프로그램 안내',
    content: `2024년 관광 교사 연수 프로그램을 다음과 같이 진행합니다.

■ 연수 주제: 관광산업 트렌드와 교육과정 적용
■ 일정: 2024년 3월 25일 ~ 3월 29일
■ 장소: 온라인 실시간 강의
■ 신청 방법: 나이스 교육연수시스템에서 신청
■ 이수 시간: 15시간

관심 있는 선생님들의 많은 참여 바랍니다.`,
    author: '관리자',
    createdAt: '2024-03-10',
    views: 32
  }
];

export const addTestPosts = async () => {
  try {
    const postsRef = collection(db, 'posts');
    for (const post of testPosts) {
      await addDoc(postsRef, post);
    }
    console.log('테스트 데이터가 성공적으로 추가되었습니다.');
  } catch (error) {
    console.error('테스트 데이터 추가 중 오류 발생:', error);
  }
}; 