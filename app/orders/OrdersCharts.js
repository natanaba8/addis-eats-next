"use client";

import { etb } from "../../lib/format.js";

const chartWidth = 720;
const timeChartHeight = 250;
const timePlot = { left: 92, right: 16, top: 18, bottom: 42 };
const timePlotWidth = chartWidth - timePlot.left - timePlot.right;
const timePlotHeight = timeChartHeight - timePlot.top - timePlot.bottom;

function NeighborhoodRevenueChart({ neighborhoods }) {
  const chartHeight = Math.max(260, neighborhoods.length * 34 + 54);
  const plot = { left: 154, right: 112, top: 16, bottom: 34 };
  const plotWidth = chartWidth - plot.left - plot.right;
  const plotHeight = chartHeight - plot.top - plot.bottom;
  const maxRevenue = Math.max(0, ...neighborhoods.map((row) => row.revenue));
  const tickStep = Math.max(1, Math.ceil(maxRevenue / 4));
  const xMax = tickStep * 4;
  const ticks = Array.from({ length: 5 }, (_, index) => tickStep * index);
  const rowHeight = neighborhoods.length ? plotHeight / neighborhoods.length : 0;

  return (
    <section className="chart-section" aria-labelledby="neighborhood-chart-heading">
      <h2 id="neighborhood-chart-heading">Revenue by neighbourhood (ETB)</h2>
      {neighborhoods.length ? (
        <div className="dashboard-chart-frame" role="group" aria-label="Revenue by neighbourhood bar chart">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            style={{ height: `${chartHeight}px` }}
          >
            <defs>
              <pattern id="bar-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#f5efe7" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="#1d1b1a" strokeWidth="2" />
              </pattern>
            </defs>
            {ticks.map((tick) => {
              const x = plot.left + (tick / xMax) * plotWidth;
              return (
                <g key={tick}>
                  <line x1={x} x2={x} y1={plot.top} y2={chartHeight - plot.bottom} className="chart-grid-line" />
                  <text x={x} y={chartHeight - 10} textAnchor="middle" className="chart-tick-label">
                    {etb(tick)}
                  </text>
                </g>
              );
            })}
            {neighborhoods.map((row, index) => {
              const y = plot.top + index * rowHeight;
              const barWidth = (row.revenue / xMax) * plotWidth;
              return (
                <g key={row.neighborhood}>
                  <text x={plot.left - 10} y={y + rowHeight / 2 + 4} textAnchor="end" className="chart-category-label">
                    {row.neighborhood}
                  </text>
                  <rect
                    x={plot.left}
                    y={y + rowHeight * 0.2}
                    width={barWidth}
                    height={rowHeight * 0.6}
                    className="neighborhood-bar"
                    fill="url(#bar-hatch)"
                  />
                  <text x={plot.left + barWidth + 8} y={y + rowHeight / 2 + 4} className="chart-value-label">
                    {etb(row.revenue)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="dashboard-chart-frame chart-no-data" role="status">No neighbourhood revenue to chart yet.</div>
      )}
      <div className="data-table-scroll daily-data-scroll">
        <table className="daily-data-table">
          <caption>Revenue by neighbourhood in Ethiopian birr</caption>
          <thead>
            <tr>
              <th scope="col">Neighbourhood</th>
              <th scope="col" className="numeric-cell">Revenue (ETB)</th>
            </tr>
          </thead>
          <tbody>
            {neighborhoods.length ? neighborhoods.map((row) => (
              <tr key={row.neighborhood}>
                <th scope="row">{row.neighborhood}</th>
                <td className="numeric-cell">{etb(row.revenue)}</td>
              </tr>
            )) : (
              <tr><td colSpan="2" className="table-empty-cell">No neighbourhood data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OrdersOverTimeChart({ days }) {
  const maxOrders = Math.max(1, ...days.map((day) => day.orderCount));
  const bandWidth = timePlotWidth / Math.max(days.length - 1, 1);
  const points = days.map((day, index) => ({
    x: timePlot.left + index * bandWidth,
    y: timePlot.top + timePlotHeight - (day.orderCount / maxOrders) * timePlotHeight,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");

  return (
    <section className="chart-section" aria-labelledby="orders-chart-heading">
      <h2 id="orders-chart-heading">Orders per day (orders), last 7 days</h2>
      <div className="dashboard-chart-frame">
        <svg viewBox={`0 0 ${chartWidth} ${timeChartHeight}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <line
            x1={timePlot.left}
            x2={chartWidth - timePlot.right}
            y1={timePlot.top + timePlotHeight}
            y2={timePlot.top + timePlotHeight}
            className="chart-grid-line"
          />
          <text x={timePlot.left - 10} y={timePlot.top + 4} textAnchor="end" className="chart-tick-label">{maxOrders}</text>
          <text x={timePlot.left - 10} y={timePlot.top + timePlotHeight + 4} textAnchor="end" className="chart-tick-label">0</text>
          <path d={path} className="orders-line" />
          {points.map((point, index) => (
            <g key={days[index].date}>
              <circle cx={point.x} cy={point.y} r="4" className="orders-point" />
              <text x={point.x} y={Math.max(timePlot.top + 14, point.y - 9)} textAnchor="middle" className="chart-value-label">
                {days[index].orderCount}
              </text>
              <text x={point.x} y={timeChartHeight - 12} textAnchor="middle" className="chart-date-label">
                {days[index].label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="data-table-scroll daily-data-scroll">
        <table className="daily-data-table">
          <caption>Orders per day, last 7 days</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col" className="numeric-cell">Orders</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date}>
                <th scope="row">{day.label}</th>
                <td className="numeric-cell">{day.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function OrdersCharts({ days, neighborhoods }) {
  return (
    <div className="orders-analytics">
      <div className="orders-chart-grid">
        <NeighborhoodRevenueChart neighborhoods={neighborhoods} />
        <OrdersOverTimeChart days={days} />
      </div>
    </div>
  );
}
