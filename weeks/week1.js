// weeks/week1.js
(function () {
  const week = {
    id: "week1",
    startDate: "2026-01-13",   // <-- change to your real start
    endDate:   "2026-01-19",
    label: "Week 1 (Jan 13–19)",
    title: "Week 1 Menu (four fixed veggies)",
    menu: [
      // ... your existing menu days unchanged
    ],
    grocery: {
      proteins: [
        // { key:"...", label:"..." }
      ],
      veggies: [
        // Chinese veggie names stay Chinese
      ],
      other: []
    }
  };

  // register
  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
