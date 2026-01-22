// weeks/week3.js
(function () {
  const week = {
    id: "week3",
    startDate: "2026-01-26",
    endDate: "2026-02-01",
    label: "Week 3 (Jan 26–Feb 1)",
    title: "Week 3 Menu",

    menu: [
      {
        name: "Monday",
        badge: "Training Day · (Use leftovers)",
        meals: [
          { title: "Breakfast (grab & go)", text: "无糖希腊酸奶 170g + 水煮蛋 1 个（≈300 kcal）" },
          { title: "Lunch (LEFTOVER from Week2 Monday noon)", text: "清蒸鱼 + 米饭：白肉鱼 180g，米饭 100g，姜葱蒸。（清库存）" },
          { title: "Dinner", text: "云南风味干煸蘑菇：蘑菇 250g + 蒜末 + 少量辣椒。（清库存）" }
        ]
      },
      {
        name: "Tuesday",
        badge: "Training Day",
        meals: [
          { title: "Breakfast (grab & go)", text: "Starbucks Protein Box（≈300 kcal）+ 美式/无糖茶" },
          { title: "Lunch", text: "清蒸鱼 + 蘑菇（无主食）：鱼 180g + 蘑菇 200g。（清库存）" },
          { title: "Dinner", text: "煎牛排 + 炒西兰花/蘑菇：牛排 170g + 西兰花 250g（或蘑菇 200g）" }
        ]
      },
      {
        name: "Wednesday",
        badge: "Training Day",
        meals: [
          { title: "Breakfast (grab & go)", text: "无糖酸奶 150g + 香蕉 1 根（≈260 kcal）" },
          { title: "Lunch", text: "肉末豆角（减脂版）+ 米饭：瘦肉末 120g + 豆角 250g（先焯再炒），米饭 80–100g" },
          { title: "Dinner", text: "白灼虾 + 金针菇 + 黄瓜：虾 220g，金针菇 200g，黄瓜 1 根（蘸生抽/蒜水）" }
        ]
      },
      {
        name: "Thursday",
        badge: "Training Day",
        meals: [
          { title: "Breakfast (grab & go)", text: "无糖燕麦拿铁 + 蛋白棒（≈300 kcal）" },
          { title: "Lunch", text: "鸡腿肉炖土豆胡萝卜：鸡腿肉 170g + 土豆 150g + 胡萝卜 120g（少油焖）" },
          { title: "Dinner", text: "蒸蛋 + 炒娃娃菜：鸡蛋 2 个（可加少量虾皮/葱花）+ 娃娃菜 250g" }
        ]
      },
      {
        name: "Friday",
        badge: "Rest Day · Two Meals",
        meals: [
          { title: "Meal 1", text: "番茄虾仁豆腐：虾仁 200g + 嫩豆腐 200g + 番茄 2 个（汤汁多，少油）" },
          { title: "Meal 2", text: "茄子焖鸡腿肉：鸡腿肉 150g + 茄子 200g（先蒸后炒），米饭 80–100g。" }
        ]
      },
      {
        name: "Saturday",
        badge: "Rest Day · Two Meals",
        meals: [
          { title: "Meal 1", text: "牛肉蘑菇汤（高蛋白饱腹）：瘦牛肉片 180g + 蘑菇 250g + 青菜一把（清汤）" },
          { title: "Meal 2", text: "虾仁炒蛋 + 拌黄瓜：虾仁 150g + 鸡蛋 1 个 + 黄瓜 1 根（少油）" }
        ]
      },
      {
        name: "Sunday",
        badge: "Social Day · One Meal",
        meals: [
          { title: "Shared Meal", text: "与朋友共享一餐：优先清蒸/炖/烤/火锅清汤；主食半份；甜饮/奶茶改无糖茶。其余时间只喝水或无糖茶。" }
        ]
      }
    ],

    grocery: {
      proteins: [
        { key: "fish", label: "白肉鱼（鲈鱼/鳕鱼）360g｜(Week3 需要：Fri Meal1 180g + Mon Lunch 180g) → 这两餐为清库存，若家里不够再补" },
        { key: "shrimp", label: "虾 / 虾仁 600–650g｜Tue Lunch 200g；Wed Dinner 220g；Sat Meal2 150g（可多买一点防止缩水）" },
        { key: "chicken_thigh", label: "去皮鸡腿肉 350–400g｜Mon Dinner 170g；Fri Dinner 150g" },
        { key: "beef", label: "牛排/瘦牛肉 350–400g｜Tue Dinner 170g；Sat Meal1 180g" },
        { key: "ground_meat", label: "瘦肉末 200–250g｜Wed Lunch 120g（剩余可冷冻）" },
        { key: "eggs", label: "鸡蛋 8 个｜Mon 早餐 1；Thu Dinner 2；Sat Meal2 1" },
        { key: "tofu", label: "嫩豆腐 2 盒（约400g）｜Fri Meal1 200g" },
        { key: "yogurt", label: "无糖希腊酸奶 3–4 单杯｜Mon/Wed 早餐" }
      ],
      veggies: [
        { key: "mushroom_mix", label: "蘑菇混合 900–1000g｜Mon Dinner 250g + Tue Lunch 200g + Sat Meal1 250g（不够再补）" },
        { key: "enoki", label: "金针菇 200g｜Wed Dinner 200g" },
        { key: "broccoli", label: "西兰花 1 大颗（约300g）｜Tue Dinner 配菜" },
        { key: "green_beans", label: "豆角 250g｜Wed Lunch 250g" },
        { key: "baby_cabbage", label: "娃娃菜 1 个（300g）｜Thu Dinner 250g" },
        { key: "tomato", label: "番茄 2 个｜Fri Meal1 2" },
        { key: "cucumber", label: "黄瓜 2 根｜Wed Dinner 1；Sat Meal2 1" },
        { key: "carrot", label: "胡萝卜 1 根｜Thu Lunch 1" },
        { key: "leafy_greens", label: "任意绿叶菜 1 袋｜Sat Meal1 加汤" },
        { key: "egg_plant", label: "茄子｜Fri Meal2 1 根" }
      ],
      other: [
        { key: "rice", label: "米（熟重）200g｜Mon Lunch 100g + Wed Lunch 80–100g + Fri Meal2 80–100g" },
        { key: "potato", label: "土豆 2 个（中等）｜Thu Lunch 150g" },
        { key: "garlic", label: "蒜（常备）" },
        { key: "ginger", label: "姜（清蒸鱼用）" },
        { key: "scallion", label: "葱（清蒸鱼用）" },
        { key: "soy_sauce", label: "生抽" },
        { key: "chili", label: "小米辣/干辣椒（干煸蘑菇用，可选）" }
      ]
    }
  };

  window.WEEK_REGISTRY = window.WEEK_REGISTRY || {};
  window.WEEK_REGISTRY[week.id] = week;
})();
