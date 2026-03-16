// weeks/weekX.js
(function () {
  const week = {
    id: "week_mar16",
    startDate: "2026-03-16",
    endDate: "2026-03-22",
    label: "Week (Mar 16–22)",
    title: "Week 7 Menu",

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
            title: "Dinner",
            text: "清蒸鸡腿：鸡腿 200g + 米饭 100g"
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
            text: "清蒸鲈鱼：鲈鱼 250g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "蒜蓉生菜 + 米饭 80g"
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
            text: "黑椒牛肉：牛肉 150g + 洋葱 150g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "回锅肉 + 米饭 80g"
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
            text: "清蒸鸡腿：鸡腿 200g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "西红柿鸡蛋拌面：挂面 90g（干重）+ 鸡蛋 2 个 + 番茄 2 个"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "清蒸鲈鱼：鲈鱼 250g + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "日本豆腐金针菇 + 米饭 80g"
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
            text: "清蒸鸡腿：鸡腿 200g + 米饭 100g"
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
        { key: "eggs", label: "鸡蛋 4 个｜Mon 早餐 1；Wed 早餐 1；Thu 拌面 2" },
        { key: "chicken_leg", label: "鸡腿 600g｜Mon Dinner 200g；Thu Lunch 200g；Sun Meal1 200g" },
        { key: "seabass", label: "鲈鱼 500g｜Tue Lunch 250g；Fri Meal1 250g" },
        { key: "beef", label: "牛肉 150g｜Wed Lunch" },
        { key: "port", label: "五花肉｜Wed Dinner" },
        { key: "tofu", label: "日本豆腐｜Fri Dinner" }
      ],

      veggies: [
        { key: "tomato", label: "番茄 2 个｜Thu 拌面" },
        { key: "onion", label: "洋葱 150g｜Wed Lunch" },
        { key: "lettuce", label: "生菜 200g｜Tue Dinner" },
        { key: "mushrooms", label: "金针菇 200g｜Fri Meal2" },
        { key: "broccoli", label: "西兰花 200g｜Sun Meal2" },
        { key: "garlic_sprouts", label: "蒜苗｜Wed Dinner" }
      ],

      other: [
        { key: "noodles", label: "挂面 90g（干重）｜Thu Dinner 拌面" },
        { key: "rice", label: "米（熟重）约1100g｜按菜单使用" },
        { key: "garlic", label: "葱姜蒜" },
        { key: "soy_sauce", label: "豆瓣酱" }
      ]
    }
  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
