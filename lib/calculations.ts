export const SECONDS_PER_DAY = 86400;
export const LITERS_PER_CUBIC_METER = 1000;

export interface TrenchAreaInput {
  max_month: number;
  rain_days_month: number;
  captation_area: number;
  captation_percent: number;
  trench_length_m: number;
}

export class CalculatorInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalculatorInputError";
  }
}

export function overflowPerDay(
  max_month: number,
  rain_days_month: number,
  captation_area: number,
  captation_percent: number,
): number {
  const max_day_mm = max_month / rain_days_month;
  const max_day_m = max_day_mm / 1000.0;
  const runoff = max_day_m * captation_area;
  return runoff * captation_percent;
}

function requireFinite(value: number, field: string): number {
  if (!Number.isFinite(value)) {
    throw new CalculatorInputError(`El valor de ${field} no es un número válido.`);
  }
  return value;
}

function requirePositive(value: number, field: string): number {
  if (value <= 0) {
    throw new CalculatorInputError(`El valor de ${field} debe ser mayor a cero.`);
  }
  return value;
}

function requireNonNegative(value: number, field: string): number {
  if (value < 0) {
    throw new CalculatorInputError(`El valor de ${field} no puede ser negativo.`);
  }
  return value;
}

function requireUnit(value: number, field: string): number {
  if (value < 0 || value > 100) {
    throw new CalculatorInputError(
      `El valor de ${field} debe estar entre 0 y 100.`,
    );
  }
  return value;
}

export function validateInput(input: TrenchAreaInput): TrenchAreaInput {
  const max_month = requireNonNegative(
    requireFinite(input.max_month, "precipitación máxima mensual"),
    "precipitación máxima mensual",
  );
  const rain_days_month = requirePositive(
    requireFinite(input.rain_days_month, "días de lluvia al mes"),
    "días de lluvia al mes",
  );
  const captation_area = requirePositive(
    requireFinite(input.captation_area, "área de captación"),
    "área de captación",
  );
  const captation_percent = requireUnit(
    requireNonNegative(
      requireFinite(input.captation_percent, "porcentaje de captación"),
      "porcentaje de captación",
    ),
    "porcentaje de captación",
  );
  const trench_length_m = requirePositive(
    requireFinite(input.trench_length_m, "largo de la zanja"),
    "largo de la zanja",
  );

  return {
    max_month,
    rain_days_month,
    captation_area,
    captation_percent,
    trench_length_m,
  };
}

export interface CalculatorResult {
  runoff_daily_area: number;
  runoff_per_second: number;
}

export function calculate(input: TrenchAreaInput): CalculatorResult {
  const safe = validateInput(input);
  const percentFraction = safe.captation_percent / 100;
  const real_runoff = overflowPerDay(
    safe.max_month,
    safe.rain_days_month,
    safe.captation_area,
    percentFraction,
  );
  const runoff_daily_area = real_runoff / safe.trench_length_m;
  const runoff_per_second = (real_runoff * LITERS_PER_CUBIC_METER) / SECONDS_PER_DAY;

  return { runoff_daily_area, runoff_per_second };
}

export function formatNumber(value: number, fractionDigits = 4): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  })}`;
}
