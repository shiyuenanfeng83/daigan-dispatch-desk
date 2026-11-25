(() => {
  'use strict';

  const STORAGE_KEY = 'daigan-dispatch-desk-v1';

  const DEFAULT_SETTINGS = {
    title: '课余代肝 · 接单大厅',
    intro: '利用课余时间接单，主要覆盖原神、崩坏：星穹铁道的剧情推进、地图资源收集与每日委托，以及第五人格的日常活跃与加页手记。下单后按提交时间进入队列，进度可在排单看板查看。',
    notice: '所有服务已标注公开参考价，计费单位写在价格旁，可在管理模式中自行修改。请下单前确认游戏账号可正常登录，付款方式以双方沟通为准。当前为静态演示版：订单只保存在你自己的浏览器里，店主暂时无法收到，请勿填写真实账号密码。',
    payment: '下单后请通过你填写的联系方式与我确认具体付款方式；建议先确认账号与需求，再完成付款。注意：静态版订单不会发送给店主，仅供本地演示。',
    hoursPerDay: 6,
    workStart: '19:00',
    password: '123456'
  };

  const DEFAULT_SERVICES = [
    { id: 'genshin-story', game: '原神', category: '剧情任务', name: '原神主线剧情推进', desc: '按章节推进主线剧情，含必要前置任务与过场流程。', price: '¥15 / 章', priceNote: '按章节计费，不含额外材料', estimateHours: 3, tag: '剧情', enabled: true },
    { id: 'genshin-legend', game: '原神', category: '剧情任务', name: '传说 / 角色任务代肝', desc: '完成角色传说任务、邀约事件等剧情内容，可按角色指定。', price: '¥10 / 个', priceNote: '按单个任务计费', estimateHours: 2, tag: '剧情', enabled: true },
    { id: 'genshin-world', game: '原神', category: '剧情任务', name: '世界任务清空', desc: '按区域清理世界任务与隐藏任务，适合探索度补完。', price: '¥20 / 区域', priceNote: '按区域计费', estimateHours: 4, tag: '探索', enabled: true },
    { id: 'genshin-oculus', game: '原神', category: '地图资源', name: '地图资源收集 · 神瞳', desc: '按区域收集风神瞳、岩神瞳、草神瞳等，记录收集进度。', price: '¥20 / 区域', priceNote: '按区域计费', estimateHours: 4, tag: '收集', enabled: true },
    { id: 'genshin-chest', game: '原神', category: '地图资源', name: '地图资源收集 · 宝箱与矿石', desc: '按区域清理宝箱、矿物、特产与圣遗物狗粮点。', price: '¥25 / 区域', priceNote: '按区域计费', estimateHours: 5, tag: '收集', enabled: true },
    { id: 'genshin-daily', game: '原神', category: '每日委托', name: '原神每日委托代肝', desc: '完成每日四个委托与相关奖励，可按天或包周下单。', price: '¥3 / 天', priceNote: '按天计费，包周可优惠', estimateHours: 0.5, tag: '可包周', enabled: true },
    { id: 'hsr-story', game: '崩坏：星穹铁道', category: '剧情任务', name: '星穹铁道主线 / 同行任务', desc: '推进开拓任务、同行任务与角色剧情，可按章节指定。', price: '¥15 / 章', priceNote: '按章节计费', estimateHours: 3, tag: '剧情', enabled: true },
    { id: 'hsr-map', game: '崩坏：星穹铁道', category: '地图资源', name: '星穹铁道地图宝箱收集', desc: '按星球/区域清理宝箱、折纸小鸟、魔方与可交互收集物。', price: '¥25 / 星球', priceNote: '按星球区域计费', estimateHours: 4, tag: '收集', enabled: true },
    { id: 'hsr-daily', game: '崩坏：星穹铁道', category: '每日委托', name: '星穹铁道每日委托代肝', desc: '完成每日实训、委托与活跃度奖励，可按天或包周下单。', price: '¥3 / 天', priceNote: '按天计费，包周可优惠', estimateHours: 0.5, tag: '可包周', enabled: true },
    { id: 'hsr-sim', game: '崩坏：星穹铁道', category: '玩法代肝', name: '模拟宇宙 / 差分宇宙代肝', desc: '按次数完成模拟宇宙或差分宇宙，含奖励领取。', price: '¥10 / 次', priceNote: '按次计费', estimateHours: 2, tag: '玩法', enabled: true },
    { id: 'idv-daily', game: '第五人格', category: '日常活跃', name: '第五人格日常活跃代肝', desc: '清理每日任务、周推理之径与活跃奖励，可按天或包周下单。', price: '¥3 / 天', priceNote: '按天计费，包周可优惠', estimateHours: 0.5, tag: '可包周', enabled: true },
    { id: 'idv-notes', game: '第五人格', category: '手记代肝', name: '加页手记代肝', desc: '按页推进手记内容与相关任务，适合补页与赛季冲刺。', price: '¥12 / 页', priceNote: '按页计费', estimateHours: 2, tag: '手记', enabled: true },
    { id: 'idv-rank', game: '第五人格', category: '日常活跃', name: '对战 / 排位活跃代肝', desc: '完成指定场次的匹配或排位，保持角色活跃度。', price: '¥8 / 10场', priceNote: '按 10 场计费', estimateHours: 1, tag: '对战', enabled: true }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  let state = loadState();
  let unlocked = false;
  let editingServiceId = null;
  let hallFilter = '全部';
  let boardFilter = '全部';
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
      const services = Array.isArray(parsed.services)
        ? parsed.services.map((service) => {
            const preset = base.services.find((item) => item.id === service.id);
            const price = String(service.price || '').trim() ? service.price : (preset?.price || '');
            const priceNote = String(service.priceNote || '').trim() ? service.priceNote : (preset?.priceNote || '');
            return { ...service, price, priceNote };
          })
        : base.services;
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
      const text = `${service.name} ${service.desc} ${service.category} ${service.tag} ${service.price || ''} ${service.priceNote || ''}`.toLowerCase();
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

  function updateServicePreview() {
    const service = getService($('#serviceSelect').value);
    const preview = $('#servicePreview');
    const summary = $('#orderSummary');

    if (!service) {
      preview.textContent = '当前没有可下单的服务，请先在管理模式中创建。';
      summary.innerHTML = '<h3>当前选择</h3><p class="muted">尚未选择服务</p>';
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
      <div class="summary-row"><span>预计耗时</span><strong>${Number(service.estimateHours) || 1} 小时</strong></div>
    `;
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
              <div class="admin-meta">${esc(service.game)} / ${esc(service.category || '其他')} · ${esc(price.text)}${service.priceNote ? `（${esc(service.priceNote)}）` : ''} · ${Number(service.estimateHours) || 1} 小时${service.enabled === false ? ' · 已隐藏' : ''}</div>
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

    const data = new FormData(form);
    const nextIndex = state.orders.reduce((max, order) => Math.max(max, Number(order.queueIndex ?? 0)), -1) + 1;
    const order = {
      id: makeId('order'),
      serviceId: service.id,
      serviceName: service.name,
      game: service.game,
      category: service.category,
      price: service.price,
      priceNote: service.priceNote || '',
      estimateHours: Number(service.estimateHours) || 1,
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
      <p class="muted">已按下单时间进入队列，预计开工：${esc(order.estimateStart ? formatDateTime(order.estimateStart) : '待排')}</p>
    `;
    form.reset();
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
      estimateHours: Math.max(0.5, Number(data.get('estimateHours')) || 1),
      tag: String(data.get('tag') || '').trim(),
      enabled: data.has('enabled')
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
    form.elements.estimateHours.value = service.estimateHours || 1;
    form.elements.tag.value = service.tag || '';
    form.elements.enabled.checked = service.enabled !== false;
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
