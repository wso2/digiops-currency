import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ABI } from "@/data/abi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFunctionsByType() {
  const read: any[] = [];
  const write: any[] = [];
  for (const item of ABI) {
    if (item.type === "function") {
      if (item.stateMutability === "view" || item.stateMutability === "pure") {
        read.push(item);
      } else {
        write.push(item);
      }
    }
  }
  return { read, write };
}
