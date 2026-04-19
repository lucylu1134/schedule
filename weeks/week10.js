// weeks/week_apr20.js
(function () {
  const week = {
    id: "week_apr20",
    startDate: "2026-04-20",
    endDate: "2026-04-26",
    label: "Week (Apr 20–26)",
    title: "Week Menu（减脂但好吃版）",

    menu: [
      {
        name: "Monday",
        badge: "Training Day",
        meals: [
          {
            title: "Lunch",
            text: "蒜香鸡腿肉 + 西兰花 + 米饭 100g（鸡腿肉 150g + 西兰花 200g，≈550 kcal）"
          },
          {
            title: "Dinner",
            text: "番茄鸡蛋 + 清炒生菜 + 米饭 80g（≈450 kcal）"
          }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          {
            title: "Lunch",
            text: "黑椒牛肉 + 洋葱 + 青椒 + 米饭 100g（牛肉 150g + 蔬菜 200g，≈600 kcal）"
          },
          {
            title: "Dinner",
            text: "蒸蛋 + 蒜蓉菠菜 + 米饭 80g（≈450 kcal）"
          }
        ]
      },
      {
        name: "Wednesday",
        badge: "Training Day",
        meals: [
          {
            title: "Lunch",
            text: "鱼香茄子（减油版）：茄子 250g + 瘦肉 80g + 米饭 100g（≈600 kcal）"
          },
          {
            title: "Dinner",
            text: "清蒸鲈鱼 + 青菜 + 米饭 80g（鲈鱼 250g + 青菜 150g，≈500 kcal）"
          }
        ]
      },
      {
        name: "Thursday",
        badge: "Training Day",
        meals: [
          {
            title: "Lunch",
            text: "肉末豆角：瘦肉末 120g + 豆角 250g + 米饭 100g（≈600 kcal）"
          },
          {
            title: "Dinner",
            text: "西红柿鸡蛋拌面：挂面 90g + 鸡蛋 2 个 + 番茄 2 个（≈550 kcal）"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "可乐鸡翅（控量版）：鸡翅 220g + 青菜 150g + 米饭 100g（≈650 kcal）"
          },
          {
            title: "Meal 2",
            text: "蒸蛋 + 清炒西兰花 + 米饭 80g（≈450 kcal）"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Break Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "自由一餐（尽量避免油炸，≈700–900 kcal）"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Comfort Meal",
        meals: [
          {
            title: "Main Meal",
            text: "红烧肉（控量版）150g + 青菜 200g + 米饭 120g（≈800 kcal）"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        { key: "eggs", label: "鸡蛋 6 个｜蒸蛋 3；拌面 2；番茄蛋 1" },
        { key: "chicken_thigh", label: "鸡腿肉 150g｜Mon Lunch" },
        { key: "beef", label: "牛肉 150g｜Tue Lunch" },
        { key: "ground_pork", label: "瘦肉末 200g｜Wed 80g；Thu 120g" },
        { key: "chicken_wings", label: "鸡翅 220g｜Fri Meal1" },
        { key: "fish", label: "鲈鱼 250g｜Wed Dinner" },
        { key: "pork_belly", label: "五花肉 150g｜Sun" }
      ],

      veggies: [
        { key: "broccoli", label: "西兰花 200g｜Mon Lunch" },
        { key: "lettuce", label: "生菜 200g｜Mon Dinner" },
        { key: "spinach", label: "菠菜 200g｜Tue Dinner" },
        { key: "eggplant", label: "茄子 250g｜Wed Lunch" },
        { key: "green_beans", label: "豆角 250g｜Thu Lunch" },
        { key: "tomato", label: "番茄 3 个｜Mon Dinner 1；Thu Dinner 2" },
        { key: "onion_pepper", label: "洋葱+青椒 200g｜Tue Lunch" },
        { key: "leafy_green", label: "青菜 500g｜Wed 150g；Fri 150g；Sun 200g" }
      ],

      other: [
        { key: "noodles", label: "挂面 90g（干重）｜Thu Dinner" },
        { key: "rice", label: "米（熟重）约1200g｜按菜单使用" },
        { key: "oyster_sauce", label: "蚝油" },
        { key: "five_spice", label: "五香粉" },
        { key: "soy_sauce", label: "生抽" },
        { key: "garlic", label: "蒜" }
      ]
    }
  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
