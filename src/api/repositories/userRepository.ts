import { User } from "../types/types";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

import { sendPasswordResetEmail, signOut } from "firebase/auth";

import { db, storage } from "../firebase";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";

export class UserRepository {
  async resetPassword(email: string) {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      // Obrada greške i prosleđivanje dalje kako bi je uhvatio onError povratni poziv
      throw error;
    }
  }

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
      avatar: data.avatar,
      stamina: data.stamina,
      defensive: data.defensive,
      offensive: data.offensive,
    });
  }

  async updateUser(data: User) {
    const userRef = doc(db, "User", data.id.toString());
    updateDoc(userRef, {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      role: data.role,
      providerId: data.providerId,
      avatar: data.avatar,
      stamina: data.stamina,
      defensive: data.defensive,
      offensive: data.offensive,
    });
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
        avatar: doc.data().avatar,
        offensive: doc.data().offensive,
        defensive: doc.data().defensive,
        stamina: doc.data().stamina,
      });
    });

    return filteredUsers;
  }

  async uploadProduct(file: Blob | ArrayBuffer) {
    try {
      // Upload image.
      const imageRef = ref(storage, `images/avatar`);
      const uploadImage = await uploadBytes(imageRef, file);

      // Create file metadata.
      const newMetadata = {
        cacheControl: "public,max-age=2629800000", // 1 month
        contentType: uploadImage.metadata.contentType,
      };

      await updateMetadata(imageRef, newMetadata);

      // Get the image URL.
      const publicImageUrl = await getDownloadURL(imageRef);
      console.log("heej?", publicImageUrl);
      return publicImageUrl;
    } catch (error) {
      console.log(error);
    }
  }
}

export const UserKeys = {
  USER: "USER",
  USERS: "USERS",
};
