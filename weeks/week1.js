// weeks/week1.js
(function () {
  const week = {
    id: "week1",
    startDate: "2026-01-13",
    endDate: "2026-01-19",
    label: "Week 1 (Jan 13–19)",
    title: "Week 1 Menu (four fixed veggies)",

    menu: [
      {
        name: "Monday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "无糖希腊酸奶 120g + 水煮蛋 1 个（约 250 kcal）"
          },
          {
            title: "Lunch",
            text: "黑椒牛排粒炒平菇：牛排粒 140g + 平菇 170g，少油，黑胡椒调味。"
          },
          {
            title: "Dinner",
            text: "煎三文鱼排 + 清炒娃娃菜：三文鱼 150g；娃娃菜 120g 蒜末快炒。"
          }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "Starbucks Protein Box（约 300 kcal）"
          },
          {
            title: "Lunch",
            text: "鸡腿肉炒茄子（低油版）：鸡腿肉 150g + 茄子 200g，茄子先微波再快炒。"
          },
          {
            title: "Dinner",
            text: "虾仁炒金针菇：虾仁 200g + 金针菇 150g，大火快炒，黑胡椒调味。"
          }
        ]
      },
      {
        name: "Wednesday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "无糖酸奶 + 香蕉 1 根（约 260 kcal）"
          },
          {
            title: "Lunch",
            text: "牛肉片烧茄子：牛肉片 150g + 茄子 200g，少油焖烧入味。"
          },
          {
            title: "Dinner",
            text: "煎比目鱼排 + 蒜蓉娃娃菜：比目鱼 150g；娃娃菜 150g。"
          }
        ]
      },
      {
        name: "Thursday",
        badge: "Training Day",
        meals: [
          {
            title: "Breakfast (grab & go)",
            text: "无糖燕麦拿铁 + 蛋白棒（约 300 kcal）"
          },
          {
            title: "Lunch",
            text: "鸡胸肉炒平菇：鸡胸肉 150g + 平菇 150g，少油、生抽、黑胡椒。"
          },
          {
            title: "Dinner",
            text: "煎牛排 + 清炒金针菇：牛排 150g；金针菇 150g 蒜末快炒。"
          }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "牛排沙拉（无主食）：牛排 150g + 生菜 / 番茄，柠檬汁 / 黑胡椒 / 少量生抽。"
          },
          {
            title: "Meal 2",
            text: "鸡胸肉炒娃娃菜：鸡胸肉 120g + 娃娃菜 150g，蒜末快炒。"
          }
        ]
      },
      {
        name: "Saturday",
        badge: "Rest Day · Two Meals",
        meals: [
          {
            title: "Meal 1",
            text: "煎三文鱼 + 清炒娃娃菜：三文鱼 130–150g；娃娃菜 150g。"
          },
          {
            title: "Meal 2",
            text: "鸡腿肉炒平菇：鸡腿肉 150g + 平菇 150g。"
          }
        ]
      },
      {
        name: "Sunday",
        badge: "Social Day · One Meal",
        meals: [
          {
            title: "Shared Meal",
            text: "与朋友共享一餐，优先选择牛排 / 烤肉 / 铁板 / 寿司等高蛋白，其余时间只喝水或无糖茶。"
          }
        ]
      }
    ],

    grocery: {
      proteins: [
        { key: "beef_steak", label: "牛排 ~700g" },
        { key: "chicken_breast", label: "鸡胸肉 ~600g" },
        { key: "chicken_thigh", label: "鸡腿肉 ~300g" },
        { key: "salmon", label: "三文鱼 ~400g" },
        { key: "shrimp", label: "虾仁 ~200g" },
        { key: "flounder", label: "比目鱼 ~150g" },
        { key: "eggs", label: "鸡蛋 4–6 个" },
        { key: "yogurt", label: "无糖希腊酸奶 2–3 盒" }
      ],
      veggies: [
        { key: "jingzhen", label: "金针菇 ~500g" },
        { key: "pinggu", label: "平菇 ~500g" },
        { key: "baby_cabbage", label: "娃娃菜 ~600g" },
        { key: "eggplant", label: "茄子 ~600g" }
      ],
      other: [
        { key: "banana", label: "香蕉 2–3 根" },
        { key: "protein_bar", label: "蛋白棒 2 条" },
        { key: "olive_oil", label: "橄榄油 / 炒菜油" },
        { key: "black_pepper", label: "黑胡椒" },
        { key: "soy_sauce", label: "生抽" }
      ]
    }
  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
