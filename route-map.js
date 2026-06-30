// 静态Canvas环线路网地图模块（无需外部API依赖）
import { POINTS, SEGMENTS } from './data.js';

// 将经纬度映射到Canvas坐标
function latLngToPixel(lat, lng, canvasW, canvasH, padding = 60) {
  const allLats = POINTS.map(p => p.lat);
  const allLngs = POINTS.map(p => p.lng);
  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const w = canvasW - padding * 2;
  const h = canvasH - padding * 2;

  const x = padding + ((lng - minLng) / lngRange) * w;
  const y = padding + ((maxLat - lat) / latRange) * h;
  return { x, y };
}

export function initRouteMap() {
  const container = document.getElementById('tencentMap');
  if (!container) return;

  const canvasW = container.clientWidth || 960;
  const canvasH = 500;
  const padding = 40; // 缩小边距，给标签更多空间

  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = canvasW * (window.devicePixelRatio || 2);
  canvas.height = canvasH * (window.devicePixelRatio || 2);
  canvas.style.width = canvasW + 'px';
  canvas.style.height = canvasH + 'px';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';

  const ctx = canvas.getContext('2d');
  const scale = window.devicePixelRatio || 2;
  ctx.scale(scale, scale);

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
  bgGrad.addColorStop(0, '#f0fdf4');
  bgGrad.addColorStop(0.5, '#f8faf7');
  bgGrad.addColorStop(1, '#eef6f0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasW, canvasH);

  // 网格线
  ctx.strokeStyle = 'rgba(27,67,50,0.04)';
  ctx.lineWidth = 0.5;
  for (let x = 60; x < canvasW; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasH); ctx.stroke();
  }
  for (let y = 60; y < canvasH; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasW, y); ctx.stroke();
  }

  // 计算所有点坐标
  const pixels = POINTS.map(p => latLngToPixel(p.lat, p.lng, canvasW, canvasH, padding));

  // 绘制环线路径（渐变圆形路线）
  ctx.beginPath();
  ctx.moveTo(pixels[0].x, pixels[0].y);
  for (let i = 1; i < pixels.length; i++) {
    ctx.lineTo(pixels[i].x, pixels[i].y);
  }
  // 闭合环线
  ctx.lineTo(pixels[0].x, pixels[0].y);

  // 路线阴影
  ctx.save();
  ctx.shadowColor = 'rgba(27,67,50,0.25)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.strokeStyle = '#d4a574';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.restore();

  // 路线本体
  ctx.beginPath();
  ctx.moveTo(pixels[0].x, pixels[0].y);
  for (let i = 1; i < pixels.length; i++) {
    ctx.lineTo(pixels[i].x, pixels[i].y);
  }
  ctx.lineTo(pixels[0].x, pixels[0].y);
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 10]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 路线箭头
  for (let i = 0; i < pixels.length - 1; i++) {
    const from = pixels[i];
    const to = pixels[i + 1];
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-4, -5);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 绘制节点
  pixels.forEach((p, i) => {
    const isStartEnd = i === 0 || i === pixels.length - 1;
    const r = isStartEnd ? 14 : 11;

    // 外圈白底
    ctx.beginPath();
    ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = isStartEnd ? '#1b4332' : '#2d6a4f';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 内圈填充
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    const nodeGrad = ctx.createRadialGradient(p.x - 2, p.y - 2, 0, p.x, p.y, r);
    nodeGrad.addColorStop(0, isStartEnd ? '#3a7d5a' : '#4caf82');
    nodeGrad.addColorStop(1, isStartEnd ? '#1b4332' : '#2d6a4f');
    ctx.fillStyle = nodeGrad;
    ctx.fill();

    // 数字
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${isStartEnd ? 13 : 10}px "Noto Sans SC", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isStartEnd ? '★' : String(i), p.x, p.y);

    // 标签
    const label = POINTS[i].name.replace(/（.*）/, '').replace(/\(.*\)/, '');
    ctx.fillStyle = '#1b4332';
    ctx.font = 'bold 11px "Noto Sans SC", sans-serif';

    // 标签位置偏移（避免重叠）
    const labelOffsets = [
      { x: 0, y: -22 },   // 0: 伊宁 - 上
      { x: 16, y: 0 },    // 1: 赛里木湖 - 右
      { x: 16, y: 12 },   // 2: 果子沟大桥 - 右下
      { x: 0, y: -20 },   // 3: 霍城 - 上
      { x: -16, y: 0 },   // 4: 夏塔 - 左
      { x: 16, y: -8 },   // 5: 特克斯 - 右上
      { x: 16, y: 0 },    // 6: 喀拉峻 - 右
      { x: 14, y: -10 },  // 7: 那拉提 - 右上
      { x: 14, y: 10 },   // 8: 巴音布鲁克 - 右下
      { x: 0, y: -20 },   // 9: 唐布拉 - 上
    ];
    const offset = labelOffsets[i] || { x: 14, y: 0 };
    ctx.textAlign = offset.x > 0 ? 'left' : offset.x < 0 ? 'right' : 'center';
    const lx = p.x + offset.x + (offset.x > 0 ? 10 : offset.x < 0 ? -10 : 0);
    const ly = p.y + offset.y;

    // 标签背景
    const textW = ctx.measureText(label).width + 14;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(lx - textW/2, ly - 8, textW, 18);

    ctx.fillStyle = '#1b4332';
    ctx.fillText(label, lx, ly + 4);

    // Day 标签
    if (!isStartEnd) {
      ctx.fillStyle = '#d4a574';
      ctx.font = '9px "Noto Sans SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(POINTS[i].day, p.x, p.y + r + 16);
    }
  });

  container.innerHTML = '';
  container.appendChild(canvas);

  // 距离卡片
  renderDistanceCards();
}

function renderDistanceCards() {
  const container = document.getElementById('distanceCards');
  if (!container) return;
  const keySegments = [SEGMENTS[0], SEGMENTS[1], SEGMENTS[3], SEGMENTS[6], SEGMENTS[9]];
  container.innerHTML = keySegments.map(s => `
    <div class="card p-3 text-center">
      <div class="text-xs" style="color:var(--gray-400)">${s.from} → ${s.to}</div>
      <div class="font-bold" style="color:var(--primary)">${s.km}km / ${s.time}</div>
    </div>
  `).join('');
}

// 窗口resize时重新渲染
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const container = document.getElementById('tencentMap');
    if (container) initRouteMap();
  }, 300);
});
