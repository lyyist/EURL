// 伊犁美食模块
import { FOOD_DATA } from './data.js';

export function renderFood() {
  const container = document.getElementById('foodContainer');
  if (!container) return;

  container.innerHTML = FOOD_DATA.map((food, i) => `
    <div class="food-card fade-up" style="animation-delay:${i * 0.1}s">
      <div class="food-img-wrapper">
        <img src="${food.image}" alt="${food.name}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="food-info">
        <div class="flex items-center justify-between mb-2">
          <h3 class="food-name">${food.name}</h3>
          <span class="food-price">${food.price}</span>
        </div>
        <p class="food-highlight">🔥 ${food.highlight}</p>
        <p class="food-desc">${food.desc}</p>
        <div class="food-where">
          <i class="fa-solid fa-location-dot"></i> ${food.where}
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
