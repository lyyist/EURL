// Hero 视觉冲击区模块
import { weatherData } from './state.js';

export function renderHero() {
  const hero = document.getElementById('hero');
  const weatherInfo = weatherData 
    ? `${weatherData.weather} ${weatherData.temp} / ${weatherData.humidity}`
    : '多云 32°C / 湿度: 30%';

  hero.innerHTML = `
    <div class="relative z-10 text-center px-4 max-w-4xl">
      <div class="fade-up" style="transition-delay:0.1s">
        <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/20">
          <i class="fa-solid fa-location-dot text-amber-300"></i>
          <span class="text-white/90 text-sm">新疆 · 伊犁哈萨克自治州</span>
        </div>
        <h1 class="font-serif text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
          伊犁8日经典小环线
        </h1>
        <p class="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          伊宁起止 · 不走回头路 · 8月1日~8月9/10日<br>
          武汉 / 深圳 / 上海 直飞伊宁集结
        </p>
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <span class="tag"><i class="fa-solid fa-arrows-spin mr-1"></i> 不走回头路</span>
          <span class="tag"><i class="fa-solid fa-calendar-check mr-1"></i> 8月1日出发</span>
          <span class="tag"><i class="fa-solid fa-circle-dot mr-1"></i> 伊宁起止</span>
          <span class="tag"><i class="fa-solid fa-plane-departure mr-1"></i> 三地直飞伊宁</span>
        </div>
        <!-- Weather -->
        <div class="inline-flex items-center gap-3 bg-white/12 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
          <i class="fa-solid fa-cloud-sun text-xl" style="color:var(--accent)"></i>
          <div class="text-left">
            <div class="text-white/90 text-sm">伊犁 · 实时天气（腾讯地图数据）</div>
            <div class="text-white font-semibold">${weatherInfo}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <a href="#overview" class="text-white/60 hover:text-white/90 transition-colors text-2xl"><i class="fa-solid fa-chevron-down"></i></a>
    </div>
  `;
}