(() => {
  'use strict';

  const STORAGE_KEY = 'daigan-dispatch-desk-v1';

  const DEFAULT_SETTINGS = {
    title: '课余代肝 · 接单大厅',
    intro: '利用课余时间接单，主要覆盖原神、崩坏：星穹铁道的剧情推进、地图资源收集与每日委托，以及第五人格的日常活跃与加页手记。下单后按提交时间进入队列，进度可在排单看板查看。',
    notice: '所有服务已标注公开参考价，可在管理模式中自行修改。所有委托已合并为“可勾选委托”，按需勾选并按单项价格累加。地图按国家 / 星球分组，下方可勾选更小地图或全图；大地图套餐已包含所属小地图，月托套餐已包含每日委托，不重复收费。请下单前确认游戏账号可正常登录，付款方式以双方沟通为准。当前为静态演示版：订单只保存在你自己的浏览器里，店主暂时无法收到，请勿填写真实账号密码。',
    payment: '下单后请通过你填写的联系方式与我确认具体付款方式；建议先确认账号与需求，再完成付款。注意：静态版订单不会发送给店主，仅供本地演示。',
    hoursPerDay: 6,
    workStart: '19:00',
    serviceQQ: '1930325223',
    password: '123456'
  };

  const DEFAULT_SERVICES = [
    { id: 'genshin-commissions', game: '原神', category: '委托代肝', name: '原神委托代肝（可勾选）', desc: '所有委托合并为可勾选清单：每日委托、月常委托可自选，按月勾选更划算。', price: '按下方勾选计费', priceNote: '单项价格按价目表，支持多选累加', includes: '每日委托、月常委托（含每日）', estimateHours: 1, tag: '可勾选', allowCommissionPricing: true, enabled: true },
    { id: 'genshin-single-map', game: '原神', category: '地图探索', name: '原神小地图单独代肝（可多选）', desc: '不拍全图，直接在下单页勾选一个或多个小地图，按单项价格加购。', price: '按下方小地图加购计费', priceNote: '单项价格按价目表，支持多选累加', includes: '在下单页勾选单个小地图，可多选', estimateHours: 1, tag: '可多选', allowAddonPricing: true, enabled: true },
    { id: 'genshin-story-full', game: '原神', category: '剧情任务', name: '原神魔神任务全包', desc: '从序章推进至当前版本魔神任务。', price: '¥330 / 全包', priceNote: '单章 ¥15 起，按章节另拍', includes: '序章至当前版本全部魔神任务', estimateHours: 20, tag: '全包', enabled: true },
    { id: 'genshin-story-chapter', game: '原神', category: '剧情任务', name: '原神魔神任务单章', desc: '按指定章节推进魔神任务剧情。', price: '¥15 / 章', priceNote: '部分长章节 ¥10-20', includes: '指定章节剧情与前置', estimateHours: 3, tag: '剧情', enabled: true },
    { id: 'genshin-legend', game: '原神', category: '剧情任务', name: '原神传说任务', desc: '完成指定角色传说任务。', price: '¥20 / 个', priceNote: '长任务 ¥25-30', includes: '指定传说任务', estimateHours: 2, tag: '剧情', enabled: true },
    { id: 'genshin-world', game: '原神', category: '剧情任务', name: '原神世界任务', desc: '按区域清理世界任务与隐藏任务。', price: '¥15 / 个', priceNote: '复杂任务 ¥25-35', includes: '指定世界任务', estimateHours: 2, tag: '探索', enabled: true },
    { id: 'genshin-map', game: '原神', category: '地图探索', name: '原神大地图全收集（大图包小图）', desc: '按大地图打包探索，已包含该区域全部小地图，不重复收费。', price: '¥120 起 / 大图', priceNote: '蒙德120 璃月270 稻妻390 须弥670 枫丹420 纳塔400 挪德卡莱320 至冬200', includes: '大地图及所属小地图、宝箱、解密、成就、神瞳', estimateHours: 10, tag: '大图包', enabled: true },
    { id: 'genshin-chest', game: '原神', category: '地图探索', name: '原神大地图全宝箱专项', desc: '只清指定大地图内全部宝箱，适合已满探账号。', price: '¥150 起 / 大图', priceNote: '蒙德150 璃月320 稻妻500 至冬230，其他区域私聊确认', includes: '指定大地图全部宝箱（含小地图）', estimateHours: 6, tag: '宝箱', enabled: true },
    { id: 'hsr-commissions', game: '崩坏：星穹铁道', category: '委托代肝', name: '星穹铁道日常托管（可勾选）', desc: '普托 / 半托 / 精托 / 纯托四档托管合并为可勾选清单，按月计费。', price: '按下方勾选计费', priceNote: '普托 ¥30 / 半托 ¥50 / 精托 ¥80 / 纯托 ¥90，四档互斥', includes: '普托、半托、精托、纯托（按档位含每日、周常与活动）', estimateHours: 1, tag: '可勾选', allowCommissionPricing: true, enabled: true },
    { id: 'hsr-story-full', game: '崩坏：星穹铁道', category: '剧情任务', name: '星穹铁道开拓任务（大任务可勾选小任务）', desc: '按星球打包或直接勾选章节小任务，星球全包已包含下属任务。', price: '按下方加购计费', priceNote: '空间站35 雅利洛VI80 仙舟罗浮130 匹诺康尼100 翁法罗斯176', includes: '星球全包与章节小任务，二者互斥避免重复收费', estimateHours: 8, tag: '可勾选', allowTaskAddonPricing: true, enabled: true },
    { id: 'hsr-side', game: '崩坏：星穹铁道', category: '剧情任务', name: '星穹铁道同行 / 支线任务', desc: '推进指定同行或支线任务。', price: '¥15 / 个', priceNote: '蓝色同行15/个；紫色支线5-20/个', includes: '指定同行或支线任务', estimateHours: 1.5, tag: '剧情', enabled: true },
    { id: 'hsr-events', game: '崩坏：星穹铁道', category: '玩法代肝', name: '星穹铁道常驻活动 / 4.7专区（可勾选）', desc: '按匹诺康尼、仙舟/其他、模拟宇宙分区勾选常驻活动，并可加购 4.7 版本专区。', price: '按下方加购计费', priceNote: '单项 ¥10-60，4.7 专区全包 ¥130，支持多选累加', includes: '指定常驻活动与 4.7 版本内容（不含剧情）', estimateHours: 1.5, tag: '可多选', allowTaskAddonPricing: true, enabled: true },
    { id: 'hsr-map', game: '崩坏：星穹铁道', category: '地图探索', name: '星穹铁道大地图全收集（大图包小图）', desc: '按星球大地图打包，已包含所属小地图与区域内容。', price: '¥25 起 / 大图', priceNote: '黑塔空间站25 雅利洛六号60 仙舟罗浮100 匹诺康尼180 翁法罗斯260 二相乐团210 千星城50', includes: '宝箱、折纸小鸟、贴纸、成就及小地图', estimateHours: 8, tag: '大图包', enabled: true },
    { id: 'hsr-pulls', game: '崩坏：星穹铁道', category: '玩法代肝', name: '星穹铁道地图抽数代刷', desc: '按抽数完成地图抽卡类收集内容。', price: '¥1.8 / 抽', priceNote: '低探1.8 / 中探2.5 / 高探3.2 每抽', includes: '指定地图抽数', estimateHours: 1, tag: '抽数', enabled: true },
    { id: 'hsr-sim-select', game: '崩坏：星穹铁道', category: '模拟宇宙', name: '星穹铁道模拟宇宙 / 差分宇宙 / 货币战争（可勾选）', desc: '寰宇蝗灾、黄金与机械、不可知域、差分宇宙、货币战争按小全包 / 大全包勾选。', price: '按下方加购计费', priceNote: '寰宇蝗灾100 黄金与机械350 不可知域350 差分宇宙350；货币战争小全包260', includes: '模拟宇宙、差分宇宙与货币战争各类全包', estimateHours: 4, tag: '可勾选', allowTaskAddonPricing: true, enabled: true },
    { id: 'hsr-single-map', game: '崩坏：星穹铁道', category: '地图探索', name: '星穹铁道小地图单独代肝（可多选）', desc: '不拍全图，直接在下单页勾选一个或多个小地图，按单项价格加购。', price: '按下方小地图加购计费', priceNote: '单项价格按价目表，支持多选累加', includes: '在下单页勾选单个小地图，可多选', estimateHours: 1, tag: '可多选', allowAddonPricing: true, enabled: true },
    { id: 'idv-commissions', game: '第五人格', category: '委托代肝', name: '第五人格委托代肝（可勾选）', desc: '签到、首胜、低保、周上限、小托管、大托管合并为可勾选清单。', price: '按下方勾选计费', priceNote: '单项价格按价目表，支持多选累加', includes: '日常委托、周常任务、托管套餐', estimateHours: 1, tag: '可勾选', allowCommissionPricing: true, enabled: true },
    { id: 'idv-notes', game: '第五人格', category: '加页手记', name: '第五人格加页手记主线全包', desc: '按主线打包完成加页手记。', price: '¥35 起 / 全包', priceNote: '曙光症35 厄运一40 厄运二30；单任务 ¥1-6', includes: '对应主线全部任务', estimateHours: 6, tag: '全包', enabled: true },
    { id: 'idv-rank-sprint', game: '第五人格', category: '段位速刷', name: '第五人格段位速刷', desc: '按星级速刷段位。', price: '¥1-7 / 星', priceNote: '1阶4 2阶2 3阶3 4阶1 5阶6 6阶以上7', includes: '指定段位星级', estimateHours: 2, tag: '段位', enabled: true },
    { id: 'idv-relic', game: '第五人格', category: '加页手记', name: '第五人格遗迹积分代肝', desc: '按积分档位完成遗迹任务。', price: '¥6 / 100w', priceNote: '500w ¥30；1000w ¥55', includes: '指定遗迹积分档位', estimateHours: 2, tag: '积分', enabled: true },
    { id: 'idv-feather', game: '第五人格', category: '加页手记', name: '第五人格羽毛添页', desc: '按页完成羽毛添页内容。', price: '¥0.3 / 页', priceNote: '添页 ¥0.35 / 页', includes: '羽毛 / 添页指定页数', estimateHours: 0.5, tag: '添页', enabled: true }
  ];

  const TASK_ADDONS = [
    { id: 'hsr-story-space-full', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '空间站「黑塔」', name: '空间站「黑塔」全包', price: 35, hours: 3, note: '含本节全部开拓任务，不重复收费', kind: 'full' },
    { id: 'hsr-story-space-1', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '空间站「黑塔」', name: '第一节 今天是昨天的明天', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-space-2', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '空间站「黑塔」', name: '第二节 透过星海的瞳孔', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-belobog-full', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '雅利洛VI', name: '雅利洛VI 全包', price: 80, hours: 6, note: '含本节全部开拓任务，不重复收费', kind: 'full' },
    { id: 'hsr-story-belobog-1', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '雅利洛VI', name: '第一节 寒夜的坚冰', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-belobog-2', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '雅利洛VI', name: '第二节 于今天的明天', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-belobog-3', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '雅利洛VI', name: '第三节 冬梦激醒', price: 10, hours: 1, note: '单任务' },
    { id: 'hsr-story-belobog-4', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '雅利洛VI', name: '续闻一 旅途中的故人', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-belobog-5', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '雅利洛VI', name: '续闻二 朋克洛德', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-xianzhou-full', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '仙舟「罗浮」全包', price: 130, hours: 8, note: '含本节全部开拓任务，不重复收费', kind: 'full' },
    { id: 'hsr-story-xianzhou-1', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '第一节 乘槎驭风仙舟游', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-xianzhou-2', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '第二节 云树百丈蔽重楼', price: 15, hours: 1.2, note: '单任务' },
    { id: 'hsr-story-xianzhou-3', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '第三节 劫波渡尽战云收', price: 10, hours: 1, note: '单任务' },
    { id: 'hsr-story-xianzhou-4', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '续闻一 鹰隼的试炼', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-xianzhou-5', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '续闻二 明霄竞武试锋芒·上', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-xianzhou-6', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '续闻三 明霄竞武试锋芒·下', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-xianzhou-7', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '续闻 无意义之战', price: 25, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-xianzhou-8', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '仙舟「罗浮」', name: '续闻 美梦与圣杯', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-penacony-full', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '匹诺康尼全包', price: 100, hours: 7, note: '含本节全部开拓任务，不重复收费', kind: 'full' },
    { id: 'hsr-story-penacony-1', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '第一节 在群星的摇篮里', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-penacony-2', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '第二节 匪夷所思的游戏', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-penacony-3', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '第三节 我们的时代', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-penacony-4', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '第四节 再见，匹诺康尼', price: 15, hours: 1, note: '单任务' },
    { id: 'hsr-story-penacony-5', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '第五节 在八月七日启程', price: 10, hours: 1, note: '单任务' },
    { id: 'hsr-story-penacony-6', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '匹诺康尼', name: '终末 记忆是梦的开场白', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-3x-full', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '翁法罗斯开拓任务全包', price: 176, hours: 12, note: '含全部八节，不重复收费', kind: 'full' },
    { id: 'hsr-story-3x-1', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第一节 坠落烟火似繁星', price: 35, hours: 2.5, note: '单任务' },
    { id: 'hsr-story-3x-2', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第二节 门扉之启，王座之终', price: 25, hours: 2, note: '单任务' },
    { id: 'hsr-story-3x-3', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第三节 走过安眠地的花丛', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-3x-4', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第四节 在黎明的光里', price: 25, hours: 2, note: '单任务' },
    { id: 'hsr-story-3x-5', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第五节 因为太阳将要毁伤', price: 15, hours: 1.2, note: '单任务' },
    { id: 'hsr-story-3x-6', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第六节 英雄末路之前', price: 16, hours: 1.2, note: '单任务' },
    { id: 'hsr-story-3x-7', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第七节 于长夜重返大地', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-story-3x-8', game: '崩坏：星穹铁道', group: '开拓任务', subgroup: '翁法罗斯', name: '第八节 成为昨日的明天', price: 20, hours: 1.5, note: '单任务' },
    { id: 'hsr-sim-swarm-small', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '寰宇蝗灾', name: '寰宇蝗灾（小全包星琼）', price: 100, hours: 8, note: '小全包星琼', kind: 'full' },
    { id: 'hsr-sim-swarm-big', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '寰宇蝗灾', name: '寰宇蝗灾（大全包）', price: 220, hours: 14, note: '奖励全清', kind: 'full' },
    { id: 'hsr-sim-gm-small', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '黄金与机械', name: '黄金与机械（小全包星琼）', price: 350, hours: 14, note: '小全包星琼', kind: 'full' },
    { id: 'hsr-sim-gm-big', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '黄金与机械', name: '黄金与机械（大全包）', price: 420, hours: 18, note: '奖励全清', kind: 'full' },
    { id: 'hsr-sim-unknown-small', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '不可知域', name: '不可知域（小全包星琼）', price: 350, hours: 14, note: '小全包星琼', kind: 'full' },
    { id: 'hsr-sim-unknown-big', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '不可知域', name: '不可知域（大全包）', price: 420, hours: 18, note: '奖励全清', kind: 'full' },
    { id: 'hsr-sim-diff-small', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '差分宇宙', name: '差分宇宙（小全包星琼）', price: 350, hours: 14, note: '小全包星琼', kind: 'full' },
    { id: 'hsr-sim-diff-big', game: '崩坏：星穹铁道', group: '模拟宇宙', subgroup: '差分宇宙', name: '差分宇宙（大全包）', price: 420, hours: 18, note: '奖励全清', kind: 'full' },
    { id: 'hsr-currency-small', game: '崩坏：星穹铁道', group: '货币战争', subgroup: '货币战争', name: '货币战争 小全包（AI-AI）', price: 260, hours: 12, note: 'AI 通关至成就全', kind: 'full' },
    { id: 'hsr-currency-big', game: '崩坏：星穹铁道', group: '货币战争', subgroup: '货币战争', name: '货币战争 大全包', price: 400, hours: 18, note: '全部奖励拿满', kind: 'full' },
    { id: 'hsr-currency-invest', game: '崩坏：星穹铁道', group: '货币战争', subgroup: '货币战争', name: '创业投资 / 钱赚到手软', price: 100, hours: 5, note: '单项任务' },
    { id: 'hsr-currency-data', game: '崩坏：星穹铁道', group: '货币战争', subgroup: '货币战争', name: '数据银行等级', price: 100, hours: 5, note: '单项任务' },
    { id: 'hsr-currency-star-small', game: '崩坏：星穹铁道', group: '货币战争', subgroup: '星星小全包', name: '星星小全包（AI-AI）', price: 300, hours: 14, note: '小全包星琼', kind: 'full' },
    { id: 'hsr-currency-star-all', game: '崩坏：星穹铁道', group: '货币战争', subgroup: '星星小全包', name: '所有星星全包', price: 450, hours: 20, note: '全部星星奖励', kind: 'full' },
    { id: 'hsr-event-penacony', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '匹诺康尼常驻', price: 60, hours: 4, note: '常驻活动' },
    { id: 'hsr-event-cup', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '杯中逸事', price: 20, hours: 1.5, note: '常驻活动' },
    { id: 'hsr-event-clock', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '钟表小子美梦往事', price: 40, hours: 2.5, note: '常驻活动' },
    { id: 'hsr-event-rock', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '异岩探查', price: 20, hours: 1.5, note: '常驻活动' },
    { id: 'hsr-event-war', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '匹诺康尼战争', price: 10, hours: 1, note: '常驻活动' },
    { id: 'hsr-event-treasure', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '寻宝活动', price: 20, hours: 1.5, note: '常驻活动' },
    { id: 'hsr-event-chalice', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '匹诺康尼', name: '美梦与圣杯', price: 45, hours: 3, note: '常驻活动' },
    { id: 'hsr-event-creature', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '仙舟 / 其他', name: '生灵勿乱', price: 30, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-home', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '仙舟 / 其他', name: '宇宙家装指南', price: 25, hours: 1.8, note: '常驻活动' },
    { id: 'hsr-event-martial', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '仙舟 / 其他', name: '嗷呜呜演武厅', price: 60, hours: 4, note: '常驻活动' },
    { id: 'hsr-event-rock2', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '仙舟 / 其他', name: '反「啃」家', price: 20, hours: 1.5, note: '常驻活动' },
    { id: 'hsr-event-bless', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '仙舟 / 其他', name: '赐福解谜', price: 25, hours: 1.8, note: '常驻活动' },
    { id: 'hsr-event-road', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '仙舟 / 其他', name: '寻路之旅', price: 15, hours: 1.2, note: '常驻活动' },
    { id: 'hsr-event-sim-all', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '全地图模拟宇宙', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-brawl', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '星穹列车大乱斗', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-power', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '又上了战力', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-gold', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '金色的...', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-winter', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '冬城大道', price: 35, hours: 2.5, note: '常驻活动' },
    { id: 'hsr-event-museum', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '冬城博物馆', price: 35, hours: 2.5, note: '常驻活动' },
    { id: 'hsr-event-weather', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '天气真好，养花', price: 30, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-flower', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '同心协力', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-heart', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '我的心意', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-void', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '虚空...', price: 20, hours: 1.5, note: '常驻活动' },
    { id: 'hsr-event-paperfold', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '折纸小鸟对对碰（正式）', price: 35, hours: 2.5, note: '常驻活动' },
    { id: 'hsr-event-clock2', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '「钟表小子」美梦往事', price: 25, hours: 2, note: '常驻活动' },
    { id: 'hsr-event-theater', game: '崩坏：星穹铁道', group: '常驻活动', subgroup: '模拟宇宙', name: '剧场版', price: 20, hours: 1.5, note: '常驻活动' },
    { id: 'hsr-v47-full', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '4.7版本专区', name: '4.7版本专区全包', price: 130, hours: 8, note: '含本专区全部内容，不重复收费', kind: 'full' },
    { id: 'hsr-v47-story', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '4.7版本专区', name: '开拓任务', price: 20, hours: 1.5, note: '4.7 新增' },
    { id: 'hsr-v47-map', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '4.7版本专区', name: '新增地图', price: 20, hours: 1.5, note: '4.7 新增' },
    { id: 'hsr-v47-event', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '4.7版本专区', name: '新增活动', price: 20, hours: 1.5, note: '4.7 新增' },
    { id: 'hsr-v47-gift', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '4.7版本专区', name: '赠券·联动兑换码', price: 25, hours: 1.5, note: '单项' },
    { id: 'hsr-v47-limited', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '4.7版本专区', name: '限定任务', price: 15, hours: 1, note: '单项' },
    { id: 'hsr-v47-city', game: '崩坏：星穹铁道', group: '4.7版本专区', subgroup: '城市寻宝', name: '城市寻宝 小全包', price: 180, hours: 10, note: '所有星琼奖励拿满', kind: 'full' },
    { id: 'hsr-side-blue', game: '崩坏：星穹铁道', group: '支线任务', name: '蓝色同行任务', price: 15, hours: 1, note: '按个计费' },
    { id: 'hsr-side-purple', game: '崩坏：星穹铁道', group: '支线任务', name: '紫色支线任务', price: 5, hours: 0.5, note: '按难度 5-20r / 个' }
  ];

  const COMMISSION_ADDONS = [
    { id: 'gi-daily', game: '原神', group: '每日委托', name: '每日委托（单日）', price: 3, unit: '天', hours: 0.5, note: '完成当日四个委托', exclusiveGroup: 'gi-daily' },
    { id: 'gi-monthly', game: '原神', group: '月度委托', name: '月常委托（含每日）', price: 28, unit: '月', hours: 1, note: '已包含每日委托，勿重复勾选', exclusiveGroup: 'gi-daily' },
    { id: 'hsr-normal', game: '崩坏：星穹铁道', group: '日常托管', name: '普托（每日30 / 体力）', price: 30, unit: '月', hours: 1, note: '42版本：每日实训 + 体力', exclusiveGroup: 'hsr-daily' },
    { id: 'hsr-half', game: '崩坏：星穹铁道', group: '日常托管', name: '半托', price: 50, unit: '月', hours: 2, note: '70版本：普托 + 每周', exclusiveGroup: 'hsr-daily' },
    { id: 'hsr-advanced', game: '崩坏：星穹铁道', group: '日常托管', name: '精托', price: 80, unit: '月', hours: 4, note: '110版本：半托 + 每周副本', exclusiveGroup: 'hsr-daily' },
    { id: 'hsr-full', game: '崩坏：星穹铁道', group: '日常托管', name: '纯托', price: 90, unit: '月', hours: 6, note: '110版本：精托 + 周期 + 大小活动', exclusiveGroup: 'hsr-daily' },
    { id: 'idv-checkin', game: '第五人格', group: '日常委托', name: '每日签到', price: 3.5, unit: '周', hours: 0.5, note: '按周计费' },
    { id: 'idv-first-win', game: '第五人格', group: '日常委托', name: '每日首胜', price: 2, unit: '天', hours: 0.3, note: '按天计费' },
    { id: 'idv-rank-low', game: '第五人格', group: '日常委托', name: '排位低保', price: 2, unit: '天', hours: 0.5, note: '按天计费' },
    { id: 'idv-weekend', game: '第五人格', group: '日常委托', name: '周末任务', price: 6, unit: '周', hours: 1, note: '按周计费' },
    { id: 'idv-role-day', game: '第五人格', group: '日常委托', name: '角色日', price: 2, unit: '个', hours: 0.3, note: '按个计费' },
    { id: 'idv-weekly', game: '第五人格', group: '周常任务', name: '周上限', price: 20, unit: '周', hours: 2, note: '单周 1w ¥5', exclusiveGroup: 'idv-weekly' },
    { id: 'idv-weekly-month', game: '第五人格', group: '周常任务', name: '周上限包月', price: 80, unit: '月', hours: 8, note: '按月计费', exclusiveGroup: 'idv-weekly' },
    { id: 'idv-small-trust', game: '第五人格', group: '托管套餐', name: '小托管（含日常）', price: 140, unit: '月', hours: 3, note: '周付 ¥35 / 周；含签到、周上限、排位低保', exclusiveGroup: 'idv-trust' },
    { id: 'idv-big-trust', game: '第五人格', group: '托管套餐', name: '大托管（含小托管）', price: 170, unit: '月', hours: 5, note: '周付 ¥45 / 周；含小托管、五排低保、角色日、每日商城、协会事务', exclusiveGroup: 'idv-trust' }
  ];

  const MAP_ADDONS = [
    { id: 'gi-mondstadt', game: '原神', group: '蒙德', name: '蒙德本土', price: 120, hours: 5, note: '满探；全宝箱 ¥150' },
    { id: 'gi-dragonspine', game: '原神', group: '蒙德', name: '雪山', price: 120, hours: 5, note: '满探；全宝箱 ¥150' },
    { id: 'gi-windsong', game: '原神', group: '蒙德', name: '风雪山神瞳', price: 110, hours: 4, note: '满探；全宝箱 ¥140' },
    { id: 'gi-liyue', game: '原神', group: '璃月', name: '璃月本土', price: 270, hours: 10, note: '满探；全宝箱 ¥320' },
    { id: 'gi-chasm', game: '原神', group: '璃月', name: '层岩巨渊上下层', price: 140, hours: 5, note: '满探；全宝箱 ¥160' },
    { id: 'gi-chenyu', game: '原神', group: '璃月', name: '沉玉谷', price: 140, hours: 5, note: '满探；全宝箱 ¥160' },
    { id: 'gi-inazuma', game: '原神', group: '稻妻', name: '稻妻本土', price: 390, hours: 14, note: '满探；全宝箱 ¥500' },
    { id: 'gi-enkanomiya', game: '原神', group: '稻妻', name: '渊下宫', price: 120, hours: 5, note: '满探；全宝箱 ¥150' },
    { id: 'gi-sumeru', game: '原神', group: '须弥', name: '须弥本土', price: 200, hours: 8, note: '满探；全宝箱 ¥240' },
    { id: 'gi-desert', game: '原神', group: '须弥', name: '沙漠', price: 230, hours: 8, note: '满探；全宝箱 ¥280' },
    { id: 'gi-khareth', game: '原神', group: '须弥', name: '千壑沙地', price: 180, hours: 7, note: '满探' },
    { id: 'gi-ara', game: '原神', group: '须弥', name: '苍漠囿土', price: 140, hours: 5, note: '满探；全宝箱 ¥200' },
    { id: 'gi-sumeru-full', game: '原神', group: '须弥', name: '须弥大地图全收集', price: 670, hours: 24, note: '含本土、沙漠、千壑沙地、苍漠囿土', kind: 'full' },
    { id: 'gi-fontaine40', game: '原神', group: '枫丹', name: '枫丹 4.0', price: 150, hours: 6, note: '满探；全宝箱 ¥180' },
    { id: 'gi-fontaine41', game: '原神', group: '枫丹', name: '枫丹 4.1', price: 150, hours: 6, note: '满探；全宝箱 ¥180' },
    { id: 'gi-fontaine42', game: '原神', group: '枫丹', name: '枫丹 4.2', price: 100, hours: 4, note: '满探；全宝箱 ¥120' },
    { id: 'gi-fontaine43', game: '原神', group: '枫丹', name: '枫丹 4.3', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-fontaine-full', game: '原神', group: '枫丹', name: '枫丹大地图全收集', price: 420, hours: 16, note: '含 4.0-4.3 全部小地图', kind: 'full' },
    { id: 'gi-natlan50', game: '原神', group: '纳塔', name: '纳塔 5.0', price: 150, hours: 6, note: '满探；全宝箱 ¥180' },
    { id: 'gi-natlan52', game: '原神', group: '纳塔', name: '纳塔 5.2', price: 100, hours: 4, note: '满探；全宝箱 ¥120' },
    { id: 'gi-natlan55', game: '原神', group: '纳塔', name: '纳塔 5.5', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-natlan58', game: '原神', group: '纳塔', name: '纳塔 5.8', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-natlan-full', game: '原神', group: '纳塔', name: '纳塔大地图全收集', price: 400, hours: 16, note: '含 5.0-5.8 全部小地图', kind: 'full' },
    { id: 'gi-nodkrai60', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.0', price: 130, hours: 5, note: '满探；全宝箱 ¥150' },
    { id: 'gi-nodkrai61', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.1', price: 120, hours: 5, note: '满探；全宝箱 ¥140' },
    { id: 'gi-nodkrai62', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.2', price: 100, hours: 4, note: '满探；全宝箱 ¥120' },
    { id: 'gi-nodkrai63', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.3', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-nodkrai-full', game: '原神', group: '挪德卡莱', name: '挪德卡莱大地图全收集', price: 320, hours: 13, note: '含 6.0-6.3 全部小地图', kind: 'full' },
    { id: 'gi-snezhnaya70', game: '原神', group: '至冬', name: '至冬 7.0', price: 200, hours: 8, note: '满探；全宝箱 ¥230' },
    { id: 'gi-snezhnaya71', game: '原神', group: '至冬', name: '至冬 7.1', price: 160, hours: 6, note: '满探；全宝箱 ¥200' },
    { id: 'gi-snezhnaya72', game: '原神', group: '至冬', name: '至冬 7.2', price: 140, hours: 6, note: '满探' },
    { id: 'hsr-space-full', game: '崩坏：星穹铁道', group: '黑塔空间站', name: '黑塔空间站 全包', price: 25, hours: 2, note: '含全部舱段，不重复收费', kind: 'full' },
    { id: 'hsr-space-base', game: '崩坏：星穹铁道', group: '黑塔空间站', name: '基座舱段', price: 8, hours: 0.6, note: '地图收集' },
    { id: 'hsr-space-containment', game: '崩坏：星穹铁道', group: '黑塔空间站', name: '收容舱段', price: 4, hours: 0.4, note: '地图收集' },
    { id: 'hsr-space-support', game: '崩坏：星穹铁道', group: '黑塔空间站', name: '支援舱段', price: 6, hours: 0.5, note: '地图收集' },
    { id: 'hsr-space-prison', game: '崩坏：星穹铁道', group: '黑塔空间站', name: '禁闭舱段', price: 7, hours: 0.6, note: '地图收集' },
    { id: 'hsr-belobog-full', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '雅利洛六号 全包', price: 60, hours: 5, note: '含全部区域，不重复收费', kind: 'full' },
    { id: 'hsr-belobog-admin', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '行政区', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-belobog-snow', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '城郊雪原', price: 1, hours: 0.2, note: '地图收集' },
    { id: 'hsr-belobog-border', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '边境流通区', price: 5, hours: 0.4, note: '地图收集' },
    { id: 'hsr-belobog-town', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '磐岩镇', price: 5, hours: 0.4, note: '地图收集' },
    { id: 'hsr-belobog-mine', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '大矿区', price: 8, hours: 0.6, note: '地图收集' },
    { id: 'hsr-belobog-rivet', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '铆钉镇', price: 6, hours: 0.5, note: '地图收集' },
    { id: 'hsr-belobog-mech', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '机械聚落', price: 5, hours: 0.4, note: '地图收集' },
    { id: 'hsr-belobog-guard', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '铁卫禁区', price: 2, hours: 0.2, note: '地图收集' },
    { id: 'hsr-belobog-winter', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '永冬岭', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-belobog-lab', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '旧武器实验场', price: 4, hours: 0.4, note: '地图收集' },
    { id: 'hsr-belobog-echo', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '残响回廊', price: 6, hours: 0.5, note: '地图收集' },
    { id: 'hsr-belobog-pillar', game: '崩坏：星穹铁道', group: '雅利洛六号', name: '造物之柱', price: 4, hours: 0.4, note: '地图收集' },
    { id: 'hsr-xianzhou-full', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '仙舟罗浮 全包', price: 100, hours: 7, note: '含全部区域，不重复收费', kind: 'full' },
    { id: 'hsr-xianzhou-star', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '星槎海中枢', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-xianzhou-cloud', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '流云渡', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-xianzhou-yi', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '迤逦海', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-xianzhou-ding', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '丹鼎司', price: 10, hours: 0.8, note: '地图收集' },
    { id: 'hsr-xianzhou-lin', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '鳞渊境', price: 10, hours: 0.8, note: '地图收集' },
    { id: 'hsr-xianzhou-craft', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '工造司', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-xianzhou-divine', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '太卜司', price: 5, hours: 0.4, note: '地图收集' },
    { id: 'hsr-xianzhou-prison', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '幽囚狱', price: 7, hours: 0.5, note: '地图收集' },
    { id: 'hsr-xianzhou-long', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '长乐天', price: 5, hours: 0.4, note: '地图收集' },
    { id: 'hsr-xianzhou-golden', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '金人巷', price: 10, hours: 0.8, note: '地图收集' },
    { id: 'hsr-penacony-full', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '匹诺康尼 打包', price: 180, hours: 10, note: '含全部区域，不重复收费', kind: 'full' },
    { id: 'hsr-penacony-golden', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '黄金的时刻', price: 21, hours: 1.5, note: '地图收集' },
    { id: 'hsr-penacony-reality', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '现实白日梦酒店', price: 11, hours: 1, note: '地图收集' },
    { id: 'hsr-penacony-child', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '稚子的梦', price: 17, hours: 1.2, note: '地图收集' },
    { id: 'hsr-penacony-dream', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '白日梦酒店 · 梦境', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-penacony-mansion', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '朝露公馆', price: 17, hours: 1.2, note: '地图收集' },
    { id: 'hsr-penacony-film', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '克劳克影视乐园', price: 17, hours: 1.2, note: '地图收集' },
    { id: 'hsr-penacony-sand', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '热砂海选会场', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-penacony-theater', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '匹诺康尼大剧院', price: 11, hours: 1, note: '地图收集' },
    { id: 'hsr-penacony-school', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '折纸大学学院', price: 10, hours: 0.8, note: '地图收集' },
    { id: 'hsr-penacony-oak', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '橡木鸣娃之梦', price: 8, hours: 0.6, note: '地图收集' },
    { id: 'hsr-amphoreus-full', game: '崩坏：星穹铁道', group: '翁法罗斯', name: '翁法罗斯 全包', price: 260, hours: 16, note: '含 3.0-4.7 全部区域，不重复收费', kind: 'full' },
    { id: 'hsr-amphoreus-30-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.0版本', name: '永恒圣城 奥赫玛', price: 21, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-30-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.0版本', name: '血染之滨 艾欧尼亚', price: 17, hours: 1.2, note: '地图收集' },
    { id: 'hsr-amphoreus-30-3', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.0版本', name: '纷争荒墟 悬锋城', price: 18, hours: 1.3, note: '地图收集' },
    { id: 'hsr-amphoreus-30-4', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.0版本', name: '命运黎明云崖', price: 12, hours: 1, note: '地图收集' },
    { id: 'hsr-amphoreus-30-5', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.0版本', name: '创世涡心', price: 1, hours: 0.2, note: '地图收集' },
    { id: 'hsr-amphoreus-31-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.1版本', name: '神谕圣地 神谕圣所', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-31-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.1版本', name: '雅努萨波利斯', price: 14, hours: 1, note: '地图收集' },
    { id: 'hsr-amphoreus-32-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.2版本', name: '半神议院 黎明云崖', price: 8, hours: 0.6, note: '地图收集' },
    { id: 'hsr-amphoreus-32-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.2版本', name: '龙骸古城 斯提科西亚', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-33-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.3版本', name: '穹顶关塞 晨昏之眼', price: 14, hours: 1, note: '地图收集' },
    { id: 'hsr-amphoreus-33-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.3版本', name: '云无留迹 晨昏之眼', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-33-3', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.3版本', name: '无晖祈堂 黎明云崖', price: 21, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-34-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.4版本', name: '真我不详', price: 8, hours: 0.6, note: '地图收集' },
    { id: 'hsr-amphoreus-34-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.4版本', name: '赛博民居', price: 9, hours: 0.7, note: '地图收集' },
    { id: 'hsr-amphoreus-35-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.5版本', name: '雕歌海眠 斯提科西亚', price: 17, hours: 1.2, note: '地图收集' },
    { id: 'hsr-amphoreus-36-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.6版本', name: '晦辉圣林 神谕树庭', price: 14, hours: 1, note: '地图收集' },
    { id: 'hsr-amphoreus-36-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.6版本', name: '全世矩阵 无名泰坦大墓', price: 9, hours: 0.7, note: '地图收集' },
    { id: 'hsr-amphoreus-37-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.7版本', name: '蒙梦金局 无名泰坦大墓', price: 8, hours: 0.6, note: '地图收集' },
    { id: 'hsr-amphoreus-37-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.7版本', name: '降妖除魔 时光归墟', price: 21, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-37-3', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '3.7版本', name: '岁月使命 一顶永恒', price: 5, hours: 0.5, note: '地图收集' },
    { id: 'hsr-amphoreus-40-full', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '二相乐团 打包', price: 210, hours: 12, note: '含全部二相乐团区域', kind: 'full' },
    { id: 'hsr-amphoreus-40-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '二相市', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-40-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '绘世学院', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-40-3', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '纳兰区', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-40-4', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '世界尽头 酒馆', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-40-5', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '珠星大楼', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-40-6', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '观景云岛', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-42-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '海原市', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-42-2', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '海原电视塔', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-43-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '4.3版本', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-44-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '4.4版本', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-45-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '4.5版本', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-46-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '4.6版本', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-amphoreus-47-1', game: '崩坏：星穹铁道', group: '翁法罗斯', subgroup: '二相乐园 / 千星城', name: '4.7版本 点心屋', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-starfull-full', game: '崩坏：星穹铁道', group: '千星城', name: '千星城 打包', price: 50, hours: 4, note: '含全部区域，不重复收费', kind: 'full' },
    { id: 'hsr-starfull-1', game: '崩坏：星穹铁道', group: '千星城', name: '子星城', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-starfull-2', game: '崩坏：星穹铁道', group: '千星城', name: '空中花园', price: 20, hours: 1.5, note: '地图收集' },
    { id: 'hsr-starfull-3', game: '崩坏：星穹铁道', group: '千星城', name: '星屏幕', price: 10, hours: 1, note: '地图收集' }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  let state = loadState();
  let unlocked = false;
  let editingServiceId = null;
  let editingCustomAddonId = null;
  let hallFilter = '全部';
  let boardFilter = '全部';
  let selectedAddons = new Set();
  let selectedCommissions = new Set();
  let selectedTaskAddons = new Set();
  let toastTimer = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultState() {
    return {
      settings: clone(DEFAULT_SETTINGS),
      services: clone(DEFAULT_SERVICES),
      orders: [],
      accounts: [],
      afterSales: [],
      customAddons: [],
      session: null
    };
  }

  function customAddonsOfType(type) {
    return (state.customAddons || []).filter((item) => item.type === type && item.enabled !== false);
  }

  function getTaskAddons() {
    return [...TASK_ADDONS, ...customAddonsOfType('task')];
  }

  function getMapAddons() {
    return [...MAP_ADDONS, ...customAddonsOfType('map')];
  }

  function getCommissionAddons() {
    return [...COMMISSION_ADDONS, ...customAddonsOfType('commission')];
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      const settings = { ...base.settings, ...(parsed.settings || {}) };
      if (!String(settings.notice || '').includes('公开参考价')) {
        settings.notice = `${settings.notice || ''} 所有服务已标注公开参考价，可在管理模式自行修改。`.trim();
      }
      if (!String(settings.notice || '').includes('大地图套餐')) {
        settings.notice = `${settings.notice || ''} 大地图套餐已包含所属小地图，月托套餐已包含每日委托，不重复收费。`.trim();
      }
      if (!String(settings.notice || '').includes('小地图单独代肝')) {
        settings.notice = `${settings.notice || ''} 不想拍全图可选“小地图单独代肝”，并在下单页勾选多个小地图，按单项价格累加。`.trim();
      }
      if (!String(settings.notice || '').includes('可勾选委托')) {
        settings.notice = `${settings.notice || ''} 所有委托已合并为“可勾选委托”；地图按国家 / 星球分组，下方可勾选更小地图或全图。`.trim();
      }
      const customServices = Array.isArray(parsed.services)
        ? parsed.services.filter((service) => String(service.id || '').startsWith('svc-'))
        : [];
      const services = [...base.services, ...customServices];
      if (!settings.serviceQQ) settings.serviceQQ = DEFAULT_SETTINGS.serviceQQ;
      return {
        settings,
        services,
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
        afterSales: Array.isArray(parsed.afterSales) ? parsed.afterSales : [],
        customAddons: Array.isArray(parsed.customAddons) ? parsed.customAddons : [],
        session: parsed.session || null
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      showToast('本地存储失败，请检查浏览器设置', 'error');
    }
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function formatPrice(price) {
    const value = String(price ?? '').trim();
    if (!value) return { text: '价格待定 · 私聊报价', soft: true };
    return { text: /^\d+(\.\d+)?$/.test(value) ? `¥${value}` : value, soft: false };
  }

  function formatDateTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function gameColor(game) {
    const text = String(game || '');
    if (text.includes('原神')) return '#7b6cff';
    if (text.includes('星穹')) return '#3ddad7';
    if (text.includes('第五')) return '#ff7186';
    return '#ffcb6b';
  }

  function activeServices() {
    return state.services.filter((service) => service.enabled !== false);
  }

  function getService(id) {
    return state.services.find((service) => service.id === id);
  }

  function statusRank(order) {
    if (order.status === 'done') return 1;
    if (order.status === 'cancelled') return 2;
    return 0;
  }

  function sortedOrders() {
    return state.orders.slice().sort((a, b) => {
      const rank = statusRank(a) - statusRank(b);
      if (rank !== 0) return rank;
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      const indexA = Number(a.queueIndex ?? 0);
      const indexB = Number(b.queueIndex ?? 0);
      if (indexA !== indexB) return indexA - indexB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  function scheduleBase() {
    const hoursPerDay = Math.max(0.5, Number(state.settings.hoursPerDay) || 6);
    const [hour = 19, minute = 0] = String(state.settings.workStart || '19:00').split(':').map(Number);
    const startMinutes = (hour || 0) * 60 + (minute || 0);
    const base = new Date();
    const windowEnd = new Date(base);
    windowEnd.setHours(0, 0, 0, 0);
    windowEnd.setMinutes(startMinutes + hoursPerDay * 60);
    if (base.getTime() >= windowEnd.getTime()) base.setDate(base.getDate() + 1);
    return { base, hoursPerDay, startMinutes };
  }

  function hoursToDate(totalHours, config) {
    const dayOffset = Math.floor(totalHours / config.hoursPerDay);
    const remainHours = totalHours - dayOffset * config.hoursPerDay;
    const date = new Date(config.base);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);
    date.setMinutes(config.startMinutes + Math.round(remainHours * 60));
    return date.toISOString();
  }

  function recalculateSchedule() {
    const config = scheduleBase();
    const list = sortedOrders().filter((order) => order.status === 'pending' || order.status === 'doing');
    let total = 0;

    list.forEach((order) => {
      const service = getService(order.serviceId);
      const hours = Math.max(0.5, Number(order.estimateHours ?? service?.estimateHours ?? 1) || 1);
      order.estimateStart = hoursToDate(total, config);
      total += hours;
      order.estimateEnd = hoursToDate(total, config);
    });
  }

  function showToast(message, type = '') {
    const toast = $('#toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast show ${type}`.trim();
    toastTimer = setTimeout(() => {
      toast.className = 'toast';
    }, 2600);
  }

  function makeSalt() {
    return Math.random().toString(36).slice(2, 10);
  }

  async function hashPassword(password, salt) {
    const text = `${salt}:${password}`;
    if (globalThis.crypto?.subtle?.digest) {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    return `fallback-${hash.toString(16)}`;
  }

  function getCurrentUser() {
    const username = state.session?.username;
    return state.accounts.find((account) => account.username === username) || null;
  }

  function getUserOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    return sortedOrders()
      .map((order, index) => ({ ...order, queueNumber: index + 1 }))
      .filter((order) => order.customerAccount === user.username);
  }

  function renderContactQQ() {
    const qq = String(state.settings.serviceQQ || DEFAULT_SETTINGS.serviceQQ);
    const url = `https://wpa.qq.com/msgrd?v=3&uin=${encodeURIComponent(qq)}&site=qq&menu=yes`;
    const header = $('#headerQQ');
    const supportLink = $('#supportQQ');
    const supportText = $('#supportQQText');
    const fab = $('#fabQQ');
    if (header) { header.textContent = `客服 QQ ${qq}`; header.href = url; }
    if (supportLink) { supportLink.textContent = `发起 QQ 会话：${qq}`; supportLink.href = url; }
    if (supportText) supportText.textContent = `唯一客服 QQ：${qq}（本人亲自处理，不委托他人）`;
    if (fab) { fab.textContent = `唯一客服 QQ：${qq}`; fab.href = url; }
  }

  function copyQQ() {
    const qq = String(state.settings.serviceQQ || DEFAULT_SETTINGS.serviceQQ);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(qq).then(() => showToast('客服 QQ 已复制', 'success')).catch(() => showToast(`客服 QQ：${qq}`));
    } else {
      showToast(`客服 QQ：${qq}`);
    }
  }

  function renderAccount() {
    const user = getCurrentUser();
    $('#accountGuest').hidden = Boolean(user);
    $('#accountPanel').hidden = !user;
    if (!user) return;

    $('#accountInfo').innerHTML = `
      <h3>${esc(user.username)}</h3>
      <p class="account-meta">注册时间：${esc(formatDateTime(user.createdAt))} ｜ 唯一客服 QQ：${esc(state.settings.serviceQQ)}</p>
      <p class="hint warn">账户与订单只保存在当前浏览器，换设备或清理缓存后不会同步；售后请直接 QQ 联系。</p>
    `;

    const orders = getUserOrders();
    const labels = { pending: '待排单', doing: '进行中', done: '已完成', cancelled: '已取消' };
    $('#myOrderList').innerHTML = orders.length ? orders.map((order) => `
      <article class="order-card">
        <div class="order-head">
          <div class="order-title">
            <span class="queue-no">#${order.queueNumber}</span>
            <div>
              <h3>${esc(order.serviceName)}</h3>
              <p>${esc(order.game)} · 下单于 ${esc(formatDateTime(order.createdAt))}</p>
            </div>
          </div>
          <span class="status-badge status-${esc(order.status)}">${labels[order.status] || '待排单'}</span>
        </div>
        <div class="info-grid">
          <div class="info-item"><span>公开报价</span><strong>${esc(formatPrice(order.price).text)}</strong></div>
          <div class="info-item"><span>预计完成</span><strong>${esc(order.estimateEnd ? formatDateTime(order.estimateEnd) : '待排')}</strong></div>
        </div>
        <div class="order-actions">
          <button class="mini-btn" data-action="support-order" data-id="${esc(order.id)}">对此订单申请售后</button>
        </div>
      </article>
    `).join('') : '<div class="empty">当前账户还没有订单。</div>';
  }

  function renderSupport() {
    const user = getCurrentUser();
    $('#supportGuest').hidden = Boolean(user);
    $('#supportContent').hidden = !user;
    renderContactQQ();
    if (!user) return;

    const orders = getUserOrders();
    const select = $('#supportOrderSelect');
    const previous = select.value;
    select.innerHTML = orders.length
      ? orders.map((order) => `<option value="${esc(order.id)}">#${order.queueNumber} ${esc(order.serviceName)} · ${esc(formatDateTime(order.createdAt))}</option>`).join('')
      : '<option value="">当前账户暂无订单</option>';
    select.value = orders.some((order) => order.id === previous) ? previous : (orders[0]?.id || '');
    select.disabled = !orders.length;

    const contactInput = $('#supportForm').elements.contact;
    if (!contactInput.value && orders[0]?.contact) contactInput.value = orders[0].contact;

    const tickets = state.afterSales
      .filter((ticket) => ticket.username === user.username)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const labels = { pending: '待处理', doing: '处理中', done: '已完成' };
    $('#supportList').innerHTML = tickets.length ? tickets.map((ticket) => `
      <div class="support-ticket">
        <div class="support-ticket-head">
          <div>
            <strong>${esc(ticket.type)}</strong>
            <div class="support-meta">${esc(ticket.serviceName)} · ${esc(formatDateTime(ticket.createdAt))}</div>
          </div>
          <span class="ticket-status ticket-${esc(ticket.status)}">${labels[ticket.status] || '待处理'}</span>
        </div>
        <div class="support-desc">${esc(ticket.description)}</div>
        ${ticket.reply ? `<div class="support-reply">客服回复：${esc(ticket.reply)}</div>` : '<div class="support-meta">客服尚未回复，可直接在 QQ 中联系。</div>'}
      </div>
    `).join('') : '<div class="empty">当前账户还没有售后工单。</div>';
  }

  function renderSupportAdmin() {
    const tickets = state.afterSales.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    $('#supportTicketCount').textContent = `共 ${tickets.length} 条`;
    const labels = { pending: '待处理', doing: '处理中', done: '已完成' };
    $('#supportAdminList').innerHTML = tickets.length ? tickets.map((ticket) => `
      <div class="support-ticket">
        <div class="support-ticket-head">
          <div>
            <strong>${esc(ticket.type)} · ${esc(ticket.username)}</strong>
            <div class="support-meta">${esc(ticket.serviceName)} · ${esc(formatDateTime(ticket.createdAt))} · 联系：${esc(ticket.contact)}</div>
          </div>
          <span class="ticket-status ticket-${esc(ticket.status)}">${labels[ticket.status] || '待处理'}</span>
        </div>
        <div class="support-desc">${esc(ticket.description)}</div>
        ${ticket.reply ? `<div class="support-reply">客服回复：${esc(ticket.reply)}</div>` : ''}
        <div class="reply-box">
          <textarea data-reply-id="${esc(ticket.id)}" rows="2" placeholder="输入客服回复">${esc(ticket.reply || '')}</textarea>
        </div>
        <div class="support-actions-row">
          <button class="mini-btn" data-action="save-reply" data-id="${esc(ticket.id)}">保存回复</button>
          <button class="mini-btn" data-action="support-status" data-id="${esc(ticket.id)}" data-status="pending">待处理</button>
          <button class="mini-btn" data-action="support-status" data-id="${esc(ticket.id)}" data-status="doing">处理中</button>
          <button class="mini-btn" data-action="support-status" data-id="${esc(ticket.id)}" data-status="done">已完成</button>
        </div>
      </div>
    `).join('') : '<div class="empty">暂无售后工单。</div>';
  }

  async function registerUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const username = String(form.elements.username.value || '').trim();
    const password = String(form.elements.password.value || '');
    const confirmPassword = String(form.elements.confirmPassword.value || '');
    if (password !== confirmPassword) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }
    if (state.accounts.some((account) => account.username === username)) {
      showToast('该用户名已注册', 'error');
      return;
    }
    const salt = makeSalt();
    const hash = await hashPassword(password, salt);
    state.accounts.push({ id: makeId('user'), username, salt, hash, createdAt: new Date().toISOString() });
    state.session = { username };
    form.reset();
    saveState();
    renderAll();
    showToast('注册成功，已自动登录', 'success');
  }

  async function loginUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const username = String(form.elements.username.value || '').trim();
    const password = String(form.elements.password.value || '');
    const account = state.accounts.find((item) => item.username === username);
    if (!account) {
      showToast('用户不存在', 'error');
      return;
    }
    const hash = await hashPassword(password, account.salt);
    if (hash !== account.hash) {
      showToast('密码不正确', 'error');
      return;
    }
    state.session = { username };
    form.reset();
    saveState();
    renderAll();
    showToast('登录成功', 'success');
  }

  function logoutUser() {
    state.session = null;
    saveState();
    renderAll();
    showToast('已退出登录');
  }

  function submitSupport(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const user = getCurrentUser();
    if (!user) {
      showToast('请先登录账户', 'error');
      switchView('account');
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const order = getUserOrders().find((item) => item.id === form.elements.orderId.value);
    if (!order) {
      showToast('请选择你的订单', 'error');
      return;
    }
    const data = new FormData(form);
    state.afterSales.push({
      id: makeId('ticket'),
      username: user.username,
      orderId: order.id,
      serviceName: order.serviceName,
      type: String(data.get('type') || ''),
      contact: String(data.get('contact') || '').trim(),
      description: String(data.get('description') || '').trim(),
      status: 'pending',
      reply: '',
      createdAt: new Date().toISOString()
    });
    form.elements.description.value = '';
    saveState();
    renderAll();
    showToast('售后工单已提交，请同时 QQ 联系客服', 'success');
  }

  function saveSupportReply(id) {
    const ticket = state.afterSales.find((item) => item.id === id);
    if (!ticket) return;
    const textarea = $$('textarea[data-reply-id]').find((element) => element.dataset.replyId === id);
    ticket.reply = textarea ? textarea.value.trim() : ticket.reply;
    saveState();
    renderAll();
    showToast('客服回复已保存', 'success');
  }

  function setSupportStatus(id, status) {
    const ticket = state.afterSales.find((item) => item.id === id);
    if (!ticket) return;
    ticket.status = status;
    saveState();
    renderAll();
    showToast('工单状态已更新', 'success');
  }

  function switchView(view) {
    $$('.nav-btn').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
    $$('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
    if (view === 'board') renderBoard();
    if (view === 'account') renderAccount();
    if (view === 'support') renderSupport();
    if (view === 'admin') renderAdmin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderHall() {
    $('#hallTitle').textContent = state.settings.title || DEFAULT_SETTINGS.title;
    $('#hallIntro').textContent = state.settings.intro || '';
    $('#hallNotice').textContent = state.settings.notice || '暂无公告';

    const services = activeServices();
    $('#statServices').textContent = String(services.length);
    $('#statPending').textContent = String(state.orders.filter((order) => order.status === 'pending').length);
    $('#statDoing').textContent = String(state.orders.filter((order) => order.status === 'doing').length);

    const games = ['全部', ...Array.from(new Set(services.map((service) => service.game || '其他')))];
    if (!games.includes(hallFilter)) hallFilter = '全部';
    $('#gameFilters').innerHTML = games.map((game) => `
      <button class="filter-chip ${game === hallFilter ? 'active' : ''}" data-action="hall-filter" data-game="${esc(game)}">${esc(game)}</button>
    `).join('');

    const keyword = ($('#hallSearch').value || '').trim().toLowerCase();
    const visible = services.filter((service) => {
      const matchGame = hallFilter === '全部' || (service.game || '其他') === hallFilter;
      const text = `${service.name} ${service.desc} ${service.category} ${service.tag} ${service.price || ''} ${service.priceNote || ''} ${service.includes || ''}`.toLowerCase();
      return matchGame && (!keyword || text.includes(keyword));
    });

    $('#serviceGrid').innerHTML = visible.length ? visible.map((service) => {
      const price = formatPrice(service.price);
      const color = gameColor(service.game);
      return `
        <article class="service-card" style="--game-color:${color}">
          <div class="card-top">
            <span class="game-badge">${esc(service.game || '其他')}</span>
            ${service.tag ? `<span class="card-tag">${esc(service.tag)}</span>` : ''}
          </div>
          <h3 class="card-title">${esc(service.name)}</h3>
          <p class="card-desc">${esc(service.desc || '暂无详细说明')}</p>
          <div class="price-box">
            <span class="price-label">公开报价</span>
            <span class="price ${price.soft ? 'soft' : ''}">${esc(price.text)}</span>
            ${service.priceNote ? `<span class="price-note">${esc(service.priceNote)}</span>` : ''}
          </div>
          ${service.includes ? `<p class="include-line"><span>包含</span>${esc(service.includes)}</p>` : ''}
          <p class="estimate">分类：${esc(service.category || '其他')} · 预计 ${Number(service.estimateHours) || 1} 小时</p>
          <div class="card-meta">
            <button class="card-action" data-action="service-order" data-id="${esc(service.id)}">按此价格下单</button>
          </div>
        </article>
      `;
    }).join('') : '<div class="empty">暂无匹配的服务，可在管理模式中创建。</div>';
  }

  function renderOrderForm() {
    const select = $('#serviceSelect');
    const previous = select.value;
    const services = activeServices();
    select.innerHTML = services.map((service) => {
      const price = formatPrice(service.price);
      return `<option value="${esc(service.id)}">${esc(service.game)} / ${esc(service.name)} · ${esc(price.text)}</option>`;
    }).join('');

    const selectedId = services.some((service) => service.id === previous) ? previous : (services[0]?.id || '');
    select.value = selectedId;
    select.disabled = services.length === 0;
    $('button[type="submit"]', $('#orderForm')).disabled = services.length === 0;
    $('#paymentInfo').textContent = `${state.settings.payment || DEFAULT_SETTINGS.payment}\n唯一客服 QQ：${state.settings.serviceQQ || DEFAULT_SETTINGS.serviceQQ}`;
    updateServicePreview();
  }

  function getSelectedTaskAddonDetails() {
    return getTaskAddons().filter((item) => selectedTaskAddons.has(item.id));
  }

  function updateTaskAddonTotal() {
    const details = getSelectedTaskAddonDetails();
    const total = details.reduce((sum, item) => sum + item.price, 0);
    const totalEl = $('#taskAddonTotal');
    const summaryEl = $('#summaryTaskAddons');
    if (totalEl) {
      totalEl.textContent = details.length ? `已选 ${details.length} 项任务，加购合计 ¥${total}` : '未选择加购任务';
    }
    if (summaryEl) {
      summaryEl.innerHTML = details.length ? `
        <div class="summary-row"><span>加购任务</span><strong>${details.map((item) => esc(item.name)).join('、')}</strong></div>
        <div class="summary-row"><span>任务加购合计</span><strong class="summary-price">¥${total}</strong></div>
      ` : '';
    }
  }

  function renderTaskAddons(game) {
    const section = $('#taskAddonSection');
    const list = $('#taskAddonList');
    if (!section || !list) return;

    const options = getTaskAddons().filter((item) => item.game === game);
    selectedTaskAddons = new Set([...selectedTaskAddons].filter((id) => options.some((item) => item.id === id)));

    if (!options.length) {
      section.hidden = true;
      updateTaskAddonTotal();
      return;
    }

    section.hidden = false;
    const groups = Array.from(new Set(options.map((item) => item.group)));
    list.innerHTML = groups.map((group) => {
      const groupItems = options.filter((item) => item.group === group);
      const hasFull = groupItems.some((item) => item.kind === 'full');
      return `
        <details class="addon-group" open>
          <summary>
            <span class="addon-scope">任务</span>
            <strong>${esc(group)}</strong>
            ${hasFull ? '<em>大任务全包与小任务互斥</em>' : ''}
          </summary>
          <div class="addon-grid">
            ${groupItems.map((item) => `
              <label class="addon-item ${item.kind === 'full' ? 'full-option' : ''}">
                <input type="checkbox" data-task-addon-id="${esc(item.id)}" data-kind="${item.kind || 'item'}" ${selectedTaskAddons.has(item.id) ? 'checked' : ''} />
                <span class="addon-name">${item.subgroup ? `[${esc(item.subgroup)}] ` : ''}${esc(item.name)}</span>
                <span class="addon-price">¥${item.price}</span>
                <span class="addon-note">${esc(item.note)}</span>
              </label>
            `).join('')}
          </div>
        </details>
      `;
    }).join('');
    updateTaskAddonTotal();
  }

  function getSelectedCommissionDetails() {
    return getCommissionAddons().filter((item) => selectedCommissions.has(item.id));
  }

  function updateCommissionTotal() {
    const details = getSelectedCommissionDetails();
    const total = details.reduce((sum, item) => sum + item.price, 0);
    const totalEl = $('#commissionTotal');
    const summaryEl = $('#summaryCommissions');
    if (totalEl) {
      totalEl.textContent = details.length ? `已勾选 ${details.length} 项，委托合计 ¥${total}` : '未勾选委托';
    }
    if (summaryEl) {
      summaryEl.innerHTML = details.length ? `
        <div class="summary-row"><span>勾选委托</span><strong>${details.map((item) => esc(item.name)).join('、')}</strong></div>
        <div class="summary-row"><span>委托合计</span><strong class="summary-price">¥${total}</strong></div>
      ` : '';
    }
  }

  function renderCommissions(game) {
    const section = $('#commissionSection');
    const list = $('#commissionList');
    if (!section || !list) return;

    const options = getCommissionAddons().filter((item) => item.game === game);
    selectedCommissions = new Set([...selectedCommissions].filter((id) => options.some((item) => item.id === id)));

    if (!options.length) {
      section.hidden = true;
      updateCommissionTotal();
      return;
    }

    section.hidden = false;
    const groups = Array.from(new Set(options.map((item) => item.group)));
    list.innerHTML = groups.map((group) => `
      <div class="addon-group">
        <h4>${esc(game)} · ${esc(group)}</h4>
        <div class="addon-grid">
          ${options.filter((item) => item.group === group).map((item) => `
            <label class="addon-item">
              <input type="checkbox" data-commission-id="${esc(item.id)}" ${selectedCommissions.has(item.id) ? 'checked' : ''} />
              <span class="addon-name">${esc(item.name)}</span>
              <span class="addon-price">¥${item.price} / ${esc(item.unit)}</span>
              <span class="addon-note">${esc(item.note)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
    updateCommissionTotal();
  }

  function getSelectedAddonDetails() {
    return getMapAddons().filter((addon) => selectedAddons.has(addon.id));
  }

  function updateAddonTotal() {
    const details = getSelectedAddonDetails();
    const total = details.reduce((sum, addon) => sum + addon.price, 0);
    const totalEl = $('#addonTotal');
    const summaryEl = $('#summaryAddons');
    if (totalEl) {
      totalEl.textContent = details.length ? `已选 ${details.length} 项，加购合计 ¥${total}` : '未选择加购小地图';
    }
    if (summaryEl) {
      summaryEl.innerHTML = details.length ? `
        <div class="summary-row"><span>加购小地图</span><strong>${details.map((addon) => esc(addon.name)).join('、')}</strong></div>
        <div class="summary-row"><span>加购合计</span><strong class="summary-price">¥${total}</strong></div>
      ` : '';
    }
  }

  function renderAddons(game) {
    const section = $('#addonSection');
    const list = $('#addonList');
    if (!section || !list) return;

    const options = getMapAddons().filter((addon) => addon.game === game);
    selectedAddons = new Set([...selectedAddons].filter((id) => options.some((addon) => addon.id === id)));

    if (!options.length) {
      section.hidden = true;
      updateAddonTotal();
      return;
    }

    section.hidden = false;
    const groups = Array.from(new Set(options.map((addon) => addon.group)));
    const scopeLabel = game === '原神' ? '国家' : '星球';
    list.innerHTML = groups.map((group) => {
      const groupOptions = options.filter((addon) => addon.group === group);
      const fullItem = groupOptions.find((addon) => addon.kind === 'full');
      return `
        <details class="addon-group" open>
          <summary>
            <span class="addon-scope">${scopeLabel}</span>
            <strong>${esc(game)} · ${esc(group)}</strong>
            ${fullItem ? `<em>可单选全图 ¥${fullItem.price}</em>` : ''}
          </summary>
          <div class="addon-grid">
            ${groupOptions.map((addon) => `
              <label class="addon-item ${addon.kind === 'full' ? 'full-option' : ''}">
                <input type="checkbox" data-addon-id="${esc(addon.id)}" data-kind="${addon.kind || 'area'}" ${selectedAddons.has(addon.id) ? 'checked' : ''} />
                <span class="addon-name">${esc(addon.name)}</span>
                <span class="addon-price">¥${addon.price}</span>
                <span class="addon-note">${esc(addon.note)}</span>
              </label>
            `).join('')}
          </div>
        </details>
      `;
    }).join('');
    updateAddonTotal();
  }

  function updateServicePreview() {
    const service = getService($('#serviceSelect').value);
    const preview = $('#servicePreview');
    const summary = $('#orderSummary');

    if (!service) {
      preview.textContent = '当前没有可下单的服务，请先在管理模式中创建。';
      summary.innerHTML = '<h3>当前选择</h3><p class="muted">尚未选择服务</p>';
      renderCommissions('');
      renderAddons('');
      renderTaskAddons('');
      return;
    }

    const price = formatPrice(service.price);
    const priceNote = service.priceNote ? `（${service.priceNote}）` : '';
    preview.textContent = `${service.desc || '暂无详细说明'} ｜ 公开报价 ${price.text}${priceNote} ｜ 预计 ${Number(service.estimateHours) || 1} 小时`;
    summary.innerHTML = `
      <h3>当前选择</h3>
      <div class="summary-row"><span>游戏</span><strong>${esc(service.game)}</strong></div>
      <div class="summary-row"><span>服务</span><strong>${esc(service.name)}</strong></div>
      <div class="summary-row"><span>分类</span><strong>${esc(service.category || '其他')}</strong></div>
      <div class="summary-row"><span>公开报价</span><strong class="summary-price">${esc(price.text)}</strong></div>
      ${service.priceNote ? `<div class="summary-row"><span>价格说明</span><strong>${esc(service.priceNote)}</strong></div>` : ''}
      ${service.includes ? `<div class="summary-row"><span>包含内容</span><strong>${esc(service.includes)}</strong></div>` : ''}
      <div id="summaryCommissions"></div>
      <div id="summaryAddons"></div>
      <div id="summaryTaskAddons"></div>
      <div class="summary-row"><span>预计耗时</span><strong>${Number(service.estimateHours) || 1} 小时</strong></div>
    `;

    if (service.allowCommissionPricing || getCommissionAddons().some((item) => item.game === service.game)) renderCommissions(service.game);
    else {
      $('#commissionSection').hidden = true;
      selectedCommissions.clear();
      updateCommissionTotal();
    }

    if (service.allowAddonPricing || getMapAddons().some((item) => item.game === service.game)) renderAddons(service.game);
    else {
      $('#addonSection').hidden = true;
      selectedAddons.clear();
      updateAddonTotal();
    }

    if (getTaskAddons().some((item) => item.game === service.game)) renderTaskAddons(service.game);
    else {
      $('#taskAddonSection').hidden = true;
      selectedTaskAddons.clear();
      updateTaskAddonTotal();
    }
  }

  function renderBoard() {
    const locked = !unlocked;
    $('#boardLocked').hidden = !locked;
    $('#boardContent').hidden = locked;
    if (locked) return;

    const orders = sortedOrders();
    const counts = {
      pending: orders.filter((order) => order.status === 'pending').length,
      doing: orders.filter((order) => order.status === 'doing').length,
      done: orders.filter((order) => order.status === 'done').length,
      cancelled: orders.filter((order) => order.status === 'cancelled').length
    };
    $('#boardStats').innerHTML = `
      <div class="stat-card"><strong>${orders.length}</strong><span>全部订单</span></div>
      <div class="stat-card"><strong>${counts.pending}</strong><span>待排单</span></div>
      <div class="stat-card"><strong>${counts.doing}</strong><span>进行中</span></div>
      <div class="stat-card"><strong>${counts.done}</strong><span>已完成</span></div>
    `;

    const statuses = ['全部', 'pending', 'doing', 'done', 'cancelled'];
    const statusLabels = { pending: '待排单', doing: '进行中', done: '已完成', cancelled: '已取消' };
    $('#boardFilters').innerHTML = statuses.map((status) => `
      <button class="filter-chip ${status === boardFilter ? 'active' : ''}" data-action="board-filter" data-status="${status}">${status === '全部' ? '全部' : statusLabels[status]}</button>
    `).join('');

    const keyword = ($('#boardSearch').value || '').trim().toLowerCase();
    const visible = orders.filter((order) => {
      const matchStatus = boardFilter === '全部' || order.status === boardFilter;
      const text = `${order.customerName} ${order.game} ${order.serviceName} ${order.contact} ${order.accountUid}`.toLowerCase();
      return matchStatus && (!keyword || text.includes(keyword));
    });

    if (!visible.length) {
      $('#orderList').innerHTML = '<div class="empty">暂无符合条件的订单。</div>';
      return;
    }

    $('#orderList').innerHTML = visible.map((order) => {
      const queueNumber = orders.findIndex((item) => item.id === order.id) + 1;
      const statusLabel = statusLabels[order.status] || '待排单';
      const activeOrders = orders.filter((item) => item.status === 'pending' || item.status === 'doing');
      const isActive = order.status === 'pending' || order.status === 'doing';
      const position = activeOrders.findIndex((item) => item.id === order.id);
      const canUp = isActive && position > 0;
      const canDown = isActive && position < activeOrders.length - 1;
      const noteParts = [order.remark, order.accountNote].filter(Boolean);

      return `
        <article class="order-card">
          <div class="order-head">
            <div class="order-title">
              <span class="queue-no ${order.pinned ? 'pinned' : ''}">#${queueNumber}</span>
              <div>
                <h3>${esc(order.serviceName)}</h3>
                <p>${esc(order.game)} · ${esc(order.category || '代肝服务')} · 下单于 ${esc(formatDateTime(order.createdAt))}</p>
              </div>
            </div>
            <span class="status-badge status-${esc(order.status)}">${statusLabel}</span>
          </div>

          <div class="info-grid">
            <div class="info-item"><span>顾客</span><strong>${esc(order.customerName)}</strong></div>
            ${order.customerAccount ? `<div class="info-item"><span>账户</span><strong>${esc(order.customerAccount)}</strong></div>` : ''}
            <div class="info-item"><span>联系方式</span><strong>${esc(order.contactType)}：${esc(order.contact)}</strong></div>
            <div class="info-item"><span>付款方式</span><strong>${esc(order.paymentMethod || '待确认')}</strong></div>
            <div class="info-item"><span>可接受时间</span><strong>${esc(order.availableTime || '随时')}</strong></div>
            <div class="info-item"><span>游戏账号 / UID</span><strong>${esc(order.accountUid)}</strong></div>
            <div class="info-item"><span>区服 / 角色</span><strong>${esc([order.server, order.roleName].filter(Boolean).join(' / ') || '-')}</strong></div>
            <div class="info-item"><span>登录方式</span><strong>${esc(order.loginType || '-')}</strong></div>
            <div class="info-item"><span>预计开工</span><strong>${esc(order.estimateStart ? formatDateTime(order.estimateStart) : '待排')}</strong></div>
            <div class="info-item"><span>预计完成</span><strong>${esc(order.estimateEnd ? formatDateTime(order.estimateEnd) : '待排')}</strong></div>
            <div class="info-item"><span>公开报价</span><strong>${esc(formatPrice(order.price).text)}</strong></div>
            ${order.priceNote ? `<div class="info-item"><span>价格说明</span><strong>${esc(order.priceNote)}</strong></div>` : ''}
            ${order.includes ? `<div class="info-item"><span>包含内容</span><strong>${esc(order.includes)}</strong></div>` : ''}
            ${order.commissions?.length ? `<div class="info-item"><span>勾选委托</span><strong>${order.commissions.map((item) => esc(item.name)).join('、')}</strong></div><div class="info-item"><span>委托合计</span><strong>¥${order.commissionTotal}</strong></div>` : ''}
            ${order.addons?.length ? `<div class="info-item"><span>加购小地图</span><strong>${order.addons.map((addon) => esc(addon.name)).join('、')}</strong></div><div class="info-item"><span>加购合计</span><strong>¥${order.addonTotal}</strong></div>` : ''}
            ${order.taskAddons?.length ? `<div class="info-item"><span>加购任务</span><strong>${order.taskAddons.map((item) => esc(item.name)).join('、')}</strong></div><div class="info-item"><span>任务加购合计</span><strong>¥${order.taskAddonTotal}</strong></div>` : ''}
          </div>

          ${noteParts.length ? `<div class="order-note">备注：${noteParts.map(esc).join(' ｜ ')}</div>` : ''}

          <div class="order-actions">
            <button class="mini-btn ${order.pinned ? 'active' : ''}" data-action="pin" data-id="${esc(order.id)}" ${isActive ? '' : 'disabled'}>${order.pinned ? '取消置顶' : '置顶'}</button>
            <button class="mini-btn" data-action="move-up" data-id="${esc(order.id)}" ${canUp ? '' : 'disabled'}>上移</button>
            <button class="mini-btn" data-action="move-down" data-id="${esc(order.id)}" ${canDown ? '' : 'disabled'}>下移</button>
            ${order.status === 'pending' ? `<button class="mini-btn" data-action="set-status" data-id="${esc(order.id)}" data-status="doing">标记开工</button>` : ''}
            ${order.status === 'doing' ? `<button class="mini-btn" data-action="set-status" data-id="${esc(order.id)}" data-status="done">标记完成</button>` : ''}
            ${order.status === 'done' || order.status === 'cancelled' ? `<button class="mini-btn" data-action="set-status" data-id="${esc(order.id)}" data-status="pending">重新排单</button>` : ''}
            ${order.status !== 'cancelled' ? `<button class="mini-btn" data-action="set-status" data-id="${esc(order.id)}" data-status="cancelled">取消订单</button>` : ''}
            <button class="mini-btn" data-action="copy-order" data-id="${esc(order.id)}">复制订单信息</button>
            <button class="mini-btn danger" data-action="delete-order" data-id="${esc(order.id)}">删除</button>
          </div>
        </article>
      `;
    }).join('');
  }

  const CUSTOM_ADDON_TYPE_LABELS = {
    task: '任务加购箱',
    map: '小地图加购',
    commission: '可勾选委托'
  };

  function renderCustomAddonAdmin() {
    const list = $('#customAddonAdminList');
    if (!list) return;
    const items = state.customAddons || [];
    $('#customAddonCount').textContent = `共 ${items.length} 项`;
    if (!items.length) {
      list.innerHTML = '<div class="empty">还没有自定义加购项，在上方添加后即可在下单页对应加购箱勾选。</div>';
      return;
    }
    list.innerHTML = items.map((item) => `
      <div class="admin-item ${item.enabled === false ? 'disabled' : ''}">
        <div class="admin-item-head">
          <div>
            <strong>${esc(item.name)}</strong>
            <div class="admin-meta">${esc(item.game)} / ${esc(CUSTOM_ADDON_TYPE_LABELS[item.type] || item.type)} · ¥${item.price}${item.unit ? ` / ${esc(item.unit)}` : ''}${item.group ? ` · 分组：${esc(item.group)}` : ''}${item.subgroup ? ` · 子分组：${esc(item.subgroup)}` : ''}${item.kind === 'full' ? ' · 全包互斥' : ''}${item.note ? ` · ${esc(item.note)}` : ''}${item.enabled === false ? ' · 已隐藏' : ''}</div>
          </div>
          <span class="game-badge" style="--game-color:${gameColor(item.game)}">${esc(item.game)}</span>
        </div>
        <div class="admin-actions">
          <button class="mini-btn" data-action="edit-custom-addon" data-id="${esc(item.id)}">编辑</button>
          <button class="mini-btn" data-action="toggle-custom-addon" data-id="${esc(item.id)}">${item.enabled === false ? '重新展示' : '暂时隐藏'}</button>
          <button class="mini-btn danger" data-action="delete-custom-addon" data-id="${esc(item.id)}">删除</button>
        </div>
      </div>
    `).join('');
  }

  function resetCustomAddonForm() {
    editingCustomAddonId = null;
    const form = $('#customAddonForm');
    if (!form) return;
    form.reset();
    form.elements.type.value = 'task';
    form.elements.hours.value = '0.5';
    form.elements.unit.value = '次';
    form.elements.enabled.checked = true;
    $('#customAddonFormTitle').textContent = '添加自定义加购项';
    $('#customAddonSubmitBtn').textContent = '添加加购项';
    $('#cancelEditCustomAddon').hidden = true;
  }

  function saveCustomAddon(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const price = Number(data.get('price'));
    if (!Number.isFinite(price) || price < 0) {
      showToast('请填写有效的价格', 'error');
      return;
    }
    const payload = {
      type: String(data.get('type') || 'task'),
      game: String(data.get('game') || '').trim(),
      group: String(data.get('group') || '').trim() || '自定义加购',
      subgroup: String(data.get('subgroup') || '').trim(),
      name: String(data.get('name') || '').trim(),
      price,
      hours: Math.max(0, Number(data.get('hours')) || 0),
      note: String(data.get('note') || '').trim(),
      unit: String(data.get('unit') || '').trim(),
      kind: data.has('kindFull') ? 'full' : '',
      enabled: data.has('enabled')
    };
    if (!payload.game || !payload.name) {
      showToast('游戏和项目名称为必填项', 'error');
      return;
    }
    if (!state.customAddons) state.customAddons = [];
    if (editingCustomAddonId) {
      const index = state.customAddons.findIndex((item) => item.id === editingCustomAddonId);
      if (index >= 0) {
        state.customAddons[index] = { ...state.customAddons[index], ...payload };
        showToast('加购项已更新', 'success');
      }
    } else {
      state.customAddons.push({ id: makeId('ca'), ...payload });
      showToast('加购项已添加', 'success');
    }
    resetCustomAddonForm();
    saveState();
    renderAll();
  }

  function editCustomAddon(id) {
    const item = (state.customAddons || []).find((entry) => entry.id === id);
    if (!item) return;
    editingCustomAddonId = id;
    const form = $('#customAddonForm');
    form.elements.type.value = item.type || 'task';
    form.elements.game.value = item.game || '';
    form.elements.group.value = item.group || '';
    form.elements.subgroup.value = item.subgroup || '';
    form.elements.name.value = item.name || '';
    form.elements.price.value = item.price;
    form.elements.hours.value = item.hours;
    form.elements.note.value = item.note || '';
    form.elements.unit.value = item.unit || '次';
    form.elements.kindFull.checked = item.kind === 'full';
    form.elements.enabled.checked = item.enabled !== false;
    $('#customAddonFormTitle').textContent = '编辑自定义加购项';
    $('#customAddonSubmitBtn').textContent = '保存修改';
    $('#cancelEditCustomAddon').hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function deleteCustomAddon(id) {
    const item = (state.customAddons || []).find((entry) => entry.id === id);
    if (!item || !window.confirm(`确认删除加购项「${item.name}」？已有订单不会受影响。`)) return;
    state.customAddons = state.customAddons.filter((entry) => entry.id !== id);
    if (editingCustomAddonId === id) resetCustomAddonForm();
    saveState();
    renderAll();
    showToast('加购项已删除');
  }

  function toggleCustomAddon(id) {
    const item = (state.customAddons || []).find((entry) => entry.id === id);
    if (!item) return;
    item.enabled = item.enabled === false;
    saveState();
    renderAll();
    showToast(item.enabled ? '加购项已重新展示' : '加购项已暂时隐藏');
  }

  function renderAdmin() {
    $('#adminLocked').hidden = unlocked;
    $('#adminContent').hidden = !unlocked;
    $('#lockPill').textContent = unlocked ? '管理模式已解锁' : '未解锁';
    $('#lockPill').classList.toggle('unlocked', unlocked);
    if (!unlocked) return;

    const settingsForm = $('#settingsForm');
    settingsForm.elements.title.value = state.settings.title || '';
    settingsForm.elements.intro.value = state.settings.intro || '';
    settingsForm.elements.notice.value = state.settings.notice || '';
    settingsForm.elements.payment.value = state.settings.payment || '';
    settingsForm.elements.hoursPerDay.value = state.settings.hoursPerDay;
    settingsForm.elements.workStart.value = state.settings.workStart;
    settingsForm.elements.serviceQQ.value = state.settings.serviceQQ || DEFAULT_SETTINGS.serviceQQ;
    settingsForm.elements.password.value = state.settings.password;

    $('#serviceCount').textContent = `共 ${state.services.length} 项`;
    $('#serviceAdminList').innerHTML = state.services.length ? state.services.map((service) => {
      const price = formatPrice(service.price);
      return `
        <div class="admin-item ${service.enabled === false ? 'disabled' : ''}">
          <div class="admin-item-head">
            <div>
              <strong>${esc(service.name)}</strong>
              <div class="admin-meta">${esc(service.game)} / ${esc(service.category || '其他')} · ${esc(price.text)}${service.priceNote ? `（${esc(service.priceNote)}）` : ''}${service.includes ? ` · 含：${esc(service.includes)}` : ''} · ${Number(service.estimateHours) || 1} 小时${service.allowAddonPricing ? ' · 按加购计费' : ''}${service.allowCommissionPricing ? ' · 按委托计费' : ''}${service.allowTaskAddonPricing ? ' · 按任务加购计费' : ''}${service.enabled === false ? ' · 已隐藏' : ''}</div>
            </div>
            <span class="game-badge" style="--game-color:${gameColor(service.game)}">${esc(service.game)}</span>
          </div>
          <div class="admin-actions">
            <button class="mini-btn" data-action="edit-service" data-id="${esc(service.id)}">编辑</button>
            <button class="mini-btn" data-action="toggle-service" data-id="${esc(service.id)}">${service.enabled === false ? '重新展示' : '暂时隐藏'}</button>
            <button class="mini-btn danger" data-action="delete-service" data-id="${esc(service.id)}">删除</button>
          </div>
        </div>
      `;
    }).join('') : '<div class="empty">还没有服务，先在上方创建一项吧。</div>';
    renderCustomAddonAdmin();
    renderSupportAdmin();
  }

  function renderAll() {
    renderHall();
    renderOrderForm();
    renderAccount();
    renderSupport();
    renderBoard();
    renderAdmin();
    renderContactQQ();
    if (unlocked) renderSupportAdmin();
  }

  function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      showToast('请补全必填信息', 'error');
      return;
    }

    const service = getService(form.elements.serviceId.value);
    if (!service) {
      showToast('请选择有效服务', 'error');
      return;
    }

    const commissionDetails = getSelectedCommissionDetails();
    const commissionTotal = commissionDetails.reduce((sum, item) => sum + item.price, 0);
    const commissionHours = commissionDetails.reduce((sum, item) => sum + item.hours, 0);
    const addonDetails = getSelectedAddonDetails();
    const addonTotal = addonDetails.reduce((sum, addon) => sum + addon.price, 0);
    const addonHours = addonDetails.reduce((sum, addon) => sum + addon.hours, 0);
    const taskAddonDetails = getSelectedTaskAddonDetails();
    const taskAddonTotal = taskAddonDetails.reduce((sum, item) => sum + item.price, 0);
    const taskAddonHours = taskAddonDetails.reduce((sum, item) => sum + item.hours, 0);
    if (service.allowCommissionPricing && !commissionDetails.length) {
      showToast('请至少勾选一项委托', 'error');
      return;
    }
    if (service.allowAddonPricing && !addonDetails.length) {
      showToast('请至少勾选一个小地图', 'error');
      return;
    }
    if (service.allowTaskAddonPricing && !taskAddonDetails.length) {
      showToast('请至少勾选一项加购任务', 'error');
      return;
    }

    const selectedTotal = commissionTotal + addonTotal + taskAddonTotal;
    const hasAnyAddonSelected = commissionDetails.length || addonDetails.length || taskAddonDetails.length;
    const finalPrice = (service.allowCommissionPricing || service.allowAddonPricing || service.allowTaskAddonPricing || hasAnyAddonSelected) ? `¥${selectedTotal}` : service.price;
    const priceNoteParts = [service.priceNote];
    if (commissionDetails.length) priceNoteParts.push(`勾选委托 ¥${commissionTotal}`);
    if (addonDetails.length) priceNoteParts.push(`另加购小地图 ¥${addonTotal}`);
    if (taskAddonDetails.length) priceNoteParts.push(`另加购任务 ¥${taskAddonTotal}`);
    const includesParts = [service.includes];
    if (commissionDetails.length) includesParts.push(commissionDetails.map((item) => item.name).join('、'));
    if (addonDetails.length) includesParts.push(addonDetails.map((addon) => addon.name).join('、'));
    if (taskAddonDetails.length) includesParts.push(taskAddonDetails.map((item) => item.name).join('、'));

    const data = new FormData(form);
    const nextIndex = state.orders.reduce((max, order) => Math.max(max, Number(order.queueIndex ?? 0)), -1) + 1;
    const order = {
      id: makeId('order'),
      serviceId: service.id,
      serviceName: service.name,
      game: service.game,
      category: service.category,
      price: finalPrice,
      priceNote: priceNoteParts.filter(Boolean).join('；'),
      includes: includesParts.filter(Boolean).join('；'),
      commissions: commissionDetails.map((item) => ({ id: item.id, name: item.name, price: item.price, unit: item.unit, note: item.note })),
      commissionTotal,
      addons: addonDetails.map((addon) => ({ id: addon.id, name: addon.name, price: addon.price, note: addon.note })),
      addonTotal,
      taskAddons: taskAddonDetails.map((item) => ({ id: item.id, name: item.name, price: item.price, note: item.note })),
      taskAddonTotal,
      estimateHours: (Number(service.estimateHours) || 1) + commissionHours + addonHours + taskAddonHours,
      customerAccount: getCurrentUser()?.username || '',
      customerName: String(data.get('customerName') || '').trim(),
      contactType: String(data.get('contactType') || ''),
      contact: String(data.get('contact') || '').trim(),
      paymentMethod: String(data.get('paymentMethod') || ''),
      availableTime: String(data.get('availableTime') || ''),
      accountUid: String(data.get('accountUid') || '').trim(),
      server: String(data.get('server') || '').trim(),
      roleName: String(data.get('roleName') || '').trim(),
      loginType: String(data.get('loginType') || ''),
      accountNote: String(data.get('accountNote') || '').trim(),
      remark: String(data.get('remark') || '').trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      pinned: false,
      queueIndex: nextIndex
    };

    state.orders.push(order);
    recalculateSchedule();
    saveState();

    const queueNumber = sortedOrders().findIndex((item) => item.id === order.id) + 1;
    const result = $('#orderResult');
    result.hidden = false;
    result.innerHTML = `
      <h3>下单成功</h3>
      <p class="muted">订单号 ${esc(order.id.slice(-6).toUpperCase())}</p>
      <div class="queue-big">第 ${queueNumber} 位</div>
      <div class="summary-row"><span>公开报价</span><strong class="summary-price">${esc(formatPrice(order.price).text)}</strong></div>
      ${order.priceNote ? `<div class="summary-row"><span>价格说明</span><strong>${esc(order.priceNote)}</strong></div>` : ''}
      ${order.includes ? `<div class="summary-row"><span>包含内容</span><strong>${esc(order.includes)}</strong></div>` : ''}
      ${order.commissions?.length ? `<div class="summary-row"><span>勾选委托</span><strong>${order.commissions.map((item) => esc(item.name)).join('、')}</strong></div><div class="summary-row"><span>委托合计</span><strong class="summary-price">¥${order.commissionTotal}</strong></div>` : ''}
      ${order.addons?.length ? `<div class="summary-row"><span>加购小地图</span><strong>${order.addons.map((addon) => esc(addon.name)).join('、')}</strong></div><div class="summary-row"><span>加购合计</span><strong class="summary-price">¥${order.addonTotal}</strong></div>` : ''}
      ${order.taskAddons?.length ? `<div class="summary-row"><span>加购任务</span><strong>${order.taskAddons.map((item) => esc(item.name)).join('、')}</strong></div><div class="summary-row"><span>任务加购合计</span><strong class="summary-price">¥${order.taskAddonTotal}</strong></div>` : ''}
      <p class="muted">已按下单时间进入队列，预计开工：${esc(order.estimateStart ? formatDateTime(order.estimateStart) : '待排')}</p>
    `;
    form.reset();
    selectedCommissions.clear();
    selectedAddons.clear();
    selectedTaskAddons.clear();
    renderAll();
    showToast('订单已提交，请在右侧查看排单号', 'success');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function autoSchedule() {
    const list = state.orders
      .filter((order) => order.status === 'pending' || order.status === 'doing')
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    list.forEach((order, index) => {
      order.queueIndex = index;
    });
    recalculateSchedule();
    saveState();
    renderAll();
    showToast(`已按时间重排 ${list.length} 个订单`, 'success');
  }

  function moveOrder(id, direction) {
    const list = sortedOrders().filter((order) => order.status === 'pending' || order.status === 'doing');
    const index = list.findIndex((order) => order.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;

    list.forEach((order, i) => {
      if (typeof order.queueIndex !== 'number') order.queueIndex = i;
    });
    const current = list[index].queueIndex;
    list[index].queueIndex = list[target].queueIndex;
    list[target].queueIndex = current;

    recalculateSchedule();
    saveState();
    renderAll();
    showToast('排单顺序已更新');
  }

  function setStatus(id, status) {
    const order = state.orders.find((item) => item.id === id);
    if (!order) return;
    order.status = status;
    if (status === 'done' || status === 'cancelled') order.finishedAt = new Date().toISOString();
    else delete order.finishedAt;
    recalculateSchedule();
    saveState();
    renderAll();
    showToast('订单状态已更新', 'success');
  }

  function deleteOrder(id) {
    const order = state.orders.find((item) => item.id === id);
    if (!order || !window.confirm(`确认删除 ${order.customerName} 的「${order.serviceName}」订单？`)) return;
    state.orders = state.orders.filter((item) => item.id !== id);
    recalculateSchedule();
    saveState();
    renderAll();
    showToast('订单已删除');
  }

  function copyOrderInfo(id) {
    const order = state.orders.find((item) => item.id === id);
    if (!order) return;
    const queueNumber = sortedOrders().findIndex((item) => item.id === id) + 1;
    const text = [
      `排单号：#${queueNumber}`,
      `服务：${order.game} / ${order.serviceName}`,
      `公开报价：${formatPrice(order.price).text}`,
      `价格说明：${order.priceNote || '-'}`,
      `包含内容：${order.includes || '-'}`,
      `勾选委托：${order.commissions?.length ? order.commissions.map((item) => `${item.name} ¥${item.price}/${item.unit}`).join('、') : '-'}`,
      `委托合计：¥${order.commissionTotal || 0}`,
      `加购小地图：${order.addons?.length ? order.addons.map((addon) => `${addon.name} ¥${addon.price}`).join('、') : '-'}`,
      `加购合计：¥${order.addonTotal || 0}`,
      `加购任务：${order.taskAddons?.length ? order.taskAddons.map((item) => `${item.name} ¥${item.price}`).join('、') : '-'}`,
      `任务加购合计：¥${order.taskAddonTotal || 0}`,
      `顾客：${order.customerName}`,
      `账户：${order.customerAccount || '-'}`,
      `联系方式：${order.contactType} ${order.contact}`,
      `付款方式：${order.paymentMethod || '待确认'}`,
      `账号/UID：${order.accountUid}`,
      `区服/角色：${[order.server, order.roleName].filter(Boolean).join(' / ') || '-'}`,
      `登录方式：${order.loginType || '-'}`,
      `下单时间：${new Date(order.createdAt).toLocaleString('zh-CN')}`,
      `预计完成：${order.estimateEnd ? formatDateTime(order.estimateEnd) : '待排'}`,
      `备注：${[order.remark, order.accountNote].filter(Boolean).join(' ｜ ') || '-'}`
    ].join('\n');

    const fallback = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('订单信息已复制', 'success');
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('订单信息已复制', 'success')).catch(fallback);
    } else {
      fallback();
    }
  }

  function saveSettings(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get('password') || '').trim();
    if (password.length < 4) {
      showToast('密码至少需要 4 位', 'error');
      return;
    }

    state.settings = {
      title: String(data.get('title') || '').trim() || DEFAULT_SETTINGS.title,
      intro: String(data.get('intro') || '').trim(),
      notice: String(data.get('notice') || '').trim(),
      payment: String(data.get('payment') || '').trim(),
      hoursPerDay: Math.max(0.5, Number(data.get('hoursPerDay')) || 6),
      workStart: String(data.get('workStart') || '19:00'),
      serviceQQ: String(data.get('serviceQQ') || '').trim() || DEFAULT_SETTINGS.serviceQQ,
      password
    };
    recalculateSchedule();
    saveState();
    renderAll();
    showToast('大厅设置已保存', 'success');
  }

  function saveService(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      game: String(data.get('game') || '').trim(),
      category: String(data.get('category') || '').trim(),
      name: String(data.get('name') || '').trim(),
      desc: String(data.get('desc') || '').trim(),
      price: String(data.get('price') || '').trim(),
      priceNote: String(data.get('priceNote') || '').trim(),
      includes: String(data.get('includes') || '').trim(),
      estimateHours: Math.max(0.5, Number(data.get('estimateHours')) || 1),
      tag: String(data.get('tag') || '').trim(),
      enabled: data.has('enabled'),
      allowAddonPricing: data.has('allowAddonPricing'),
      allowCommissionPricing: data.has('allowCommissionPricing'),
      allowTaskAddonPricing: data.has('allowTaskAddonPricing')
    };

    if (!payload.game || !payload.category || !payload.name) {
      showToast('游戏、分类和服务名称为必填项', 'error');
      return;
    }

    if (editingServiceId) {
      const index = state.services.findIndex((service) => service.id === editingServiceId);
      if (index >= 0) state.services[index] = { ...state.services[index], ...payload };
      showToast('服务已更新', 'success');
    } else {
      state.services.push({ id: makeId('svc'), ...payload });
      showToast('服务已创建', 'success');
    }

    resetServiceForm();
    recalculateSchedule();
    saveState();
    renderAll();
  }

  function editService(id) {
    const service = getService(id);
    if (!service) return;
    editingServiceId = id;
    const form = $('#serviceForm');
    form.elements.game.value = service.game || '';
    form.elements.category.value = service.category || '';
    form.elements.name.value = service.name || '';
    form.elements.desc.value = service.desc || '';
    form.elements.price.value = service.price || '';
    form.elements.priceNote.value = service.priceNote || '';
    const includesInput = form.elements.namedItem('includes');
    if (includesInput) includesInput.value = service.includes || '';
    form.elements.estimateHours.value = service.estimateHours || 1;
    form.elements.tag.value = service.tag || '';
    form.elements.enabled.checked = service.enabled !== false;
    const addonPricingInput = form.elements.namedItem('allowAddonPricing');
    if (addonPricingInput) addonPricingInput.checked = service.allowAddonPricing === true;
    const commissionPricingInput = form.elements.namedItem('allowCommissionPricing');
    if (commissionPricingInput) commissionPricingInput.checked = service.allowCommissionPricing === true;
    const taskPricingInput = form.elements.namedItem('allowTaskAddonPricing');
    if (taskPricingInput) taskPricingInput.checked = service.allowTaskAddonPricing === true;
    $('#serviceFormTitle').textContent = '编辑代肝服务';
    $('#serviceSubmitBtn').textContent = '保存修改';
    $('#cancelEditService').hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function resetServiceForm() {
    editingServiceId = null;
    $('#serviceForm').reset();
    $('#serviceFormTitle').textContent = '创建代肝服务';
    $('#serviceSubmitBtn').textContent = '创建服务';
    $('#cancelEditService').hidden = true;
  }

  function deleteService(id) {
    const service = getService(id);
    if (!service || !window.confirm(`确认删除服务「${service.name}」？已有订单不会受影响。`)) return;
    state.services = state.services.filter((item) => item.id !== id);
    if (editingServiceId === id) resetServiceForm();
    saveState();
    renderAll();
    showToast('服务已删除');
  }

  function toggleService(id) {
    const service = getService(id);
    if (!service) return;
    service.enabled = service.enabled === false;
    saveState();
    renderAll();
    showToast(service.enabled ? '服务已重新展示' : '服务已暂时隐藏');
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `代肝排单备份-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('备份文件已导出', 'success');
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || !Array.isArray(parsed.services) || !Array.isArray(parsed.orders)) {
          throw new Error('invalid');
        }
        const base = defaultState();
        state = {
          settings: { ...base.settings, ...(parsed.settings || {}) },
          services: parsed.services,
          orders: parsed.orders,
          accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
          afterSales: Array.isArray(parsed.afterSales) ? parsed.afterSales : [],
          customAddons: Array.isArray(parsed.customAddons) ? parsed.customAddons : [],
          session: parsed.session || null
        };
        saveState();
        renderAll();
        showToast('备份已导入', 'success');
      } catch {
        showToast('备份文件格式不正确', 'error');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!window.confirm('确认清空当前所有设置、服务和订单，并恢复默认数据？')) return;
    state = defaultState();
    unlocked = false;
    resetServiceForm();
    recalculateSchedule();
    saveState();
    renderAll();
    showToast('已恢复默认数据');
  }

  function unlockBoard() {
    const value = $('#boardPass').value;
    if (value !== String(state.settings.password)) {
      showToast('密码不正确', 'error');
      return;
    }
    unlocked = true;
    $('#boardPass').value = '';
    renderAll();
    showToast('排单看板已解锁', 'success');
  }

  function lockAll() {
    unlocked = false;
    renderAll();
    showToast('已锁定管理模式');
  }

  function handleAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;

    switch (action) {
      case 'go-order':
        switchView('order');
        break;
      case 'go-board':
        switchView('board');
        break;
      case 'go-account':
        switchView('account');
        break;
      case 'go-support':
        switchView('support');
        break;
      case 'support-order':
        switchView('support');
        $('#supportOrderSelect').value = id;
        break;
      case 'logout':
        logoutUser();
        break;
      case 'copy-qq':
        copyQQ();
        break;
      case 'save-reply':
        saveSupportReply(id);
        break;
      case 'support-status':
        setSupportStatus(id, button.dataset.status);
        break;
      case 'hall-filter':
        hallFilter = button.dataset.game || '全部';
        renderHall();
        break;
      case 'board-filter':
        boardFilter = button.dataset.status || '全部';
        renderBoard();
        break;
      case 'service-order':
        switchView('order');
        $('#serviceSelect').value = id;
        updateServicePreview();
        break;
      case 'toggle-lock':
        if (unlocked) lockAll();
        else switchView('admin');
        break;
      case 'unlock-board':
        unlockBoard();
        break;
      case 'lock-all':
        lockAll();
        break;
      case 'auto-schedule':
        autoSchedule();
        break;
      case 'move-up':
        moveOrder(id, -1);
        break;
      case 'move-down':
        moveOrder(id, 1);
        break;
      case 'pin': {
        const order = state.orders.find((item) => item.id === id);
        if (order) {
          order.pinned = !order.pinned;
          recalculateSchedule();
          saveState();
          renderAll();
          showToast(order.pinned ? '订单已置顶' : '已取消置顶');
        }
        break;
      }
      case 'set-status':
        setStatus(id, button.dataset.status);
        break;
      case 'delete-order':
        deleteOrder(id);
        break;
      case 'copy-order':
        copyOrderInfo(id);
        break;
      case 'edit-service':
        editService(id);
        break;
      case 'delete-service':
        deleteService(id);
        break;
      case 'toggle-service':
        toggleService(id);
        break;
      case 'edit-custom-addon':
        editCustomAddon(id);
        break;
      case 'delete-custom-addon':
        deleteCustomAddon(id);
        break;
      case 'toggle-custom-addon':
        toggleCustomAddon(id);
        break;
      case 'export':
        exportData();
        break;
      case 'import':
        $('#importInput').click();
        break;
      case 'reset':
        resetData();
        break;
      default:
        break;
    }
  }

  function bindEvents() {
    $$('.nav-btn').forEach((button) => {
      button.addEventListener('click', () => switchView(button.dataset.view));
    });

    document.addEventListener('click', handleAction);

    $('#hallSearch').addEventListener('input', renderHall);
    $('#boardSearch').addEventListener('input', renderBoard);
    $('#serviceSelect').addEventListener('change', updateServicePreview);
    $('#commissionList').addEventListener('change', (event) => {
      const input = event.target.closest('input[data-commission-id]');
      if (!input) return;
      const id = input.dataset.commissionId;
      if (input.checked) {
        const item = getCommissionAddons().find((entry) => entry.id === id);
        if (item?.exclusiveGroup) {
          selectedCommissions = new Set([...selectedCommissions].filter((selectedId) => {
            const selected = getCommissionAddons().find((entry) => entry.id === selectedId);
            return selected?.exclusiveGroup !== item.exclusiveGroup;
          }));
        }
        selectedCommissions.add(id);
      } else {
        selectedCommissions.delete(id);
      }
      renderCommissions(getService($('#serviceSelect').value)?.game || '');
    });
    $('#addonList').addEventListener('change', (event) => {
      const input = event.target.closest('input[data-addon-id]');
      if (!input) return;
      const id = input.dataset.addonId;
      if (input.checked) {
        const item = getMapAddons().find((entry) => entry.id === id);
        if (item) {
          selectedAddons = new Set([...selectedAddons].filter((selectedId) => {
            const selected = getMapAddons().find((entry) => entry.id === selectedId);
            if (!selected || selected.game !== item.game || selected.group !== item.group) return true;
            return item.kind === 'full' ? selected.kind === 'full' : selected.kind !== 'full';
          }));
        }
        selectedAddons.add(id);
      } else {
        selectedAddons.delete(id);
      }
      renderAddons(getService($('#serviceSelect').value)?.game || '');
    });
    $('#taskAddonList').addEventListener('change', (event) => {
      const input = event.target.closest('input[data-task-addon-id]');
      if (!input) return;
      const id = input.dataset.taskAddonId;
      if (input.checked) {
        const item = getTaskAddons().find((entry) => entry.id === id);
        if (item) {
          const itemKey = item.subgroup || item.group;
          selectedTaskAddons = new Set([...selectedTaskAddons].filter((selectedId) => {
            const selected = getTaskAddons().find((entry) => entry.id === selectedId);
            if (!selected) return true;
            const selectedKey = selected.subgroup || selected.group;
            if (selectedKey !== itemKey) return true;
            return item.kind !== 'full' && selected.kind !== 'full';
          }));
        }
        selectedTaskAddons.add(id);
      } else {
        selectedTaskAddons.delete(id);
      }
      renderTaskAddons(getService($('#serviceSelect').value)?.game || '');
    });
    $('#orderForm').addEventListener('submit', submitOrder);
    $('#registerForm').addEventListener('submit', registerUser);
    $('#loginForm').addEventListener('submit', loginUser);
    $('#supportForm').addEventListener('submit', submitSupport);
    $('#settingsForm').addEventListener('submit', saveSettings);
    $('#serviceForm').addEventListener('submit', saveService);
    $('#cancelEditService').addEventListener('click', resetServiceForm);
    $('#customAddonForm').addEventListener('submit', saveCustomAddon);
    $('#cancelEditCustomAddon').addEventListener('click', resetCustomAddonForm);
    $('#importInput').addEventListener('change', importData);

    $('#adminLoginForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const value = $('#adminPass').value;
      if (value !== String(state.settings.password)) {
        showToast('密码不正确', 'error');
        return;
      }
      unlocked = true;
      $('#adminPass').value = '';
      renderAll();
      showToast('已进入管理模式', 'success');
    });

    $('#boardPass').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        unlockBoard();
      }
    });
  }

  function init() {
    recalculateSchedule();
    bindEvents();
    renderAll();
  }

  init();
})();
