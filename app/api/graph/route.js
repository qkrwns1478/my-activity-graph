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

const generateSVG = (startDateStr, data, themeColors, size) => {
  const SQUARE_SIZE = parseInt(size, 10) || 12;
  const SQUARE_GAP = Math.max(2, Math.floor(SQUARE_SIZE / 5));
  const PADDING = Math.max(20, SQUARE_SIZE * 2);
  const FONT_SIZE = Math.max(9, Math.floor(SQUARE_SIZE * 0.9));
  
  const MONTH_LABEL_HEIGHT = Math.max(20, SQUARE_SIZE * 2);
  const WEEKDAY_LABEL_WIDTH = Math.max(20, SQUARE_SIZE * 2);
  const TOOLTIP_HEIGHT = Math.max(18, SQUARE_SIZE * 1.8);
  const TOOLTIP_PADDING = Math.max(10, SQUARE_SIZE);

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

  weeks.forEach((week, i) => {
    const firstDayOfTheWeek = week.find(day => day && !day.empty);
    if (!firstDayOfTheWeek) return;

    const currentDay = new Date(firstDayOfTheWeek.date + 'T00:00:00Z');
    const month = currentDay.getUTCMonth();

    if (month !== lastMonth) {
        const currentLabelX = PADDING + WEEKDAY_LABEL_WIDTH + i * (SQUARE_SIZE + SQUARE_GAP);
        monthLabels.push({
            x: currentLabelX,
            text: currentDay.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
        });
        lastMonth = month;
    }
  });

  return `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .month-label, .weekday-label, .tooltip-text { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          font-size: ${FONT_SIZE}px; 
          fill: #767676; 
        }
        .day-cell-group .tooltip {
          display: none;
        }
        .day-cell-group:hover .tooltip {
          display: block;
        }
        .day-cell-group:hover .day-cell-hover {
          stroke: black;
          stroke-width: 0.5px;
        }
        .tooltip-text {
          fill: white;
          font-size: ${FONT_SIZE - 1}px;
        }
      </style>
      <g transform="translate(${PADDING}, ${PADDING})">
        ${monthLabels.map(label => `<text x="${label.x}" y="0" class="month-label">${label.text}</text>`).join('')}
        <text x="0" y="${MONTH_LABEL_HEIGHT + SQUARE_SIZE}" class="weekday-label">M</text>
        <text x="0" y="${MONTH_LABEL_HEIGHT + SQUARE_SIZE * 3 + SQUARE_GAP * 2}" class="weekday-label">W</text>
        <text x="0" y="${MONTH_LABEL_HEIGHT + SQUARE_SIZE * 5 + SQUARE_GAP * 4}" class="weekday-label">F</text>
        <g transform="translate(${WEEKDAY_LABEL_WIDTH}, ${MONTH_LABEL_HEIGHT})">
          ${weeks.map((week, weekIndex) => 
            week.map((day, dayIndex) => {
              if (!day || day.empty) return '';
              const x = weekIndex * (SQUARE_SIZE + SQUARE_GAP);
              const y = dayIndex * (SQUARE_SIZE + SQUARE_GAP);
              return `
                <rect 
                  transform="translate(${x}, ${y})"
                  width="${SQUARE_SIZE}" 
                  height="${SQUARE_SIZE}" 
                  fill="${getContributionColor(day.count, themeColors)}" 
                  rx="2" 
                  ry="2"
                />
              `;
            }).join('')
          ).join('')}
          
          ${weeks.map((week, weekIndex) => 
            week.map((day, dayIndex) => {
              if (!day || day.empty) return '';
              const x = weekIndex * (SQUARE_SIZE + SQUARE_GAP);
              const y = dayIndex * (SQUARE_SIZE + SQUARE_GAP);
              const tooltipText = `${day.date}: ${day.count}`;
              const textLength = tooltipText.length * (FONT_SIZE * 0.55);
              const tooltipWidth = textLength + TOOLTIP_PADDING;

              return `
                <g class="day-cell-group" transform="translate(${x}, ${y})">
                  <rect 
                    class="day-cell-hover"
                    width="${SQUARE_SIZE}" 
                    height="${SQUARE_SIZE}" 
                    fill="transparent"
                    rx="2"
                    ry="2"
                  />
                  <g class="tooltip" transform="translate(${-tooltipWidth / 2 + SQUARE_SIZE / 2}, ${-TOOLTIP_HEIGHT - 5})">
                    <rect 
                      width="${tooltipWidth}" 
                      height="${TOOLTIP_HEIGHT}" 
                      rx="3" 
                      fill="black" 
                      opacity="0.8"
                    />
                    <polygon 
                      points="${tooltipWidth / 2 - 3},${TOOLTIP_HEIGHT} ${tooltipWidth / 2 + 3},${TOOLTIP_HEIGHT} ${tooltipWidth / 2},${TOOLTIP_HEIGHT + 3}" 
                      fill="black" 
                      opacity="0.8"
                    />
                    <text 
                      x="${tooltipWidth / 2}" 
                      y="${TOOLTIP_HEIGHT / 2}" 
                      dominant-baseline="middle" 
                      text-anchor="middle" 
                      class="tooltip-text"
                    >
                      ${tooltipText}
                    </text>
                  </g>
                </g>
              `;
            }).join('')
          ).join('')}
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
  const size = searchParams.get('size') || '12';
  const themeColors = THEMES[theme] || THEMES.grass;

  if (!start || !data) {
    return NextResponse.json({ error: 'start and data parameters are required' }, { status: 400 });
  }

  if (!/^\d{8}$/.test(start)) {
    return NextResponse.json({ error: 'start parameter must be in YYYYMMDD format' }, { status: 400 });
  }

  const svg = generateSVG(start, data, themeColors, size);

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
