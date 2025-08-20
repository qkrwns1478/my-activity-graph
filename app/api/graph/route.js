import { NextResponse } from 'next/server';

const THEMES = {
  grass: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  halloween: ['#ebedf0', '#fdf436', '#ffc700', '#ff9100', '#06001c'],
  teal: ['#ebedf0', '#a3f7ff', '#69d7e5', '#40a8b6', '#1e6b78'],
  blue: ['#ebedf0', '#b3c5ff', '#89a2ff', '#6080ff', '#365dfd'],
  winter: ['#ebedf0', '#a4d4ff', '#78baff', '#4b9eff', '#1982ff'],
};

const getContributionColor = (count, colors) => {
  if (count > 20) return colors[4];
  if (count > 10) return colors[3];
  if (count > 5) return colors[2];
  if (count > 0) return colors[1];
  return colors[0];
};

const generateSVG = (startDateStr, data, themeColors) => {
  const SQUARE_SIZE = 10;
  const SQUARE_GAP = 2;
  const PADDING = 20;
  const MONTH_LABEL_HEIGHT = 20;
  const WEEKDAY_LABEL_WIDTH = 20;

  const startDate = new Date(`${startDateStr.slice(0, 4)}-${startDateStr.slice(4, 6)}-${startDateStr.slice(6, 8)}T00:00:00Z`);
  const values = data.split(',').map(Number);
  const dayCount = values.length;

  const weeks = [];
  let currentDate = new Date(startDate);
  let currentWeek = Array(7).fill(null);

  for (let i = 0; i < currentDate.getUTCDay(); i++) {
    currentWeek[i] = { empty: true };
  }

  for (let i = 0; i < dayCount; i++) {
    const dayOfWeek = currentDate.getUTCDay();
    currentWeek[dayOfWeek] = {
      date: currentDate.toISOString().split('T')[0],
      count: values[i] || 0,
    };

    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  if (currentWeek.some(day => day !== null)) {
    weeks.push(currentWeek);
  }

  const weekCount = weeks.length;
  const svgWidth = PADDING * 2 + WEEKDAY_LABEL_WIDTH + weekCount * (SQUARE_SIZE + SQUARE_GAP) - SQUARE_GAP;
  const svgHeight = PADDING * 2 + MONTH_LABEL_HEIGHT + 7 * (SQUARE_SIZE + SQUARE_GAP) - SQUARE_GAP;

  const monthLabels = [];
  let lastMonth = -1;
  currentDate = new Date(startDate);
  for (let i = 0; i < weekCount; i++) {
      const firstDayOfWeek = new Date(currentDate);
      const dayOffset = i * 7 - firstDayOfWeek.getUTCDay();
      firstDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() + dayOffset);
      const month = firstDayOfWeek.getUTCMonth();
      if (i === 0 || month !== lastMonth) {
          monthLabels.push({
              x: PADDING + WEEKDAY_LABEL_WIDTH + i * (SQUARE_SIZE + SQUARE_GAP),
              text: firstDayOfWeek.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
          });
          lastMonth = month;
      }
  }

  return `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .month-label, .weekday-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; fill: #767676; }
        .day-cell:hover { stroke: black; stroke-width: 0.5px; }
      </style>
      <g transform="translate(${PADDING}, ${PADDING})">
        ${monthLabels.map(label => `<text x="${label.x}" y="0" class="month-label">${label.text}</text>`).join('')}
        <text x="0" y="${MONTH_LABEL_HEIGHT + SQUARE_SIZE}" class="weekday-label">M</text>
        <text x="0" y="${MONTH_LABEL_HEIGHT + SQUARE_SIZE * 3 + SQUARE_GAP * 2}" class="weekday-label">W</text>
        <text x="0" y="${MONTH_LABEL_HEIGHT + SQUARE_SIZE * 5 + SQUARE_GAP * 4}" class="weekday-label">F</text>
        <g transform="translate(${WEEKDAY_LABEL_WIDTH}, ${MONTH_LABEL_HEIGHT})">
          ${weeks.map((week, weekIndex) => `
            <g transform="translate(${weekIndex * (SQUARE_SIZE + SQUARE_GAP)}, 0)">
              ${week.map((day, dayIndex) => {
                if (!day || day.empty) return '';
                return `
                  <rect class="day-cell" width="${SQUARE_SIZE}" height="${SQUARE_SIZE}" x="0" y="${dayIndex * (SQUARE_SIZE + SQUARE_GAP)}" fill="${getContributionColor(day.count, themeColors)}" rx="2" ry="2" data-date="${day.date}" data-count="${day.count}">
                    <title>${day.date}: ${day.count} contributions</title>
                  </rect>
                `;
              }).join('')}
            </g>
          `).join('')}
        </g>
      </g>
    </svg>
  `;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const data = searchParams.get('data');
  const theme = searchParams.get('theme') || 'grass';
  const themeColors = THEMES[theme] || THEMES.grass;

  if (!start || !data) {
    return NextResponse.json({ error: 'start and data parameters are required' }, { status: 400 });
  }

  if (!/^\d{8}$/.test(start)) {
    return NextResponse.json({ error: 'start parameter must be in YYYYMMDD format' }, { status: 400 });
  }

  const svg = generateSVG(start, data, themeColors);

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate', // 1시간 캐시
    },
  });
}
