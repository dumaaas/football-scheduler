import { Timestamp } from "firebase/firestore";

export interface Game {
  id: string;
  date: Timestamp;
  location: string;
  providerId: string | number;
  players?: User[];
}

export interface User {
  id: number | string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  providerId?: string | number;
  stamina: number;
  offensive: number;
  defensive: number
}
