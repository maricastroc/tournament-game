import toast from "react-hot-toast";
import { ApiError } from "@/lib/api/client";

const FALLBACK = "Could not reach the API.";

// Single funnel for every API failure — keeps the copy and styling coherent.
export function notifyApiError(err: unknown, fallback = FALLBACK): void {
  toast.error(err instanceof ApiError ? err.displayMessage : fallback);
}

export function notifySuccess(message: string): void {
  toast.success(message);
}
