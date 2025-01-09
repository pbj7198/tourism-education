import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
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
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, RegisterCredentials, LoginCredentials } from '../types/user';

export const register = async (credentials: RegisterCredentials) => {
  try {
    // Firebase Authentication으로 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // 사용자 프로필 업데이트
    await updateProfile(userCredential.user, {
      displayName: credentials.name
    });

    // Firestore에 추가 사용자 정보 저장
    const userData: User = {
      id: userCredential.user.uid,
      email: credentials.email,
      name: credentials.name,
      phoneNumber: credentials.phoneNumber,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    return userData;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message);
  }
};

export const login = async (credentials: LoginCredentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    const userData = userDoc.data() as User;

    if (userData.status === 'blocked') {
      await firebaseSignOut(auth);
      throw new Error('차단된 계정입니다. 관리자에게 문의하세요.');
    }

    return userData;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message);
  }
};

export const createAdminUser = async (credentials: RegisterCredentials) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    await updateProfile(userCredential.user, {
      displayName: credentials.name
    });

    const userData: User = {
      id: userCredential.user.uid,
      email: credentials.email,
      name: credentials.name,
      phoneNumber: credentials.phoneNumber,
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    return userData;
  } catch (error: any) {
    console.error('Admin creation error:', error);
    throw new Error(error.message);
  }
};

export const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      role: newRole
    });
  } catch (error: any) {
    console.error('Role update error:', error);
    throw new Error(error.message);
  }
};

export const updateUserStatus = async (userId: string, newStatus: 'active' | 'blocked') => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      status: newStatus
    });
  } catch (error: any) {
    console.error('Status update error:', error);
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new Error(error.message);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  } catch (error: any) {
    console.error('Get users error:', error);
    throw new Error(error.message);
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error: any) {
    console.error('Get user by email error:', error);
    throw new Error(error.message);
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