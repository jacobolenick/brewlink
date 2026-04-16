import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function nanoid(length = 7): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getClickRate(
  current: number,
  previous: number
): { rate: number; positive: boolean; neutral: boolean } {
  if (previous === 0 && current === 0) {
    return { rate: 0, positive: true, neutral: true };
  }
  if (previous === 0) {
    return { rate: 100, positive: true, neutral: false };
  }
  const rate = ((current - previous) / previous) * 100;
  return {
    rate: Math.abs(Math.round(rate)),
    positive: rate >= 0,
    neutral: false,
  };
}
