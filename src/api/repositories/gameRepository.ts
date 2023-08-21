import { Game } from "../types/types";
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

    querySnapshot.forEach((doc) => {
      filteredGames.push({
        id: doc.id,
        location: doc.data().location,
        date: doc.data().date,
        providerId: doc.data().providerId,
        players: doc.data().players,
      });
    });

    return filteredGames;
  }

  async scheduleGame(data: Game) {
    const newGame = await addDoc(collection(db, "Game"), data);
    return newGame;
  }

  async getGameById(id: string | undefined, userId?: string | number) {
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
            };
          } else {
            return null;
          }
        });

        const playersData = await Promise.all(playersDataPromises);
        const isUserJoined = playersRefs.some(
          (playerRef) => playerRef.id === userId
        );

        return {
          id: gameDoc.id,
          location: gameData.location,
          date: gameData.date,
          players: playersData.filter(Boolean),
          isUserJoined: isUserJoined,
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
      const userDoc = await getDoc(userDocRef);
      const gameDoc = await getDoc(gameDocRef);

      const updatedGame = await updateDoc(gameDocRef, {
        players: arrayUnion(userDocRef),
      });

      return updatedGame;
    } catch {
      return null;
    }
  }

  async leaveGame({ userId, gameId }: { userId: string; gameId: string }) {
    const userDocRef = doc(db, "User", userId);
    const gameDocRef = doc(db, "Game", gameId);

    try {
      const updatedGame = await updateDoc(gameDocRef, {
        players: arrayRemove(userDocRef),
      });

      return updatedGame;
    } catch {
      return null;
    }
  }
}

export const GameKeys = {
  GAME: "GAME",
  GAMES: "GAMES",
  ACTIVE_GAMES: "ACTIVE_GAMES",
};
