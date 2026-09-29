export function bidDetailHref(id: string, classificationNo: string | null = null): string {
  const path = `/bids/${encodeURIComponent(id)}`;
  return classificationNo ? `${path}?${new URLSearchParams({ bidClsfcNo: classificationNo })}` : path;
}
