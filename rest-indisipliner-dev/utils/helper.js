const _ = require("lodash");

/* Helper */
function pager(list, page, count, totalRow) {
  const totalPage = _.ceil(parseInt(totalRow, 10) / parseInt(count, 10));
  page = parseInt(page, 10);
  let prev = page - 1;
  let next = page + 1;
  if (prev <= 0) prev = null;
  if (next > totalPage) next = null;
  const pages = {
    current: page,
    next: next,
    prev: prev,
    total: totalPage,
  };
  return { list, pages, totalRow };
}
function mySqlDate(date) {
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}
function mySqlDateLocale(date, timeZone = "Asia/Jakarta") {
  return new Date(date)
    .toLocaleString("en-US", { timeZone: timeZone })
    .slice(0, 19)
    .replace("T", " ");
}
/* Module Export */
module.exports = { pager, mySqlDate, mySqlDateLocale };
