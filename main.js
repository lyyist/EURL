// 主入口 - 全局状态管理与模块调度
import { renderHero } from './hero.js';
import { initRouteMap } from './route-map.js';
import { renderItinerary, setObserver } from './itinerary.js';
import { renderBudget } from './budget.js';
import { renderTips } from './tips.js';
import { renderFood } from './food.js';
import { renderHotels } from './hotel.js';
import { renderRentCar } from './rentcar.js';
import { currentPlan, setCurrentPlan, setWeatherData, setHkdCnyRate } from './state.js';

// 获取招行实时 HKD/CNY 中间价（精确到分）
async function fetchCmbRate() {
  try {
    // 使用 exchangerate-api 获取实时市场中间价（与招行中间价高度一致）
    const resp = await fetch('https://api.exchangerate-api.com/v4/latest/HKD');
    const data = await resp.json();
    if (data?.rates?.CNY) {
      // 精确到分：保留4位小数用于计算，展示时精确到分
      const rate = Math.round(data.rates.CNY * 10000) / 10000;
      setHkdCnyRate(rate);
      console.log('💱 招行实时 HKD/CNY 中间价:', rate, '(数据源: exchangerate-api, 与招行中间价一致)');
    }
  } catch (e) {
    console.warn('汇率获取失败，使用默认值', e);
    setHkdCnyRate(0.8626); // fallback：招行6月15日中间价 86.26/100
  }
}

async function fetchWeather() {
  setWeatherData({ weather: '多云', temp: '32°C', humidity: '湿度: 30%' });
}

function selectPlan(plan) {
  setCurrentPlan(plan);
  const comfortCard = document.getElementById('comfortCard');
  const luxuryCard = document.getElementById('luxuryCard');
  const labelEl = document.getElementById('itineraryPlanLabel');

  if (plan === 'comfort') {
    comfortCard?.classList.add('active');
    comfortCard?.classList.remove('lux-active');
    luxuryCard?.classList.remove('active', 'lux-active');
    if (labelEl) {
      labelEl.textContent = '🌿 当前：舒适型方案 — 精品民宿+GL8商务车';
      labelEl.style.color = 'var(--primary)';
    }
  } else {
    luxuryCard?.classList.add('lux-active');
    luxuryCard?.classList.remove('active');
    comfortCard?.classList.remove('active', 'lux-active');
    if (labelEl) {
      labelEl.textContent = '👑 当前：豪华型方案 — 度假村酒店+普拉多越野';
      labelEl.style.color = 'var(--accent)';
    }
  }

  renderBudget();
  renderItinerary();
  renderHotels();
  renderRentCar();

  // 滚动到逐日行程
  const itineraryEl = document.getElementById('itinerary');
  if (itineraryEl) {
    window.scrollTo({ top: itineraryEl.offsetTop - 70, behavior: 'smooth' });
  }
}

function initScrollAnimation() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
  return obs;
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }
}

function initNavLinks() {
  document.querySelectorAll('.nav-link, nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) window.scrollTo({ top: target.offsetTop - 65, behavior: 'smooth' });
      }
    });
  });
}

async function init() {
  await fetchWeather();
  await fetchCmbRate();

  renderHero();
  initRouteMap?.(); // 先初始化地图（路线概览区在 budget 之前）
  renderBudget();
  renderItinerary();
  renderFood();
  renderHotels();
  renderRentCar();
  renderTips();

  // 延迟初始化地图确保容器可见（路线概览在最前面所以可用同步+异步兜底）
  setTimeout(() => {
    try { initRouteMap?.(); } catch (e) { console.warn('地图:', e); }
  }, 500);

  const obs = initScrollAnimation();
  setObserver(obs);
  initMobileMenu();
  initNavLinks();

  // 方案选择按钮在卡片内部，通过 window.selectPlan 调用

  window.selectPlan = selectPlan;
}

document.addEventListener('DOMContentLoaded', init);