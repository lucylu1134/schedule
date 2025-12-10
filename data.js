// All week data (menus + grocery lists) lives here.
// To add Week 2 later, just add another object to this array.
const WEEKS = [
  {
    id: "week1",
    label: "Week 1（1.13–1.19）",
    title: "1.13–1.19 一周菜单（四蔬菜固定版）",
    menu: [
      {
        name: "周一",
        badge: "训练日",
        meals: [
          {
            title: "早餐（外带）",
            text: "无糖希腊酸奶 120g + 水煮蛋 1 个（约 250 kcal）。"
          },
          {
            title: "午餐：黑椒牛排粒炒平菇",
            text: "牛排粒 140g + 平菇 170g，少油，黑胡椒调味。"
          },
          {
            title: "晚餐：煎三文鱼排 + 清炒娃娃菜",
            text: "三文鱼排 150g；娃娃菜 120g 蒜末快炒。"
          }
        ]
      },
      {
        name: "周二",
        badge: "训练日",
        meals: [
          {
            title: "早餐（外带）",
            text: "Starbucks Protein Box（约 300 kcal）。"
          },
          {
            title: "午餐：鸡腿肉炒茄子（低油版）",
            text: "鸡腿肉 150g + 茄子 200g，茄子先微波再快炒。"
          },
          {
            title: "晚餐：虾仁炒金针菇",
            text: "虾仁 200g + 金针菇 150g，大火快炒，黑胡椒调味。"
          }
        ]
      },
      {
        name: "周三",
        badge: "训练日",
        meals: [
          {
            title: "早餐（外带）",
            text: "无糖酸奶 + 香蕉 1 根（约 260 kcal）。"
          },
          {
            title: "午餐：牛肉片烧茄子",
            text: "牛肉片 150g + 茄子 200g，少油焖烧入味。"
          },
          {
            title: "晚餐：煎比目鱼排 + 蒜蓉娃娃菜",
            text: "比目鱼排 150g；娃娃菜 150g 蒜蓉炒软。"
          }
        ]
      },
      {
        name: "周四",
        badge: "训练日",
        meals: [
          {
            title: "早餐（外带）",
            text: "无糖燕麦拿铁 + 蛋白棒（约 300 kcal）。"
          },
          {
            title: "午餐：鸡胸肉炒平菇",
            text: "鸡胸肉 150g + 平菇 150g，少油、生抽、黑胡椒。"
          },
          {
            title: "晚餐：煎牛排 + 清炒金针菇",
            text: "牛排 150g；金针菇 150g 蒜末快炒。"
          }
        ]
      },
      {
        name: "周五",
        badge: "休息日 · 两餐",
        meals: [
          {
            title: "餐一：牛排沙拉（无主食）",
            text: "牛排 150g + 生菜/番茄，柠檬汁 / 黑胡椒 / 少量生抽。"
          },
          {
            title: "餐二：鸡胸肉炒娃娃菜",
            text: "鸡胸肉 120g + 娃娃菜 150g，蒜末快炒。"
          }
        ]
      },
      {
        name: "周六",
        badge: "休息日 · 两餐",
        meals: [
          {
            title: "餐一：煎三文鱼 + 清炒娃娃菜",
            text: "三文鱼 130–150g；娃娃菜 150g 蒜香快炒。"
          },
          {
            title: "餐二：鸡腿肉炒平菇",
            text: "鸡腿肉 150g + 平菇 150g。"
          }
        ]
      },
      {
        name: "周日",
        badge: "社交日 · 一餐制",
        meals: [
          {
            title: "与朋友共享一餐",
            text: "优先选择牛排 / 烤肉 / 铁板 / 寿司等高蛋白餐，其余时间只喝水或无糖茶。"
          }
        ]
      }
    ],
    grocery: {
      proteins: [
        { key: "beef", label: "牛肉（牛排/牛肉片）约 690g" },
        { key: "chicken-thigh", label: "鸡腿肉（去骨去皮）约 300g" },
        { key: "chicken-breast", label: "鸡胸肉约 270g" },
        { key: "salmon", label: "三文鱼约 300g" },
        { key: "white-fish", label: "白肉鱼（如比目鱼）约 150g" },
        { key: "shrimp", label: "虾仁约 200g" },
        { key: "eggs", label: "鸡蛋 6–8 个" }
      ],
      veggies: [
        { key: "enoki", label: "金针菇约 300g" },
        { key: "oyster-mushroom", label: "平菇约 400–500g" },
        { key: "baby-bokchoy", label: "娃娃菜约 700–800g" },
        { key: "eggplant", label: "茄子 2 根（约 350–400g）" }
      ],
      other: [
        { key: "yogurt", label: "无糖酸奶/希腊酸奶（约 5 份）" },
        { key: "banana", label: "香蕉 1–2 根" },
        { key: "protein-bar", label: "蛋白棒 1 条" },
        { key: "garlic", label: "蒜头 1–2 头" },
        { key: "lemon", label: "柠檬 1–2 个" },
        { key: "seasoning", label: "生抽 / 蚝油 / 黑胡椒 / 盐（如需补货）" }
      ]
    }
  }
];
