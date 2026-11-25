(() => {
  'use strict';

  const STORAGE_KEY = 'daigan-dispatch-desk-v1';

  const DEFAULT_SETTINGS = {
    title: '课余代肝 · 接单大厅',
    intro: '利用课余时间接单，主要覆盖原神、崩坏：星穹铁道的剧情推进、地图资源收集与每日委托，以及第五人格的日常活跃与加页手记。下单后按提交时间进入队列，进度可在排单看板查看。',
    notice: '所有服务已标注公开参考价，计费单位写在价格旁，可在管理模式中自行修改。大地图套餐已包含所属小地图；不想拍全图可选“小地图单独代肝”，并在下单页勾选多个小地图，按单项价格累加。月托套餐已包含每日委托，不重复收费。请下单前确认游戏账号可正常登录，付款方式以双方沟通为准。当前为静态演示版：订单只保存在你自己的浏览器里，店主暂时无法收到，请勿填写真实账号密码。',
    payment: '下单后请通过你填写的联系方式与我确认具体付款方式；建议先确认账号与需求，再完成付款。注意：静态版订单不会发送给店主，仅供本地演示。',
    hoursPerDay: 6,
    workStart: '19:00',
    password: '123456'
  };

  const DEFAULT_SERVICES = [
    { id: 'genshin-monthly', game: '原神', category: '日常托管', name: '原神月常委托（含每日委托）', desc: '按月托管每日委托、树脂与每周委托，避免每天重复下单。', price: '¥28 / 月', priceNote: '月付包含每日委托，无需另拍每日单', includes: '每日委托、树脂、每周委托', estimateHours: 1, tag: '含每日', enabled: true },
    { id: 'genshin-daily', game: '原神', category: '日常委托', name: '原神每日委托单日', desc: '完成当日四个委托及相关奖励。', price: '¥3 / 天', priceNote: '按月委托更划算', includes: '当日四个委托与奖励', estimateHours: 0.5, tag: '单日', enabled: true },
    { id: 'genshin-single-map', game: '原神', category: '地图探索', name: '原神小地图单独代肝（可多选）', desc: '不拍全图，直接在下单页勾选一个或多个小地图，按单项价格加购。', price: '按下方小地图加购计费', priceNote: '单项价格按价目表，支持多选累加', includes: '在下单页勾选单个小地图，可多选', estimateHours: 1, tag: '可多选', allowAddonPricing: true, enabled: true },
    { id: 'genshin-story-full', game: '原神', category: '剧情任务', name: '原神魔神任务全包', desc: '从序章推进至当前版本魔神任务。', price: '¥330 / 全包', priceNote: '单章 ¥15 起，按章节另拍', includes: '序章至当前版本全部魔神任务', estimateHours: 20, tag: '全包', enabled: true },
    { id: 'genshin-story-chapter', game: '原神', category: '剧情任务', name: '原神魔神任务单章', desc: '按指定章节推进魔神任务剧情。', price: '¥15 / 章', priceNote: '部分长章节 ¥10-20', includes: '指定章节剧情与前置', estimateHours: 3, tag: '剧情', enabled: true },
    { id: 'genshin-legend', game: '原神', category: '剧情任务', name: '原神传说任务', desc: '完成指定角色传说任务。', price: '¥20 / 个', priceNote: '长任务 ¥25-30', includes: '指定传说任务', estimateHours: 2, tag: '剧情', enabled: true },
    { id: 'genshin-world', game: '原神', category: '剧情任务', name: '原神世界任务', desc: '按区域清理世界任务与隐藏任务。', price: '¥15 / 个', priceNote: '复杂任务 ¥25-35', includes: '指定世界任务', estimateHours: 2, tag: '探索', enabled: true },
    { id: 'genshin-map', game: '原神', category: '地图探索', name: '原神大地图全收集（大图包小图）', desc: '按大地图打包探索，已包含该区域全部小地图，不重复收费。', price: '¥120 起 / 大图', priceNote: '蒙德120 璃月270 稻妻390 须弥670 枫丹420 纳塔400 挪德卡莱320 至冬200', includes: '大地图及所属小地图、宝箱、解密、成就、神瞳', estimateHours: 10, tag: '大图包', enabled: true },
    { id: 'genshin-chest', game: '原神', category: '地图探索', name: '原神大地图全宝箱专项', desc: '只清指定大地图内全部宝箱，适合已满探账号。', price: '¥150 起 / 大图', priceNote: '蒙德150 璃月320 稻妻500 至冬230，其他区域私聊确认', includes: '指定大地图全部宝箱（含小地图）', estimateHours: 6, tag: '宝箱', enabled: true },
    { id: 'hsr-daily-normal', game: '崩坏：星穹铁道', category: '日常托管', name: '星穹铁道普通日常托管（含每日委托）', desc: '基础月托，每日委托已包含在内。', price: '¥28 / 月', priceNote: '月付包含每日委托，无需另拍每日单', includes: '每日委托、体力、日常实训', estimateHours: 1, tag: '含每日', enabled: true },
    { id: 'hsr-daily-advanced', game: '崩坏：星穹铁道', category: '日常托管', name: '星穹铁道高级日常托管', desc: '在普通托管基础上增加周常玩法。', price: '¥38 / 月', priceNote: '按月计费', includes: '普通日常托管 + 差分宇宙 / 货币战（周积分）', estimateHours: 2, tag: '进阶', enabled: true },
    { id: 'hsr-daily-half', game: '崩坏：星穹铁道', category: '日常托管', name: '星穹铁道半托日常托管', desc: '适合活动较多时托管。', price: '¥68 / 月', priceNote: '按月计费', includes: '高级日常托管 + 大小活动', estimateHours: 3, tag: '半托', enabled: true },
    { id: 'hsr-daily-full', game: '崩坏：星穹铁道', category: '日常托管', name: '星穹铁道全托日常托管', desc: '尽可能覆盖全部日常与深渊。', price: '¥98 / 月', priceNote: '按月计费', includes: '半托日常托管 + 深渊（尽量打）', estimateHours: 5, tag: '全托', enabled: true },
    { id: 'hsr-story-full', game: '崩坏：星穹铁道', category: '剧情任务', name: '星穹铁道主线区域全包', desc: '按区域打包推进开拓任务。', price: '¥28 起 / 区域', priceNote: '雅利洛VI 28 仙舟罗浮45 匹诺康尼90 二相乐园/千星城120', includes: '指定区域全部主线剧情', estimateHours: 8, tag: '全包', enabled: true },
    { id: 'hsr-side', game: '崩坏：星穹铁道', category: '剧情任务', name: '星穹铁道开拓续闻 / 同行任务', desc: '推进指定续闻或同行任务。', price: '¥8 / 个', priceNote: '部分任务 ¥10-15 / 个', includes: '指定续闻或同行任务', estimateHours: 1.5, tag: '剧情', enabled: true },
    { id: 'hsr-events', game: '崩坏：星穹铁道', category: '玩法代肝', name: '星穹铁道常驻活动代肝', desc: '按项完成常驻活动内容，不含剧情。', price: '¥12 / 项', priceNote: '按活动项计费', includes: '指定常驻活动（不含剧情）', estimateHours: 1.5, tag: '活动', enabled: true },
    { id: 'hsr-map', game: '崩坏：星穹铁道', category: '地图探索', name: '星穹铁道大地图全收集（大图包小图）', desc: '按星球大地图打包，已包含所属小地图与区域内容。', price: '¥15 起 / 大图', priceNote: '空间站15 雅利洛VI30 仙舟罗浮120 匹诺康尼420 翁法罗斯190 二相乐园150', includes: '宝箱、折纸小鸟、解密、成就及小地图', estimateHours: 8, tag: '大图包', enabled: true },
    { id: 'hsr-pulls', game: '崩坏：星穹铁道', category: '玩法代肝', name: '星穹铁道地图抽数代刷', desc: '按抽数完成地图抽卡类收集内容。', price: '¥1.8 / 抽', priceNote: '低探1.8 / 中探2.5 / 高探3.2 每抽', includes: '指定地图抽数', estimateHours: 1, tag: '抽数', enabled: true },
    { id: 'hsr-single-map', game: '崩坏：星穹铁道', category: '地图探索', name: '星穹铁道小地图单独代肝（可多选）', desc: '不拍全图，直接在下单页勾选一个或多个小地图，按单项价格加购。', price: '按下方小地图加购计费', priceNote: '单项价格按价目表，支持多选累加', includes: '在下单页勾选单个小地图，可多选', estimateHours: 1, tag: '可多选', allowAddonPricing: true, enabled: true },
    { id: 'idv-weekly', game: '第五人格', category: '周常任务', name: '第五人格周上限', desc: '完成每周上限任务。', price: '¥20 / 周', priceNote: '单周 1w ¥5；包月 ¥80', includes: '每周上限任务', estimateHours: 2, tag: '周常', enabled: true },
    { id: 'idv-weekly-month', game: '第五人格', category: '周常任务', name: '第五人格周上限包月', desc: '整月周上限任务打包。', price: '¥80 / 月', priceNote: '按月计费', includes: '整月周上限任务', estimateHours: 8, tag: '包月', enabled: true },
    { id: 'idv-checkin', game: '第五人格', category: '日常委托', name: '第五人格每日签到', desc: '按周完成每日签到。', price: '¥3.5 / 周', priceNote: '按周计费', includes: '每日签到', estimateHours: 0.5, tag: '日常', enabled: true },
    { id: 'idv-first-win', game: '第五人格', category: '日常委托', name: '第五人格每日首胜', desc: '完成当日首胜任务。', price: '¥2 / 天', priceNote: '按天计费', includes: '每日首胜', estimateHours: 0.3, tag: '日常', enabled: true },
    { id: 'idv-rank-low', game: '第五人格', category: '日常委托', name: '第五人格排位低保', desc: '完成每日排位低保。', price: '¥2 / 天', priceNote: '按天计费', includes: '排位低保', estimateHours: 0.5, tag: '日常', enabled: true },
    { id: 'idv-small-trust', game: '第五人格', category: '日常托管', name: '第五人格小托管（含日常）', desc: '基础托管套餐，已包含签到、周上限与排位低保。', price: '¥140 / 月', priceNote: '周付 ¥35 / 周', includes: '每日签到、周上限、排位低保', estimateHours: 3, tag: '含日常', enabled: true },
    { id: 'idv-big-trust', game: '第五人格', category: '日常托管', name: '第五人格大托管（含小托管）', desc: '完整托管套餐，包含小托管全部内容。', price: '¥170 / 月', priceNote: '周付 ¥45 / 周', includes: '小托管、五排低保、角色日、每日商城、协会事务', estimateHours: 5, tag: '全托', enabled: true },
    { id: 'idv-notes', game: '第五人格', category: '加页手记', name: '第五人格加页手记主线全包', desc: '按主线打包完成加页手记。', price: '¥35 起 / 全包', priceNote: '曙光症35 厄运一40 厄运二30；单任务 ¥1-6', includes: '对应主线全部任务', estimateHours: 6, tag: '全包', enabled: true },
    { id: 'idv-rank-sprint', game: '第五人格', category: '段位速刷', name: '第五人格段位速刷', desc: '按星级速刷段位。', price: '¥1-7 / 星', priceNote: '1阶4 2阶2 3阶3 4阶1 5阶6 6阶以上7', includes: '指定段位星级', estimateHours: 2, tag: '段位', enabled: true },
    { id: 'idv-relic', game: '第五人格', category: '加页手记', name: '第五人格遗迹积分代肝', desc: '按积分档位完成遗迹任务。', price: '¥6 / 100w', priceNote: '500w ¥30；1000w ¥55', includes: '指定遗迹积分档位', estimateHours: 2, tag: '积分', enabled: true },
    { id: 'idv-feather', game: '第五人格', category: '加页手记', name: '第五人格羽毛添页', desc: '按页完成羽毛添页内容。', price: '¥0.3 / 页', priceNote: '添页 ¥0.35 / 页', includes: '羽毛 / 添页指定页数', estimateHours: 0.5, tag: '添页', enabled: true }
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
    { id: 'gi-fontaine40', game: '原神', group: '枫丹', name: '枫丹 4.0', price: 150, hours: 6, note: '满探；全宝箱 ¥180' },
    { id: 'gi-fontaine41', game: '原神', group: '枫丹', name: '枫丹 4.1', price: 150, hours: 6, note: '满探；全宝箱 ¥180' },
    { id: 'gi-fontaine42', game: '原神', group: '枫丹', name: '枫丹 4.2', price: 100, hours: 4, note: '满探；全宝箱 ¥120' },
    { id: 'gi-fontaine43', game: '原神', group: '枫丹', name: '枫丹 4.3', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-natlan50', game: '原神', group: '纳塔', name: '纳塔 5.0', price: 150, hours: 6, note: '满探；全宝箱 ¥180' },
    { id: 'gi-natlan52', game: '原神', group: '纳塔', name: '纳塔 5.2', price: 100, hours: 4, note: '满探；全宝箱 ¥120' },
    { id: 'gi-natlan55', game: '原神', group: '纳塔', name: '纳塔 5.5', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-natlan58', game: '原神', group: '纳塔', name: '纳塔 5.8', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-nodkrai60', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.0', price: 130, hours: 5, note: '满探；全宝箱 ¥150' },
    { id: 'gi-nodkrai61', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.1', price: 120, hours: 5, note: '满探；全宝箱 ¥140' },
    { id: 'gi-nodkrai62', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.2', price: 100, hours: 4, note: '满探；全宝箱 ¥120' },
    { id: 'gi-nodkrai63', game: '原神', group: '挪德卡莱', name: '挪德卡莱 6.3', price: 90, hours: 4, note: '满探；全宝箱 ¥100' },
    { id: 'gi-snezhnaya70', game: '原神', group: '至冬', name: '至冬 7.0', price: 200, hours: 8, note: '满探；全宝箱 ¥230' },
    { id: 'gi-snezhnaya71', game: '原神', group: '至冬', name: '至冬 7.1', price: 160, hours: 6, note: '满探；全宝箱 ¥200' },
    { id: 'gi-snezhnaya72', game: '原神', group: '至冬', name: '至冬 7.2', price: 140, hours: 6, note: '满探' },
    { id: 'hsr-space', game: '崩坏：星穹铁道', group: '空间站', name: '空间站「黑塔」全收集', price: 15, hours: 2, note: '宝箱、解密、成就' },
    { id: 'hsr-belobog', game: '崩坏：星穹铁道', group: '雅利洛VI', name: '雅利洛VI 全收集', price: 30, hours: 3, note: '宝箱、解密、成就' },
    { id: 'hsr-xianzhou', game: '崩坏：星穹铁道', group: '仙舟罗浮', name: '仙舟「罗浮」全收集', price: 120, hours: 6, note: '宝箱、解密、成就' },
    { id: 'hsr-penacony-chest', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '匹诺康尼 全宝箱', price: 100, hours: 6, note: '单项加购' },
    { id: 'hsr-penacony-bird', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '匹诺康尼 折纸小鸟', price: 30, hours: 2, note: '单项加购' },
    { id: 'hsr-penacony-full', game: '崩坏：星穹铁道', group: '匹诺康尼', name: '匹诺康尼 大地图全收集', price: 420, hours: 16, note: '含全宝箱、折纸小鸟、解密、成就' },
    { id: 'hsr-amphoreus-chest', game: '崩坏：星穹铁道', group: '翁法罗斯', name: '翁法罗斯 全宝箱', price: 160, hours: 8, note: '单项加购' },
    { id: 'hsr-amphoreus-cangming', game: '崩坏：星穹铁道', group: '翁法罗斯', name: '翁法罗斯 苍冥', price: 40, hours: 2, note: '单项加购' },
    { id: 'hsr-amphoreus-sheep', game: '崩坏：星穹铁道', group: '翁法罗斯', name: '翁法罗斯 羊头', price: 15, hours: 1, note: '单项加购' },
    { id: 'hsr-amphoreus-full', game: '崩坏：星穹铁道', group: '翁法罗斯', name: '翁法罗斯 大地图全收集', price: 190, hours: 10, note: '含全宝箱、苍冥、羊头' },
    { id: 'hsr-twoworld', game: '崩坏：星穹铁道', group: '二相乐园', name: '二相乐园 全收集', price: 150, hours: 7, note: '宝箱、解密、成就' },
    { id: 'hsr-thousand', game: '崩坏：星穹铁道', group: '千星乐园', name: '千星乐园 全收集', price: 85, hours: 5, note: '宝箱、解密、成就' }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  let state = loadState();
  let unlocked = false;
  let editingServiceId = null;
  let hallFilter = '全部';
  let boardFilter = '全部';
  let selectedAddons = new Set();
  let toastTimer = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function defaultState() {
    return {
      settings: clone(DEFAULT_SETTINGS),
      services: clone(DEFAULT_SERVICES),
      orders: []
    };
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
      const customServices = Array.isArray(parsed.services)
        ? parsed.services.filter((service) => String(service.id || '').startsWith('svc-'))
        : [];
      const services = [...base.services, ...customServices];
      return {
        settings,
        services,
        orders: Array.isArray(parsed.orders) ? parsed.orders : []
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

  function switchView(view) {
    $$('.nav-btn').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
    $$('.view').forEach((section) => section.classList.toggle('active', section.id === `view-${view}`));
    if (view === 'board') renderBoard();
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
    $('#paymentInfo').textContent = state.settings.payment || DEFAULT_SETTINGS.payment;
    updateServicePreview();
  }

  function getSelectedAddonDetails() {
    return MAP_ADDONS.filter((addon) => selectedAddons.has(addon.id));
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

    const options = MAP_ADDONS.filter((addon) => addon.game === game);
    selectedAddons = new Set([...selectedAddons].filter((id) => options.some((addon) => addon.id === id)));

    if (!options.length) {
      section.hidden = true;
      updateAddonTotal();
      return;
    }

    section.hidden = false;
    const groups = Array.from(new Set(options.map((addon) => addon.group)));
    list.innerHTML = groups.map((group) => `
      <div class="addon-group">
        <h4>${esc(group)}</h4>
        <div class="addon-grid">
          ${options.filter((addon) => addon.group === group).map((addon) => `
            <label class="addon-item">
              <input type="checkbox" data-addon-id="${esc(addon.id)}" ${selectedAddons.has(addon.id) ? 'checked' : ''} />
              <span class="addon-name">${esc(addon.name)}</span>
              <span class="addon-price">¥${addon.price}</span>
              <span class="addon-note">${esc(addon.note)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
    updateAddonTotal();
  }

  function updateServicePreview() {
    const service = getService($('#serviceSelect').value);
    const preview = $('#servicePreview');
    const summary = $('#orderSummary');

    if (!service) {
      preview.textContent = '当前没有可下单的服务，请先在管理模式中创建。';
      summary.innerHTML = '<h3>当前选择</h3><p class="muted">尚未选择服务</p>';
      renderAddons('');
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
      <div id="summaryAddons"></div>
      <div class="summary-row"><span>预计耗时</span><strong>${Number(service.estimateHours) || 1} 小时</strong></div>
    `;
    renderAddons(service.game);
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
            ${order.addons?.length ? `<div class="info-item"><span>加购小地图</span><strong>${order.addons.map((addon) => esc(addon.name)).join('、')}</strong></div><div class="info-item"><span>加购合计</span><strong>¥${order.addonTotal}</strong></div>` : ''}
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
    settingsForm.elements.password.value = state.settings.password;

    $('#serviceCount').textContent = `共 ${state.services.length} 项`;
    $('#serviceAdminList').innerHTML = state.services.length ? state.services.map((service) => {
      const price = formatPrice(service.price);
      return `
        <div class="admin-item ${service.enabled === false ? 'disabled' : ''}">
          <div class="admin-item-head">
            <div>
              <strong>${esc(service.name)}</strong>
              <div class="admin-meta">${esc(service.game)} / ${esc(service.category || '其他')} · ${esc(price.text)}${service.priceNote ? `（${esc(service.priceNote)}）` : ''}${service.includes ? ` · 含：${esc(service.includes)}` : ''} · ${Number(service.estimateHours) || 1} 小时${service.allowAddonPricing ? ' · 按加购计费' : ''}${service.enabled === false ? ' · 已隐藏' : ''}</div>
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
  }

  function renderAll() {
    renderHall();
    renderOrderForm();
    renderBoard();
    renderAdmin();
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

    const addonDetails = getSelectedAddonDetails();
    const addonTotal = addonDetails.reduce((sum, addon) => sum + addon.price, 0);
    const addonHours = addonDetails.reduce((sum, addon) => sum + addon.hours, 0);
    if (service.allowAddonPricing && !addonDetails.length) {
      showToast('请至少勾选一个小地图', 'error');
      return;
    }

    const finalPrice = service.allowAddonPricing ? `¥${addonTotal}` : service.price;
    const priceNoteParts = [service.priceNote];
    if (addonDetails.length) priceNoteParts.push(`另加购小地图 ¥${addonTotal}`);
    const includesParts = [service.includes];
    if (addonDetails.length) includesParts.push(addonDetails.map((addon) => addon.name).join('、'));

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
      addons: addonDetails.map((addon) => ({ id: addon.id, name: addon.name, price: addon.price, note: addon.note })),
      addonTotal,
      estimateHours: (Number(service.estimateHours) || 1) + addonHours,
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
      ${order.addons?.length ? `<div class="summary-row"><span>加购小地图</span><strong>${order.addons.map((addon) => esc(addon.name)).join('、')}</strong></div><div class="summary-row"><span>加购合计</span><strong class="summary-price">¥${order.addonTotal}</strong></div>` : ''}
      <p class="muted">已按下单时间进入队列，预计开工：${esc(order.estimateStart ? formatDateTime(order.estimateStart) : '待排')}</p>
    `;
    form.reset();
    selectedAddons.clear();
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
      `加购小地图：${order.addons?.length ? order.addons.map((addon) => `${addon.name} ¥${addon.price}`).join('、') : '-'}`,
      `加购合计：¥${order.addonTotal || 0}`,
      `顾客：${order.customerName}`,
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
      allowAddonPricing: data.has('allowAddonPricing')
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
          orders: parsed.orders
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
    $('#addonList').addEventListener('change', (event) => {
      const input = event.target.closest('input[data-addon-id]');
      if (!input) return;
      if (input.checked) selectedAddons.add(input.dataset.addonId);
      else selectedAddons.delete(input.dataset.addonId);
      updateAddonTotal();
    });
    $('#orderForm').addEventListener('submit', submitOrder);
    $('#settingsForm').addEventListener('submit', saveSettings);
    $('#serviceForm').addEventListener('submit', saveService);
    $('#cancelEditService').addEventListener('click', resetServiceForm);
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
