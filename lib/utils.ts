import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatTimeInMs(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000); // 1 minute = 60000 milliseconds
  const seconds = Math.floor((milliseconds % 60000) / 1000); // Get the seconds part
  const ms = milliseconds % 1000; // Get the milliseconds part

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
}
