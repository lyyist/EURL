// 租车方案模块
import { RENTCAR_DATA } from './data.js';
import { currentPlan } from './state.js';

export function renderRentCar() {
  const container = document.getElementById('rentcarContainer');
  if (!container) return;

  const isComfort = currentPlan === 'comfort';
  const car = isComfort ? RENTCAR_DATA.cars.comfort : RENTCAR_DATA.cars.luxury;

  // 更新方案标签
  const label = document.getElementById('rentcarPlanLabel');
  if (label) {
    if (isComfort) {
      label.textContent = '🌿 当前：舒适型方案 — 推荐 7 座别克 GL8 商务车';
      label.style.color = 'var(--primary)';
    } else {
      label.textContent = '👑 当前：豪华型方案 — 推荐丰田普拉多越野车';
      label.style.color = 'var(--accent)';
    }
  }

  container.innerHTML = `
    <!-- 一句话总览 -->
    <div class="rc-intro fade-up">
      <i class="fa-solid fa-circle-info"></i>
      <p>${RENTCAR_DATA.intro}</p>
    </div>

    <!-- 四步流程 -->
    <div class="rc-steps">
      ${RENTCAR_DATA.steps.map((s, i) => `
        <div class="rc-step-card fade-up" style="animation-delay:${i * 0.08}s">
          <div class="rc-step-top">
            <div class="rc-step-icon"><i class="fa-solid ${s.icon}"></i></div>
            <div class="rc-step-num">${s.step}</div>
          </div>
          <h4 class="rc-step-title">${s.title}</h4>
          <p class="rc-step-desc">${s.desc}</p>
          <ul class="rc-step-tips">
            ${s.tips.map(t => `<li><i class="fa-solid fa-check"></i> ${t}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <!-- 推荐车型（与方案联动） -->
    <div class="rc-car-card fade-up">
      <div class="rc-car-img" style="background-image:url('${car.image}')">
        <span class="rc-car-tag">${car.tag}</span>
      </div>
      <div class="rc-car-info">
        <div class="rc-car-head">
          <h3>${car.model}</h3>
          <div class="rc-car-price">
            <span class="rc-car-price-day">${car.pricePerDay}</span>
            <span class="rc-car-price-total">${car.totalPrice}</span>
          </div>
        </div>
        <div class="rc-car-specs">
          <span><i class="fa-solid fa-users"></i> ${car.seats}</span>
          <span><i class="fa-solid fa-suitcase-rolling"></i> ${car.trunk}</span>
        </div>
        <p class="rc-car-reason"><i class="fa-solid fa-quote-left"></i> ${car.reason}</p>
        <div class="rc-car-tags">
          ${car.pros.map(p => `<span class="rc-pro-tag">✅ ${p}</span>`).join('')}
        </div>
        <div class="rc-car-cons"><i class="fa-solid fa-triangle-exclamation"></i> ${car.cons}</div>
      </div>
    </div>

    <!-- 电车（新能源）对比方案 -->
    <div class="rc-ev fade-up">
      <div class="rc-ev-banner rc-ev-banner--plain">
        <div class="rc-ev-banner-mask">
          <span class="rc-ev-verdict">${RENTCAR_DATA.ev.verdict}</span>
          <h3>⚡ ${RENTCAR_DATA.ev.title}</h3>
          <p>${RENTCAR_DATA.ev.summary}</p>
        </div>
      </div>
      <div class="rc-ev-body">
        <!-- 电车车型（对比项） -->
        <div class="rc-ev-car">
          <div class="rc-ev-car-head">
            <span class="rc-car-tag">${RENTCAR_DATA.ev.car.tag}</span>
            <div class="rc-car-price">
              <span class="rc-car-price-day">${RENTCAR_DATA.ev.car.pricePerDay}</span>
              <span class="rc-car-price-total">${RENTCAR_DATA.ev.car.totalPrice}</span>
            </div>
          </div>
          <h4 class="rc-ev-car-model">${RENTCAR_DATA.ev.car.model}</h4>
          <div class="rc-car-specs">
            <span><i class="fa-solid fa-users"></i> ${RENTCAR_DATA.ev.car.seats}</span>
            <span><i class="fa-solid fa-battery-full"></i> ${RENTCAR_DATA.ev.car.range}</span>
          </div>
          <p class="rc-car-reason"><i class="fa-solid fa-quote-left"></i> ${RENTCAR_DATA.ev.car.reason}</p>
          <div class="rc-car-tags">
            ${RENTCAR_DATA.ev.car.pros.map(p => `<span class="rc-pro-tag">✅ ${p}</span>`).join('')}
          </div>
          <div class="rc-car-cons"><i class="fa-solid fa-triangle-exclamation"></i> ${RENTCAR_DATA.ev.car.cons}</div>
        </div>
        <!-- 充电要点四宫格 -->
        <div class="rc-ev-charging">
          ${RENTCAR_DATA.ev.charging.map(c => `
            <div class="rc-ev-charge-item">
              <div class="rc-ev-charge-icon"><i class="fa-solid ${c.icon}"></i></div>
              <div class="rc-ev-charge-text">
                <span class="rc-ev-charge-title">${c.title}</span>
                <span class="rc-ev-charge-desc">${c.desc}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- 推荐平台 -->
    <h3 class="rc-block-title"><i class="fa-solid fa-store"></i> 去哪儿租：推荐平台</h3>
    <div class="rc-platforms">
      ${RENTCAR_DATA.platforms.map(p => `
        <div class="rc-platform-card fade-up">
          <div class="rc-platform-head">
            <span class="rc-platform-name">${p.name}</span>
            <span class="rc-platform-badge">${p.badge}</span>
          </div>
          <p>${p.desc}</p>
        </div>
      `).join('')}
    </div>

    <!-- 费用 + 必买保险 双栏 -->
    <div class="rc-two-col">
      <div class="rc-panel fade-up">
        <h3 class="rc-block-title"><i class="fa-solid fa-wallet"></i> 费用与押金</h3>
        <ul class="rc-cost-list">
          <li><span class="rc-cost-key">🚗 车辆押金</span><span class="rc-cost-val">${RENTCAR_DATA.cost.deposit}</span></li>
          <li><span class="rc-cost-key">📋 违章押金</span><span class="rc-cost-val">${RENTCAR_DATA.cost.violation}</span></li>
          <li><span class="rc-cost-key">⛽ 油费预估</span><span class="rc-cost-val">${RENTCAR_DATA.cost.oil}</span></li>
          <li><span class="rc-cost-key">⚠️ 其它费用</span><span class="rc-cost-val">${RENTCAR_DATA.cost.extra}</span></li>
        </ul>
      </div>
      <div class="rc-panel fade-up">
        <h3 class="rc-block-title"><i class="fa-solid fa-shield-halved"></i> 保险这样买（照着勾）</h3>
        <ul class="rc-insurance-list">
          ${RENTCAR_DATA.insurance.map(ins => `
            <li>
              <span class="rc-ins-flag ${ins.must ? 'must' : 'opt'}">${ins.must ? '必买' : '可选'}</span>
              <div class="rc-ins-text">
                <span class="rc-ins-name">${ins.name}</span>
                <span class="rc-ins-desc">${ins.desc}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <!-- 30秒验车清单 + 避坑红黑榜 双栏 -->
    <div class="rc-two-col">
      <div class="rc-panel fade-up">
        <h3 class="rc-block-title"><i class="fa-solid fa-clipboard-check"></i> 提车 30 秒验车清单</h3>
        <ul class="rc-checklist">
          ${RENTCAR_DATA.checklist.map(c => `<li><i class="fa-regular fa-square-check"></i> ${c}</li>`).join('')}
        </ul>
      </div>
      <div class="rc-panel fade-up">
        <h3 class="rc-block-title"><i class="fa-solid fa-triangle-exclamation"></i> 避坑红黑榜</h3>
        <ul class="rc-pitfall-list">
          ${RENTCAR_DATA.pitfalls.map(p => `
            <li class="rc-pitfall ${p.type}">
              <i class="fa-solid ${p.type === 'avoid' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
              <span>${p.text}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;

  // 绑定滚动动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}
