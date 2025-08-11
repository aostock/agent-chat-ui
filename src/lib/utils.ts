import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatTimeAgo(dateInput: any) {
//   const date = typeof dateInput === "object" ? dateInput : new Date(dateInput);
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);

//   const minutes = Math.floor(seconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
//   const months = Math.floor(days / 30); // Approximate months
//   const years = Math.floor(days / 365); // Approximate years

//   if (seconds < 60) {
//     return seconds === 0
//       ? "just now"
//       : `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
//   } else if (minutes < 60) {
//     return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
//   } else if (hours < 24) {
//     return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
//   } else if (days < 30) {
//     return `${days} day${days !== 1 ? "s" : ""} ago`;
//   } else if (months < 12) {
//     return `${months} month${months !== 1 ? "s" : ""} ago`;
//   } else {
//     return `${years} year${years !== 1 ? "s" : ""} ago`;
//   }
// }

export function formatTimeAgo(
  dateInput: Date | string | number,
  locale = "en",
) {
  if (dateInput === null || dateInput === undefined) {
    return "";
  }
  const timestamp =
    typeof dateInput === "object" ? dateInput : new Date(dateInput);
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000; // Difference in seconds

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diff < 60) {
    // Less than a minute
    return rtf.format(-Math.floor(diff), "second");
  } else if (diff < 3600) {
    // Less than an hour
    return rtf.format(-Math.floor(diff / 60), "minute");
  } else if (diff < 86400) {
    // Less than a day
    return rtf.format(-Math.floor(diff / 3600), "hour");
  } else if (diff < 2592000) {
    // Less than a month (approx. 30 days)
    return rtf.format(-Math.floor(diff / 86400), "day");
  } else if (diff < 31536000) {
    // Less than a year (approx. 365 days)
    return rtf.format(-Math.floor(diff / 2592000), "month");
  } else {
    return rtf.format(-Math.floor(diff / 31536000), "year");
  }
}
