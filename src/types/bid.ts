export type BidStatus = "open" | "closing-soon" | "closed";

export type Bid = {
  id: string;
  title: string;
  organization: string;
  category: string;
  region: string;
  budget: number;
  publishedAt: string;
  closesAt: string;
  status: BidStatus;
  summary: string;
  tags: string[];
};
