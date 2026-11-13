import { ApiError } from "@/data/shared/errors";

export function isMembershipSubmissionUncertain(error: unknown): boolean {
  return !(error instanceof ApiError) || error.status < 400 || error.status === 408 || error.status === 409 || error.status >= 500;
}
