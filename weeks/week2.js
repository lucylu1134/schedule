// weeks/week2.js
(function () {
  const week = {
    id: "week2",
    startDate: "2026-01-20",
    endDate: "2026-01-26",
    label: "Week 2 (Jan 20–26)",
    title: "Week 2 Menu (家常菜减脂版 · 含主食)",

    menu: [
      {
        name: "Monday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "无糖希腊酸奶 120g + 水煮蛋 1 个（≈250 kcal）"
          },
          {
            title: "Lunch",
            text: "清蒸鱼 + 米饭：白肉鱼 180g，米饭 100g，姜葱蒸。"
          },
          {
            title: "Dinner",
            text: "娃娃菜鸡腿肉 + 米饭：娃娃菜200g，鸡肉150g，米饭100g。"
          }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "Starbucks Protein Box（≈300 kcal）"
          },
          {
            title: "Lunch",
            text: "虾仁滑炒云南菌：虾仁 180g + 蘑菇 200g，少油快炒。"
          },
          {
            title: "Dinner",
            text: "煎牛排 + 清炒娃娃菜：牛排 150g。"
          }
        ]
      },
      {
        name: "Wednesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "无糖酸奶 + 香蕉 1 根（≈260 kcal）"
          },
          {
            title: "Lunch",
            text: "肉末茄子（减脂版）+ 米饭：瘦肉末 100g + 茄子 200g（先蒸后炒），米饭 80–100g。"
          },
          {
            title: "Dinner",
            text: "白灼虾 + 金针菇：虾 200g，蘸生抽/蒜水。"
          }
        ]
      },
      {
        name: "Thursday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "无糖燕麦拿铁 + 蛋白棒（≈300 kcal）"
          },
          {
            title: "Lunch",
            text: "鸡腿肉烧土豆：鸡腿肉 150g + 土豆 150g，少油焖。"
          },
          {
            title: "Dinner",
            text: "云南风味干煸蘑菇：蘑菇 250g + 蒜末 + 少量辣椒。"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "清蒸鱼 + 蘑菇（无主食）：鱼 180g + 蘑菇 200g。"
          },
          {
            title: "Meal 2",
            text: "番茄炒蛋（小份）+ 娃娃菜：鸡蛋 1–2 个。"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "虾仁炒蘑菇（无主食）：虾仁 200g + 蘑菇。"
          },
          {
            title: "Meal 2",
            text: "牛排沙拉（无主食）：牛排 150g + 生菜。"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Social Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "与朋友共享一餐，优先家常菜/清蒸/炖，避免油炸，其余时间只喝水或无糖茶。"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        {
          key: "fish",
          label: "白肉鱼（鲈鱼/鳕鱼）400g｜Mon Lunch 180g；Fri Meal 1 180g"
        },
        {
          key: "shrimp",
          label: "虾 / 虾仁 600g｜Tue Lunch 180g；Wed Dinner 200g；Sat Meal 1 200g"
        },
        {
          key: "chicken_thigh",
          label: "去皮鸡腿肉 300–350g｜Mon Dinner 150g；Thu Lunch 150g"
        },
        {
          key: "beef",
          label: "牛排 300–350g｜Tue Dinner 150g；Sat Meal 2 150g"
        },
        {
          key: "ground_meat",
          label: "瘦肉末 200g｜Wed Lunch（肉末茄子）100g（剩余可冷冻）"
        },
        {
          key: "eggs",
          label: "鸡蛋 6 个｜Mon Dinner 2 个；Fri Meal 2 1–2 个"
        },
        {
          key: "yogurt",
          label: "无糖希腊酸奶 2 单杯｜Mon & Wed Breakfast 各 120g"
        }
      ],
    
      veggies: [
        {
          key: "pinggu",
          label: "平菇 700g｜Tue Lunch 200g；Thu Dinner 250g；Sat Meal 1 200g"
        },
        {
          key: "enoki",
          label: "金针菇 400g｜Wed Dinner 200g；Fri Meal 1 200g"
        },
        {
          key: "shiitake",
          label: "香菇 100g｜Mon Dinner 50–80g（提味用）"
        },
        {
          key: "eggplant",
          label: "茄子 1 根（300–350g）｜Wed Lunch 200g"
        },
        {
          key: "baby_cabbage",
          label: "娃娃菜 1 包（300–400g）｜Tue Dinner & Fri Meal 2 各约 150g"
        },
        {
          key: "tomato",
          label: "番茄 4 个｜Mon Dinner 2 个；Fri Meal 2 1–2 个"
        }
      ],
    
      other: [
        {
          key: "rice",
          label: "米（熟重）200g｜Mon Lunch 100g；Wed Lunch 80–100g"
        },
        {
          key: "potato",
          label: "土豆 1 个（200–250g）｜Thu Lunch 150g"
        },
        { key: "garlic", label: "蒜（常备）" },
        { key: "ginger", label: "姜（清蒸鱼用）" },
        { key: "scallion", label: "葱（清蒸鱼用）" },
        { key: "soy_sauce", label: "生抽" }
      ]
    }

  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
