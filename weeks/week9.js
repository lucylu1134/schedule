// weeks/week_mar23.js
(function () {
  const week = {
    id: "week_apr06",
    startDate: "2026-04-06",
    endDate: "2026-04-12",
    label: "Week (Apr 06–12)",
    title: "Week Menu 9",

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
            text: "蒸蛋 + 清炒菠菜 + 米饭 100g（≈450 kcal）"
          }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          {
            title: "Lunch",
            text: "肉末豆角：瘦肉末 120g + 豆角 250g + 米饭 100g（≈600 kcal）"
          },
          {
            title: "Dinner",
            text: "干锅花菜（少油版）：花菜 300g + 五花肉 50g + 米饭 80g（≈550 kcal）"
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
            text: "黑椒牛肉 + 洋葱 + 米饭 100g（牛肉 150g + 洋葱 150g，≈600 kcal）"
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
            text: "可乐鸡翅（控量版）：鸡翅 250g + 青菜 150g + 米饭 100g（≈650 kcal）"
          },
          {
            title: "Meal 2",
            text: "蒸蛋 + 蒜蓉生菜 + 米饭 80g（≈450 kcal）"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Break Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "自由一餐（≈700–900 kcal）"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Cooking Day · One Main Meal",
        meals: [
          {
            title: "Main Meal",
            text: "红烧肉 + 青菜 + 米饭 120g（五花肉 200g + 青菜 200g，≈850 kcal）"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        { key: "eggs", label: "鸡蛋 5 个｜蒸蛋 3；拌面 2" },
        { key: "ground_pork", label: "瘦肉末 200g｜肉末豆角 120g；鱼香茄子 80g" },
        { key: "pork_belly", label: "五花肉 250g｜干锅 50g；红烧肉 200g" },
        { key: "chicken_wings", label: "鸡翅 250g｜Fri Meal1" },
        { key: "chicken_thigh", label: "鸡腿肉 150g｜Mon Lunch" },
        { key: "beef", label: "牛肉 150g｜Thu Lunch" },
        { key: "fish", label: "鲈鱼 250g｜Wed Dinner" }
      ],

      veggies: [
        { key: "green_beans", label: "豆角 250g｜Tue Lunch" },
        { key: "cauliflower", label: "花菜 300g｜Tue Dinner" },
        { key: "eggplant", label: "茄子 250g｜Wed Lunch" },
        { key: "tomato", label: "番茄 2 个｜Thu Dinner" },
        { key: "spinach", label: "菠菜 200g｜Mon Dinner" },
        { key: "broccoli", label: "西兰花 200g｜Mon Lunch" },
        { key: "lettuce", label: "生菜 200g｜Fri Meal2" },
        { key: "onion", label: "洋葱 150g｜Thu Lunch" },
        { key: "leafy_green", label: "青菜 350g｜Wed 150g；Fri 150g；Sun 200g" }
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
