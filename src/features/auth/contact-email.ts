const contactEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type ContactEmail =
  | { status: "available"; address: string }
  | { status: "missing" | "invalid" };

export function readContactEmail(value: unknown): ContactEmail {
  if (value == null || (typeof value === "string" && value.trim() === "")) {
    return { status: "missing" };
  }

  // The backend Email value object supplies a normalized address.
  if (typeof value !== "string" || value.length > 254 || value.trim() !== value || !contactEmailPattern.test(value)) {
    return { status: "invalid" };
  }

  return { status: "available", address: value };
}
