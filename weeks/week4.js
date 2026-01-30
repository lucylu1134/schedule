// weeks/week4.js
(function () {
  const week = {
    id: "week4",
    startDate: "2026-02-03",
    endDate: "2026-02-09",
    label: "Week 4 (Feb 3–9)",
    title: "Week 4 Menu",

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
            text: "西红柿炒蛋：鸡蛋 2 个 + 番茄 2 个 + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "清炒娃娃菜 + 米饭 80g"
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
            text: "肉末豆角：瘦肉末 120g + 豆角 250g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "紫菜蛋花汤 + 清炒西兰花 + 米饭 80g"
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
            text: "煎三文鱼：三文鱼 150g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "番茄豆腐汤 + 清炒菠菜 + 米饭 80g"
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
            text: "煎牛排：牛排 170g + 米饭 100g"
          },
          {
            title: "Dinner",
            text: "清炒蘑菇 + 米饭 80g"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "西红柿炒蛋（小份）：鸡蛋 1 个 + 番茄 1 个 + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "冬瓜虾皮汤 + 清炒娃娃菜 + 米饭 80g"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "煎三文鱼：三文鱼 130g + 米饭 100g"
          },
          {
            title: "Meal 2",
            text: "西兰花蛋花汤 + 清炒豆苗 + 米饭 80g"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Social Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "外食一餐，控制油量，主食约半碗米饭（≈100g 熟饭）"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        {
          key: "eggs",
          label: "鸡蛋 7 个｜Mon 1；Tue 2；Wed 1；Fri 1；Sat 1；汤用 1"
        },
        {
          key: "ground_pork",
          label: "瘦肉末 120g｜Tue Lunch"
        },
        {
          key: "salmon",
          label: "三文鱼 280g｜Wed Lunch 150g；Sat Meal1 130g"
        },
        {
          key: "beef",
          label: "牛排 170g｜Thu Lunch"
        },
        {
          key: "shrimp_skin",
          label: "虾皮 20g｜Fri Meal2"
        }
      ],

      veggies: [
        {
          key: "tomato",
          label: "番茄 5 个｜Mon 2；Fri 1；汤用 2"
        },
        {
          key: "green_beans",
          label: "豆角 250g｜Tue Lunch"
        },
        {
          key: "baby_cabbage",
          label: "娃娃菜 450g｜Mon Dinner 200g；Fri Meal2 250g"
        },
        {
          key: "broccoli",
          label: "西兰花 400g｜Tue Dinner 200g；Sat Meal2 200g"
        },
        {
          key: "spinach",
          label: "菠菜 200g｜Wed Dinner"
        },
        {
          key: "mushroom",
          label: "蘑菇 200g｜Thu Dinner"
        },
        {
          key: "winter_melon",
          label: "冬瓜 300g｜Fri Meal2"
        },
        {
          key: "dou_miao",
          label: "豆苗 200g｜Sat Meal2"
        },
        {
          key: "seaweed",
          label: "紫菜 1 小包｜Tue Dinner"
        }
      ],

      other: [
        {
          key: "rice",
          label: "米（熟重）约1200g｜每日按餐分配"
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
