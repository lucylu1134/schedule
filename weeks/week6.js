// weeks/week6.js
(function () {
  const week = {
    id: "week6",
    startDate: "2026-02-17",
    endDate: "2026-02-23",
    label: "Week 6 (Feb 17–23)",
    title: "Week 6 Menu",

    menu: [
      {
        name: "Monday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast",
            text: "水煮蛋 1 个 + 米饭 80g"
          },
          {
            title: "Lunch",
            text: "葱爆瘦肉：瘦猪肉 120g + 洋葱 200g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "番茄鸡蛋汤面：鸡蛋 1 个 + 番茄 2 个 + 挂面 80g（干重）"
          }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast",
            text: "无糖酸奶 150g + 米饭 80g"
          },
          {
            title: "Lunch",
            text: "煎三文鱼 150g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "蒜蓉娃娃菜 + 米饭 80g"
          }
        ]
      },
      {
        name: "Wednesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast",
            text: "水煮蛋 1 个 + 米饭 80g"
          },
          {
            title: "Lunch",
            text: "糖醋排骨（控油版）200g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "紫菜蛋花汤 + 蒜蓉生菜 + 米饭 80g"
          }
        ]
      },
      {
        name: "Thursday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast",
            text: "无糖酸奶 150g + 米饭 80g"
          },
          {
            title: "Lunch",
            text: "黑椒牛柳 150g + 青椒/洋葱 200g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "香菇鸡丝汤面：鸡胸肉 120g + 香菇 150g + 挂面 80g（干重）"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "蟹黄豆腐 200g + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "玉米排骨汤（排骨 200g + 玉米 1 根）+ 蒜蓉菠菜 + 米饭 80g"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Break Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "外食一餐，主食半碗米饭，避免油炸"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "宫保鸡丁（减油版）150g + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "清炒西兰花 + 米饭 80g"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        { key: "eggs", label: "鸡蛋 4 个｜Mon 1；Wed 1；紫菜汤 1；番茄汤面 1" },
        { key: "lean_pork", label: "瘦猪肉 120g｜Mon Lunch" },
        { key: "pork_ribs_sweet", label: "排骨 200g｜Wed Lunch 糖醋排骨" },
        { key: "pork_ribs_soup", label: "排骨 200g｜Fri 玉米排骨汤" },
        { key: "salmon", label: "三文鱼 150g｜Tue Lunch" },
        { key: "beef", label: "牛柳 150g｜Thu Lunch" },
        { key: "chicken_breast", label: "鸡胸肉 270g｜Thu Dinner 120g；Sun Lunch 150g" },
        { key: "tofu", label: "嫩豆腐 200g｜Fri Meal 1" },
        { key: "yogurt", label: "无糖酸奶 300g｜Tue & Thu 早餐" }
      ],

      veggies: [
        { key: "tomato", label: "番茄 2 个｜Mon 汤面" },
        { key: "onion", label: "洋葱 200g｜Mon Lunch" },
        { key: "baby_cabbage", label: "娃娃菜 200g｜Tue Dinner" },
        { key: "broccoli", label: "西兰花 200g｜Sun Dinner" },
        { key: "spinach", label: "菠菜 200g｜Fri Meal 2" },
        { key: "lettuce", label: "生菜 200g｜Wed Dinner" },
        { key: "corn", label: "玉米 1 根｜Fri 汤" },
        { key: "mushroom", label: "香菇 150g｜Thu 汤面" },
        { key: "seaweed", label: "紫菜 1 包｜Wed Dinner" }
      ],

      other: [
        { key: "noodles", label: "挂面 160g（干重）｜两次汤面" },
        { key: "rice", label: "米（熟重）约1400g｜按菜单使用" },
        { key: "garlic", label: "蒜" },
        { key: "soy_sauce", label: "生抽" },
        { key: "vinegar", label: "陈醋（糖醋排骨用）" }
      ]
    }
  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
