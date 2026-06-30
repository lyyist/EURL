// 全局共享状态（独立模块，避免循环依赖）
export let currentPlan = 'comfort';
export let weatherData = null;
export let hkdCnyRate = null;

export function setCurrentPlan(plan) {
  currentPlan = plan;
}

export function setWeatherData(data) {
  weatherData = data;
}

export function setHkdCnyRate(rate) {
  hkdCnyRate = rate;
}
