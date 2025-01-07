import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types/user';

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    // 입력값 검증
    if (!email || !password || !name) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }

    // Firebase Authentication으로 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // admin 계정 설정
    const adminEmails = ['admin01@tourism.com'];
    const isAdmin = adminEmails.includes(email);

    // Firestore에 사용자 정보 저장
    const userData: User = {
      id: uid,
      email,
      name,
      role: isAdmin ? 'admin' : 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', uid), userData);
    return userData;
  } catch (error: any) {
    console.error('Failed to register user:', error);
    
    // Firebase 에러 메시지를 한글로 변환
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('이미 사용 중인 이메일입니다.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('이메일/비밀번호 인증이 비활성화되어 있습니다.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('비밀번호가 너무 약합니다.');
    }
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    console.log('로그인 시도:', email);
    
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Firebase 인증 성공:', userCredential.user.uid);
    
    const { uid } = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', uid));
    console.log('Firestore 사용자 문서 조회:', userDoc.exists());
    
    if (!userDoc.exists()) {
      // 사용자 정보가 없을 경우 새로 생성
      const userData: User = {
        id: uid,
        email,
        name: email.split('@')[0], // 임시로 이메일의 앞부분을 이름으로 사용
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', uid), userData);
      console.log('새로운 사용자 정보 생성됨');
      return userData;
    }

    const userData = userDoc.data() as User;
    console.log('사용자 데이터 로드:', userData);
    
    if (userData.status === 'blocked') {
      await signOut(auth);
      throw new Error('차단된 계정입니다. 관리자에게 문의하세요.');
    }

    return userData;
  } catch (error: any) {
    console.error('로그인 실패:', error);
    
    // Firebase 인증 에러 메시지 한글화
    if (error.code === 'auth/user-not-found') {
      throw new Error('등록되지 않은 이메일입니다.');
    }
    if (error.code === 'auth/wrong-password') {
      throw new Error('잘못된 비밀번호입니다.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }
    if (error.code === 'auth/user-disabled') {
      throw new Error('비활성화된 계정입니다.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.');
    }
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Failed to logout:', error);
    throw error;
  }
};

export const getCurrentUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      return null;
    }
    return userDoc.data() as User;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const querySnapshot = await getDocs(usersQuery);
    return querySnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, status: 'active' | 'blocked'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), { status });
  } catch (error) {
    console.error('Failed to update user status:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<Pick<User, 'name' | 'email'>>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

// Firestore 데이터 정리 함수
export const cleanupFirestoreUsers = async (): Promise<void> => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const querySnapshot = await getDocs(usersQuery);
    
    const uniqueUsers = new Map();
    const deletePromises: Promise<void>[] = [];

    // 첫 번째 패스: 유효한 데이터 수집
    querySnapshot.docs.forEach(doc => {
      const userData = doc.data() as User;
      if (userData.email) {
        if (!uniqueUsers.has(userData.email)) {
          uniqueUsers.set(userData.email, {
            docId: doc.id,
            ...userData
          });
        } else {
          // 중복된 문서는 삭제 대상으로 표시
          deletePromises.push(deleteDoc(doc.ref));
        }
      } else {
        // 이메일이 없는 문서는 삭제 대상으로 표시
        deletePromises.push(deleteDoc(doc.ref));
      }
    });

    // 중복/잘못된 문서 삭제 실행
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(`${deletePromises.length}개의 중복/잘못된 문서가 정리되었습니다.`);
    }

  } catch (error) {
    console.error('Firestore 데이터 정리 중 오류 발생:', error);
    throw error;
  }
}; 