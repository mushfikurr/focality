import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatTimeInMs(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000); // 1 minute = 60000 milliseconds
  const seconds = Math.floor((milliseconds % 60000) / 1000); // Get the seconds part
  const ms = milliseconds % 1000; // Get the milliseconds part

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
}

export function formatTimestampToHS(timestamp: number): string {
  const focusDuration = intervalToDuration({ start: 0, end: timestamp });
  return `${focusDuration.hours ?? 0}h ${focusDuration.minutes ?? 0}m`;
}
