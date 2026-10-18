"use client";

import { etb } from "../../lib/format.js";

const width = 720;
const height = 250;
const plot = { left: 92, right: 16, top: 14, bottom: 42 };
const plotWidth = width - plot.left - plot.right;
const plotHeight = height - plot.top - plot.bottom;

function RevenueChart({ days }) {
  const maxRevenue = Math.max(0, ...days.map((day) => day.revenue));
  const tickStep = Math.max(1, Math.ceil(maxRevenue / 4));
  const yMax = tickStep * 4;
  const bandWidth = plotWidth / Math.max(days.length, 1);
  const ticks = Array.from({ length: 5 }, (_, index) => tickStep * index);

  return (
    <section className="chart-section" aria-labelledby="revenue-chart-heading">
      <h2 id="revenue-chart-heading">Revenue by day, last 7 days (ETB)</h2>
      <div className="dashboard-chart-frame">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {ticks.map((tick) => {
            const y = plot.top + plotHeight - (tick / yMax) * plotHeight;
            return (
              <g key={tick}>
                <line x1={plot.left} x2={width - plot.right} y1={y} y2={y} className="chart-grid-line" />
                <text x={plot.left - 10} y={y + 4} textAnchor="end" className="chart-tick-label">
                  {etb(tick)}
                </text>
              </g>
            );
          })}
          {days.map((day, index) => {
            const barHeight = (day.revenue / yMax) * plotHeight;
            const x = plot.left + index * bandWidth + bandWidth * 0.2;
            return (
              <g key={day.date}>
                <rect
                  x={x}
                  y={plot.top + plotHeight - barHeight}
                  width={bandWidth * 0.6}
                  height={barHeight}
                  rx="3"
                  className="revenue-bar"
                />
                <text
                  x={plot.left + index * bandWidth + bandWidth / 2}
                  y={height - 12}
                  textAnchor="middle"
                  className="chart-date-label"
                >
                  {day.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function OrdersChart({ days }) {
  const maxOrders = Math.max(1, ...days.map((day) => day.orderCount));
  const bandWidth = plotWidth / Math.max(days.length - 1, 1);
  const points = days.map((day, index) => ({
    x: plot.left + index * bandWidth,
    y: plot.top + plotHeight - (day.orderCount / maxOrders) * plotHeight,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");

  return (
    <section className="chart-section" aria-labelledby="orders-chart-heading">
      <h2 id="orders-chart-heading">Orders per day (orders), last 7 days</h2>
      <div className="dashboard-chart-frame">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <line
            x1={plot.left}
            x2={width - plot.right}
            y1={plot.top + plotHeight}
            y2={plot.top + plotHeight}
            className="chart-grid-line"
          />
          <text x={plot.left - 10} y={plot.top + 4} textAnchor="end" className="chart-tick-label">{maxOrders}</text>
          <text x={plot.left - 10} y={plot.top + plotHeight + 4} textAnchor="end" className="chart-tick-label">0</text>
          <path d={path} className="orders-line" />
          {points.map((point, index) => (
            <g key={days[index].date}>
              <circle cx={point.x} cy={point.y} r="4" className="orders-point" />
              <text
                x={point.x}
                y={height - 12}
                textAnchor="middle"
                className="chart-date-label"
              >
                {days[index].label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

export default function OrdersCharts({ days }) {
  const hasOrders = days.some((day) => day.orderCount > 0);

  return (
    <div className="orders-analytics">
      <div className="orders-chart-grid">
        <RevenueChart days={days} />
        <OrdersChart days={days} />
      </div>
      {!hasOrders ? <p className="chart-empty-note">No activity recorded in the last 7 days.</p> : null}
      <div className="data-table-scroll daily-data-scroll">
        <table className="daily-data-table">
          <caption>Daily chart data for the last 7 days</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col" className="numeric-cell">Orders</th>
              <th scope="col" className="numeric-cell">Revenue (ETB)</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date}>
                <th scope="row">{day.label}</th>
                <td className="numeric-cell">{day.orderCount}</td>
                <td className="numeric-cell">{etb(day.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}