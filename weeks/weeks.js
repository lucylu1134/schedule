// weeks/weeks.js
(function () {
  const reg = window.WEEK_REGISTRY || {};
  const weeks = Object.values(reg);

  // sort by startDate
  weeks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  window.WEEKS = weeks;
})();
