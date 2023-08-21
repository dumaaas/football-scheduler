import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

export const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions;
  return date.toLocaleString("en-US", options);
};

export const formatTimestamp = (date: dayjs.Dayjs, time: dayjs.Dayjs) => {
  const dateTimestamp = Timestamp.fromMillis(date.valueOf());
  const timeTimestamp = Timestamp.fromMillis(time.diff(dayjs().startOf("day")));

  const combinedTimestamp = dateTimestamp.toMillis() + timeTimestamp.toMillis();
  return Timestamp.fromMillis(combinedTimestamp);
};

export function formatOnlyDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(dateString: string) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}h`;
}
