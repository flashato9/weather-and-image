export function getTimezoneDateString(current: Date, UTFMsOffset: number) {
  const UTFEpocMs = current.getTime();
  const abroadDate = new Date(UTFEpocMs + UTFMsOffset);
  const result = extractDateTimeString(abroadDate.toUTCString());

  return result;
}
export function extractDateTimeString(dateString: string) {
  return dateString.match(/.*\d\d:\d\d:\d\d/)!.map((val) => val)[0];
}
