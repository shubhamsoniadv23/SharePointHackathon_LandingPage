export const isoToDate = (isoString?: string): string => {
  const NewDate = isoString
    ? new Date(isoString).toLocaleDateString("en-DE")
    : "N/A";
  return NewDate;
};
