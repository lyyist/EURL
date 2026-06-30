// 逐日行程卡片模块 - 图片蒙板布局 + 图集弹出
import { ITINERARY_DATA, TICKETS, BUDGET_DATA } from './data.js';
import { currentPlan } from './state.js';

let observer = null;
export function setObserver(obs) { observer = obs; }

function calcDayCost(d, plan) {
  const bd = plan === 'comfort' ? BUDGET_DATA.comfort : BUDGET_DATA.luxury;
  const hotelPerNight = Math.round(bd.hotel.pricePerRoom / 7);
  const foodPerDay = plan === 'comfort' ? 120 : 200;
  const rentPerDay = Math.round(bd.rentCar.price / 4 / 8);
  const oilPerDay = Math.round(bd.oil.price / 4 / 8);
  const tollPerDay = Math.round(bd.highway.price / 4 / 8);
  const ticketDay = d.ticketsPrice || 0;
  const dayTotal = Math.round(hotelPerNight/2) + foodPerDay + rentPerDay + oilPerDay + tollPerDay + ticketDay;
  return {
    hotel: Math.round(hotelPerNight/2),
    food: foodPerDay,
    rent: rentPerDay,
    oil: oilPerDay,
    toll: tollPerDay,
    ticket: ticketDay,
    total: dayTotal,
  };
}

function getAltitudeFeeling(alt) {
  if (alt < 1000) return '温暖舒适，正常着装';
  if (alt < 1800) return '凉爽宜人，备薄外套';
  if (alt < 2300) return '昼夜温差大，带冲锋衣';
  if (alt < 2600) return '高原微凉，羽绒服必备';
  return '高原寒冷，注意保暖防高反';
}

export function renderItinerary() {
  const container = document.getElementById('itineraryContainer');
  if (!container) return;

  const isComfort = currentPlan === 'comfort';

  container.innerHTML = ITINERARY_DATA.map((d, i) => {
    const cost = calcDayCost(d, currentPlan);
    const ticketLabel = d.tickets || '免费';
    const galleryImgs = (d.gallery && d.gallery.length >= 3) ? d.gallery : [d.image, d.image, d.image];

    return `
    <div class="day-card fade-up" style="animation-delay:${i * 0.08}s">
      <!-- 图片蒙板背景 -->
      <div class="day-card-bg" style="background-image:url('${d.image}')"></div>
      <!-- 内容覆盖层 -->
      <div class="day-card-content">
        <div class="flex items-start justify-between flex-wrap gap-3">
          <h3>Day ${d.day}：${d.title}</h3>
          <span class="playtime-badge">🕐 ${d.playTime}</span>
        </div>
        <p class="desc mt-3">${d.desc}</p>
        <div class="flex flex-wrap gap-1.5 mt-3">
          ${d.highlight.split('|').map(h => `<span class="highlight-tag">✨ ${h.trim()}</span>`).join('')}
        </div>
        <div class="info-row mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <span><i class="fa-solid fa-car-side"></i> ${d.drive || '伊宁市区游玩'}</span>
          <span><i class="fa-solid fa-hotel"></i> ${isComfort ? d.comfortHotel : d.luxuryHotel}</span>
          <span><i class="fa-solid fa-camera"></i> 最佳拍照：${d.photoTime || '全天'}</span>
        </div>
        <div class="flex flex-wrap gap-4 mt-3" style="font-size:12px;color:rgba(255,255,255,0.72)">
          <span><i class="fa-solid fa-mountain" style="color:var(--accent);margin-right:3px"></i>海拔 ${d.altitude}m</span>
          <span><i class="fa-solid fa-temperature-half" style="color:var(--accent);margin-right:3px"></i>${d.temperature}</span>
          <span>🧥 体感：${getAltitudeFeeling(d.altitude)}</span>
        </div>

        <!-- 费用条 -->
        <div class="day-cost-bar">
          <div class="cost-item"><div class="label">🏨 住宿</div><div class="value">¥${cost.hotel}</div></div>
          <div class="cost-item"><div class="label">🍜 餐饮</div><div class="value">¥${cost.food}</div></div>
          <div class="cost-item"><div class="label">🎫 门票</div><div class="value">¥${cost.ticket}</div></div>
          <div class="cost-item"><div class="label">🚗 租车</div><div class="value">¥${cost.rent}</div></div>
          <div class="cost-item"><div class="label">⛽ 油路</div><div class="value">¥${cost.oil + cost.toll}</div></div>
          <div class="cost-total">
            <span class="label" style="color:rgba(255,255,255,0.7)">💎 人均</span>
            <span class="value">¥${cost.total}</span>
          </div>
        </div>
        <div style="color:rgba(255,255,255,0.5);font-size:10px;margin-top:4px;">门票：${ticketLabel}</div>

        <!-- 查看图集按钮 -->
        <button class="gallery-btn" data-gallery='${JSON.stringify(galleryImgs)}' data-day="${d.day}" data-title="${d.title}">
          <i class="fa-solid fa-images mr-1.5"></i>查看图集（3张）
        </button>
      </div>
    </div>
  `;
  }).join('');

  // 绑定图集按钮事件
  container.querySelectorAll('.gallery-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const gallery = JSON.parse(btn.dataset.gallery);
      const day = btn.dataset.day;
      const title = btn.dataset.title;
      showGalleryModal(gallery, day, title);
    });
  });

  if (observer) {
    container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }
}

// 图集弹出浮层
function showGalleryModal(images, day, title) {
  // 移除已有弹层
  const existing = document.querySelector('.gallery-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.innerHTML = `
    <div class="gallery-panel">
      <div class="gallery-header">
        <span class="gallery-title">Day ${day}：${title}</span>
        <button class="gallery-close"><i class="fa-solid fa-xmark text-xl"></i></button>
      </div>
      <div class="gallery-grid">
        ${images.map((url, idx) => `
          <div class="gallery-item gallery-fade-in" style="animation-delay:${idx * 0.12}s">
            <img src="${url}" alt="Day ${day} 照片${idx+1}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect fill=%22%23e5e7eb%22 width=%22300%22 height=%22200%22/><text fill=%22%239ca3af%22 x=%22150%22 y=%22110%22 text-anchor=%22middle%22 font-size=%2214%22>图片加载失败</text></svg>'">
          </div>
        `).join('')}
      </div>
      <div class="gallery-nav">
        <span class="text-xs text-white/50">← 左右滑动或点击按钮切换 →</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 关闭事件
  const closeBtn = overlay.querySelector('.gallery-close');
  closeBtn.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // ESC 关闭
  const escHandler = (e) => {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  // 渐入动画
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    overlay.querySelectorAll('.gallery-item').forEach(el => el.classList.add('visible'));
  });
}

// 门票明细网格（行程区底部）
export function renderTicketGridInItinerary() {
  const container = document.getElementById('ticketGridInline');
  if (!container) return;
  container.innerHTML = `
    <h3 class="font-serif font-bold text-lg mb-4" style="color:var(--primary)"><i class="fa-solid fa-ticket mr-2"></i>各景点门票明细</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      ${TICKETS.map(t => `
        <div class="rounded-lg p-3" style="background:var(--gray-50)">
          <span class="font-semibold">${t.name}</span><br>
          <span style="color:var(--gray-500)">${t.price}</span>
        </div>
      `).join('')}
    </div>
  `;
}