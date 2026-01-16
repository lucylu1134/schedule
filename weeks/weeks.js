// weeks/weeks.js
(function () {
  const reg = window.WEEK_REGISTRY || {};
  const list = Object.values(reg).slice();

  // sort by startDate (ascending)
  list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // Object map by id (stable access)
  const byId = {};
  list.forEach(w => (byId[w.id] = w));

  window.WEEKS = byId;       // { week1: {...}, week2: {...} }
  window.WEEK_LIST = list;   // [ {...}, {...} ] sorted
})();
