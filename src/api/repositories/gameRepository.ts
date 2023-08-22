import { Game, User } from "../types/types";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  DocumentReference,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../firebase";

export class GameRepository {
  async getAllGames(providerId?: string | number): Promise<Game[]> {
    const currentTimestamp = new Date();

    const q = query(
      collection(db, "Game"),
      where("providerId", "==", providerId),
      where("date", ">", currentTimestamp)
    );

    const querySnapshot = await getDocs(q);
    var filteredGames = [] as Game[];

    await Promise.all(
      querySnapshot.docs.map(async (document) => {
        let userData = null;
        if (document.data().providerId) {
          const userRef = doc(db, "User", document.data().providerId);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            userData = userSnapshot.data();
          }
        }
        filteredGames.push({
          id: document.id,
          location: document.data().location,
          date: document.data().date,
          providerId: document.data().providerId,
          players: document.data().players,
          providerData: userData as User,
        });
      })
    );

    return filteredGames;
  }

  async scheduleGame(data: Game) {
    const newGame = await addDoc(collection(db, "Game"), data);
    return newGame;
  }

  async getGameById(id: string | undefined, userId?: string | number) {
    console.log(id, 'ID')
    if (id) {
      const gameDocRef = doc(db, "Game", id);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        const gameData = gameDoc.data();

        // Izvlačenje podataka o igračima
        const playersRefs: DocumentReference[] = gameData.players; // Eksplicitno naveden tip

        // Dohvatanje podataka o igračima koristeći Promise.all
        const playersDataPromises = playersRefs.map(async (playerRef) => {
          const playerDoc = await getDoc(playerRef);
          if (playerDoc.exists()) {
            return {
              id: playerDoc.id,
              firstName: playerDoc.data().firstName,
              lastName: playerDoc.data().lastName,
              role: playerDoc.data().role,
              username: playerDoc.data().username,
              email: playerDoc.data().email,
              stamina: playerDoc.data().stamina,
              offensive: playerDoc.data().offensive,
              defensive: playerDoc.data().defensive,
              avatar: playerDoc.data().avatar,
            };
          } else {
            return null;
          }
        });

        const playersData = await Promise.all(playersDataPromises);
        const isUserJoined = playersRefs.some(
          (playerRef) => playerRef.id === userId
        );

        let userData = null;
        if (gameDoc.data().providerId) {
          const userRef = doc(db, "User", gameDoc.data().providerId);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            userData = userSnapshot.data();
          }
        }

        return {
          id: gameDoc.id,
          location: gameData.location,
          date: gameData.date,
          players: playersData.filter(Boolean),
          isUserJoined: isUserJoined,
          providerData: userData,
        };
      } else {
        return null;
      }
    }
  }

  async joinGame({ userId, gameId }: { userId: string; gameId: string }) {
    const userDocRef = doc(db, "User", userId);
    const gameDocRef = doc(db, "Game", gameId);

    try {
      await updateDoc(gameDocRef, {
        players: arrayUnion(userDocRef),
      });

      const updatedGameSnapshot = await getDoc(gameDocRef);

      if (updatedGameSnapshot.exists()) {
        const updatedGame = {
          ...updatedGameSnapshot.data(),
          id: updatedGameSnapshot.id,
        };
        return updatedGame;
      } else {
        console.log("Updated game does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error joining game:", error);
      return null;
    }
  }

  async leaveGame({ userId, gameId }: { userId: string; gameId: string }) {
    const userDocRef = doc(db, "User", userId);
    const gameDocRef = doc(db, "Game", gameId);

    try {
      await updateDoc(gameDocRef, {
        players: arrayRemove(userDocRef),
      });

      const updatedGameSnapshot = await getDoc(gameDocRef);

      if (updatedGameSnapshot.exists()) {
        const updatedGame = {
          ...updatedGameSnapshot.data(),
          id: updatedGameSnapshot.id,
        };
        return updatedGame;
      } else {
        console.log("Updated game does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error joining game:", error);
      return null;
    }
  }
}

export const GameKeys = {
  GAME: "GAME",
  GAMES: "GAMES",
  ACTIVE_GAMES: "ACTIVE_GAMES",
};
