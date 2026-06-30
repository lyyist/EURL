// 出行贴士模块
import { TIPS_DATA } from './data.js';
import { hkdCnyRate } from './state.js';

export function renderTips() {
  const container = document.getElementById('tipsContainer');
  if (!container) return;

  const rate = hkdCnyRate || 0.8626;
  const rateDisplay = (rate * 100).toFixed(2);

  container.innerHTML = TIPS_DATA.map(tip => {
    // 动态处理香港出发贴士中的汇率
    let items = tip.items;
    if (tip.icon === '✈️') {
      items = tip.items.map(item => {
        if (item.includes('港币兑换')) {
          return `港币兑换：招行实时中间价 100HKD=${rateDisplay}CNY（1港币≈${rate}元，精确到分）`;
        }
        return item;
      });
    }
    return `
    <div class="card p-6 fade-up">
      <div class="text-3xl mb-3">${tip.icon}</div>
      <h3 class="font-serif font-bold text-lg text-emerald-800 mb-3">${tip.title}</h3>
      <ul class="text-sm text-gray-600 space-y-2">
        ${items.map(item => `<li>${tip.icon === '✈️' ? '🔹' : tip.icon === '⚠️' ? '🔸' : '✅'} ${item}</li>`).join('')}
      </ul>
    </div>
  `;
  }).join('');

  // 绑定滚动动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}