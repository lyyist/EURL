// 费用预算对比区模块 - 卡片内置选择按钮
import { BUDGET_DATA, FLIGHT_DATA } from './data.js';
import { currentPlan } from './state.js';

export function renderBudget() {
  renderBudgetComparison();
  renderFlightCards();
}

function renderFlightCards() {
  const container = document.getElementById('flightCards');
  if (!container) return;

  container.innerHTML = `
    <h3 class="font-serif font-bold text-lg mb-4" style="color:var(--primary)"><i class="fa-solid fa-plane mr-2"></i>大交通：三地直飞伊宁（往返）· 8月1日出发 · 无需中转</h3>
    <div class="grid md:grid-cols-3 gap-4">
      ${FLIGHT_DATA.map(f => {
        if (f.isSpecial) {
          // 深圳特殊卡片：动态汇率
          return `
            <div class="rounded-xl p-4 border" style="background:#f0fdf4;border-color:#bbf7d0">
              <div class="font-bold mb-2" style="color:var(--primary)">📍 ${f.city}出发 <span class="flight-badge flight-badge-special">含里程票+香港备选</span></div>
              ${f.options.map((opt, oi) => `
                  <div class="${oi > 0 ? 'mt-3 pt-3 border-t' : ''}" style="border-color:#bbf7d0">
                    <div class="text-xs font-semibold mb-1" style="color:var(--primary)">${opt.label}</div>
                    <div class="text-xs" style="color:var(--gray-600)">${opt.route}</div>
                    <div class="font-bold mt-1 text-sm" style="color:var(--primary)">${opt.price}</div>
                    ${opt.mileBadge ? '<span class="flight-badge flight-badge-special mt-1">⭐ 凤凰知音里程可兑换</span>' : ''}
                    <div class="text-xs mt-0.5" style="color:var(--gray-400)">${opt.detail}</div>
                  </div>
                `).join('')}
            </div>
          `;
        }
        return `
          <div class="rounded-xl p-4 text-center" style="background:#f0fdf4;border:1px solid #bbf7d0">
            <div class="font-bold mb-1" style="color:var(--primary)">📍 ${f.city}出发</div>
            <div class="text-sm" style="color:var(--gray-600)">${f.route}</div>
            <div class="font-bold mt-2 text-lg" style="color:var(--primary)">${f.price}</div>
            <div class="text-xs" style="color:var(--gray-400)">${f.detail}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderBudgetComparison() {
  const container = document.getElementById('budgetComparison');
  if (!container) return;

  const plans = [
    { key: 'comfort', data: BUDGET_DATA.comfort, activeClass: 'active', textColor: '#1b4332', bgColor: '#f0fdf4', btnText: '🌿 选择舒适型方案', btnBg: 'var(--primary)', btnHover: '#143728' },
    { key: 'luxury', data: BUDGET_DATA.luxury, activeClass: 'lux-active', textColor: '#d4a574', bgColor: '#fffbeb', btnText: '👑 选择豪华型方案', btnBg: 'var(--accent)', btnHover: '#c0925e' },
  ];

  container.innerHTML = plans.map(p => {
    const d = p.data;
    const isActive = p.key === currentPlan;
    const avgFlight = 4000;
    const totalPerPerson = Math.round(
      avgFlight + d.rentCar.price / 4 + d.oil.price / 4 + d.highway.price / 4 + d.hotel.pricePerPerson + d.food.price + d.tickets.price
    );

    return `
      <div id="${p.key}Card" class="budget-card ${isActive ? p.activeClass : ''} card p-6 relative" style="cursor:pointer" onclick="window.selectPlan('${p.key}')">
        <div class="absolute top-4 right-4"><span class="plan-badge">${d.label}</span></div>
        <h3 class="font-serif font-bold text-xl mb-5" style="color:${p.textColor}">${d.icon} ${d.label}方案</h3>
        <table class="w-full text-sm">
          <tbody>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">🚗 租车（8天）</td>
              <td class="py-2.5 font-semibold text-right">${d.rentCar.model}</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">¥${d.rentCar.price.toLocaleString()}</td>
            </tr>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">⛽ 油费</td>
              <td class="py-2.5 font-semibold text-right">${d.oil.desc}</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">¥${d.oil.price.toLocaleString()}</td>
            </tr>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">🛣️ 高速费</td>
              <td class="py-2.5 font-semibold text-right">${d.highway.desc}</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">¥${d.highway.price.toLocaleString()}</td>
            </tr>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">🏨 住宿（7晚/间）</td>
              <td class="py-2.5 font-semibold text-right">${d.hotel.desc}</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">¥${d.hotel.pricePerRoom.toLocaleString()}</td>
            </tr>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">🍜 餐饮（8天/人）</td>
              <td class="py-2.5 font-semibold text-right">${d.food.desc}</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">¥${d.food.price.toLocaleString()}</td>
            </tr>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">✈️ 大交通（往返/人）</td>
              <td class="py-2.5 font-semibold text-right">三地直飞均价</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">~¥${avgFlight.toLocaleString()}</td>
            </tr>
            <tr class="border-b" style="border-color:var(--gray-100)">
              <td class="py-2.5" style="color:var(--gray-500)">🎫 门票（/人）</td>
              <td class="py-2.5 font-semibold text-right">${d.tickets.desc}</td>
              <td class="py-2.5 font-bold text-right" style="color:${p.textColor}">¥${d.tickets.price.toLocaleString()}</td>
            </tr>
            <tr><td colspan="3" class="pt-3"></td></tr>
            <tr style="background:${p.bgColor}">
              <td class="py-3 px-2 rounded-l-lg font-bold" style="color:${p.textColor}">💰 人均总费用</td>
              <td class="py-3 text-xs text-right" style="color:var(--gray-400)">按4人出行计算</td>
              <td class="py-3 px-2 rounded-r-lg font-black text-xl text-right" style="color:${p.textColor}">~¥${totalPerPerson.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 text-xs" style="color:var(--gray-400)">
          * 按4人出行计算：住宿2人/间×7晚，租车/油费/高速人均分摊
        </div>
        <!-- 状态条：点击卡片任意位置即可选中方案 -->
        <div class="budget-select-bar ${isActive ? 'selected' : ''}" style="background:${isActive ? p.btnBg : p.bgColor};color:${isActive ? '#fff' : p.textColor};border:2px solid ${p.textColor}">
          ${isActive ? '✅ 当前方案' : '👆 点击卡片选择此方案'}
        </div>
      </div>
    `;
  }).join('');
}