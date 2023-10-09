export function currentMonth() {
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth(), 1, 0);
  return { firstDay, lastDay };
}

export function parseDate(dateStr) {
  dateStr = dateStr.split(" ");
  dateStr = dateStr[0].split("/");
  let year = dateStr[2];
  let month = dateStr[1];
  let date = dateStr[0];
  return new Date(parseInt(year, 10), parseInt(month, 10), parseInt(date, 10));
}

export function mySqlDate(date) {
  return new Date(date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

export function mySqlDateLocale(date, timeZone = "Asia/Jakarta") {
  const localeDate = new Date(date).toLocaleString("en-US", {
    timeZone: timeZone,
  });
  return mySqlDate(localeDate);
}
