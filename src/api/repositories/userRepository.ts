import { User } from "../types/types";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";

import { signOut } from "firebase/auth";

import { db } from "../firebase";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export class UserRepository {
  async registerUser(data: User) {
    const auth = getAuth();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      "123456"
    );

    const userDocRef = doc(db, "User", userCredential.user.uid);

    await setDoc(userDocRef, {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      role: data.role,
      providerId: data.providerId,
    });

    return userCredential;
  }

  async logIn({ email, password }: { email: string; password: string }) {
    const auth = getAuth();

    const user = await signInWithEmailAndPassword(auth, email, password);

    return user;
  }

  async signOut() {
    const auth = getAuth();
    const logOut = await signOut(auth);
    return logOut;
  }

  async getUserData(userId: string) {
    const userDocRef = doc(db, "User", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      userData.id = userDocSnapshot.id;
      return userData;
    }
  }
  async getAllUsers(providerId?: string | number): Promise<User[]> {
    const q = query(
      collection(db, "User"),
      where("providerId", "==", providerId)
    );

    const querySnapshot = await getDocs(q);
    var filteredUsers = [] as User[];

    querySnapshot.forEach((doc) => {
      filteredUsers.push({
        id: doc.id,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        username: doc.data().username,
        email: doc.data().email,
        role: doc.data().role,
        offensive: doc.data().offensive,
        defensive: doc.data().defensive,
        stamina: doc.data().stamina,
      });
    });

    return filteredUsers;
  }
}

export const UserKeys = {
  USER: "USER",
  USERS: "USERS",
};
