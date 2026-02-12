// weeks/week5.js
(function () {
  const week = {
    id: "week5",
    startDate: "2026-02-10",
    endDate: "2026-02-16",
    label: "Week 5 (Feb 10–16)",
    title: "Week 5 Menu",

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
            text: "煎三文鱼：三文鱼 150g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "鸡腿肉娃娃菜 + 米饭：去皮鸡腿肉 170g + 娃娃菜 200g + 米饭 80g"
          }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast",
            text: "无糖希腊酸奶 150g + 米饭 80g"
          },
          {
            title: "Lunch",
            text: "西红柿炒蛋：鸡蛋 2 个 + 番茄 2 个 + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "紫菜蛋花汤 + 清炒西兰花 + 米饭：紫菜 1 包 + 鸡蛋 1 个 + 西兰花 200g + 米饭 80g"
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
            text: "煎牛排：牛排 170g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "娃娃菜煎蛋汤 + 米饭：娃娃菜 250g + 鸡蛋 1 个 + 米饭 80g"
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
            text: "煎三文鱼：三文鱼 130g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "清炒蘑菇 + 米饭：蘑菇 200g + 米饭 80g"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "肉末豆角：瘦肉末 120g + 豆角 250g + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "紫菜蛋花汤 + 清炒娃娃菜 + 米饭：紫菜 1 包 + 鸡蛋 1 个 + 娃娃菜 200g + 米饭 80g"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Break Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "外食/自由一餐，控制油量，主食约半碗米饭（≈100g 熟饭）"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "西红柿炒蛋（小份）：鸡蛋 1 个 + 番茄 1 个 + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "煎牛排 + 清炒娃娃菜 + 米饭：牛排 170g + 娃娃菜 200g + 米饭 100g"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        {
          key: "eggs",
          label: "鸡蛋 7 个｜Mon 早餐 1；Tue 午餐 2；Tue 晚汤 1；Wed 早餐 1；Wed 晚汤 1；Fri 晚汤 1；Sun 午餐 1"
        },
        {
          key: "chicken_thigh",
          label: "去皮鸡腿肉 170g｜Mon Dinner"
        },
        {
          key: "ground_pork",
          label: "瘦肉末 120g｜Fri Meal 1"
        },
        {
          key: "salmon",
          label: "三文鱼 280g｜Mon Lunch 150g；Thu Lunch 130g"
        },
        {
          key: "beef",
          label: "牛排 340g｜Wed Lunch 170g；Sun Meal 2 170g"
        },
        {
          key: "yogurt",
          label: "无糖希腊酸奶 150g｜Tue Breakfast"
        }
      ],

      veggies: [
        {
          key: "tomato",
          label: "番茄 3 个｜Tue Lunch 2；Sun Meal 1 1"
        },
        {
          key: "green_beans",
          label: "豆角 250g｜Fri Meal 1"
        },
        {
          key: "baby_cabbage",
          label: "娃娃菜 850g｜Mon Dinner 200g；Wed Dinner 250g；Fri Meal 2 200g；Sun Meal 2 200g"
        },
        {
          key: "broccoli",
          label: "西兰花 200g｜Tue Dinner"
        },
        {
          key: "mushroom",
          label: "蘑菇 200g｜Thu Dinner"
        },
        {
          key: "seaweed",
          label: "紫菜 2 包｜Tue Dinner 1；Fri Meal 2 1"
        }
      ],

      other: [
        {
          key: "rice",
          label: "米（熟重）1520g｜按菜单精确使用（每餐 80–100g）"
        },
        { key: "garlic", label: "蒜" },
        { key: "soy_sauce", label: "生抽" },
        { key: "oil", label: "食用油（少量）" }
      ]
    }
  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
