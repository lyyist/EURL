// 住宿甄选模块
import { HOTEL_COMFORT_DATA, HOTEL_LUXURY_DATA } from './data.js';
import { currentPlan } from './state.js';

export function renderHotels() {
  const container = document.getElementById('hotelContainer');
  if (!container) return;

  const data = currentPlan === 'comfort' ? HOTEL_COMFORT_DATA : HOTEL_LUXURY_DATA;
  
  // 更新住宿方案标签
  const hotelLabel = document.getElementById('hotelPlanLabel');
  if (hotelLabel) {
    if (currentPlan === 'comfort') {
      hotelLabel.textContent = '🌿 舒适型方案 — 精品民宿+高性价比选择';
      hotelLabel.style.color = 'var(--primary)';
    } else {
      hotelLabel.textContent = '👑 豪华型方案 — 度假村酒店+顶级体验';
      hotelLabel.style.color = 'var(--accent)';
    }
  }

  container.innerHTML = data.map((h, i) => `
    <div class="hotel-card fade-up" style="animation-delay:${i * 0.08}s">
      <!-- 头部：Day + 地点 + 评分 -->
      <div class="hotel-header">
        <div class="hotel-day-badge">Day ${h.day}</div>
        <div class="hotel-location">
          <i class="fa-solid fa-location-dot" style="color:var(--accent);font-size:12px"></i>
          ${h.location}
        </div>
        <div class="hotel-price">${h.priceRange}</div>
      </div>

      <!-- 酒店名 + 图片 -->
      <div class="hotel-body">
        <div class="hotel-img-wrap">
          <img src="${h.image}" alt="${h.hotel}" loading="lazy" onerror="this.style.opacity='0'">
          <div class="hotel-img-overlay">
            <span class="font-serif font-bold text-lg" style="color:var(--accent);text-shadow:0 2px 8px rgba(0,0,0,0.5)">${h.hotel}</span>
          </div>
        </div>

        <!-- 四维评分 -->
        <div class="hotel-scores">
          <div class="score-item">
            <div class="score-label">🧹 卫生</div>
            <div class="score-bar"><div class="score-fill" style="width:${h.scores.health * 20}%"></div></div>
            <div class="score-val">${h.scores.health}</div>
          </div>
          <div class="score-item">
            <div class="score-label">🤝 服务</div>
            <div class="score-bar"><div class="score-fill" style="width:${h.scores.service * 20}%"></div></div>
            <div class="score-val">${h.scores.service}</div>
          </div>
          <div class="score-item">
            <div class="score-label">📍 便利</div>
            <div class="score-bar"><div class="score-fill" style="width:${h.scores.location * 20}%"></div></div>
            <div class="score-val">${h.scores.location}</div>
          </div>
          <div class="score-item">
            <div class="score-label">✨ 特色</div>
            <div class="score-bar"><div class="score-fill" style="width:${h.scores.special * 20}%"></div></div>
            <div class="score-val">${h.scores.special}</div>
          </div>
        </div>

        <!-- 选择理由 -->
        <div class="hotel-reason">
          <div class="hotel-reason-title">📋 选择理由</div>
          <p>${h.reason}</p>
        </div>

        <!-- 横向对比 -->
        <div class="hotel-compare">
          <div class="hotel-reason-title" style="color:var(--gray-500)">🔍 横向对比</div>
          <div class="hotel-vs-list">
            ${h.vs.map(v => `
              <div class="hotel-vs-item">
                <div class="hotel-vs-name">❌ ${v.name}</div>
                <div class="hotel-vs-issue">${v.issue}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // 绑定滚动动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}