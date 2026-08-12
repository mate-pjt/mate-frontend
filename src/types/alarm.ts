export type AlarmKind = "bid" | "company" | "mate";

export type AlarmNotification = {
  id: string;
  kind: AlarmKind;
  label: string;
  receivedAt: string;
  receivedDate: string;
  messageLines: readonly string[];
  unread: boolean;
};
