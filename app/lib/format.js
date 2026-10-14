export function etb(amount) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function when(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function relative(value, now = Date.now()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "time unknown";

  const elapsedSeconds = Math.round((date.getTime() - now) / 1000);
  const divisions = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let valueToFormat = elapsedSeconds;
  let unit = "second";

  for (const [divisor, nextUnit] of divisions) {
    if (Math.abs(valueToFormat) < divisor) {
      unit = nextUnit;
      break;
    }
    valueToFormat /= divisor;
    unit = nextUnit;
  }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round(valueToFormat),
    unit,
  );
}
