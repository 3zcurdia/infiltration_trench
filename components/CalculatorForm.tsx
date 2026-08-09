"use client";

import { useState, type FormEvent } from "react";
import {
  calculate,
  CalculatorInputError,
  type CalculatorResult,
  type TrenchAreaInput,
} from "@/lib/calculations";

type FieldKey = keyof TrenchAreaInput;

const FIELDS: {
  key: FieldKey;
  label: string;
  unit: string;
  placeholder: string;
  hint: string;
  step: string;
  min: string;
  max?: string;
}[] = [
  {
    key: "max_month",
    label: "Precipitación máxima mensual",
    unit: "mm",
    placeholder: "p. ej. 250",
    hint: "Lluvia total del mes más húmedo.",
    step: "0.1",
    min: "0",
  },
  {
    key: "monthly_avg_precipitation",
    label: "Precipitación normal mensual",
    unit: "mm",
    placeholder: "p. ej. 120",
    hint: "Lluvia promedio de un mes típico.",
    step: "0.1",
    min: "0",
  },
  {
    key: "rain_days_month",
    label: "Días de lluvia al mes",
    unit: "días",
    placeholder: "p. ej. 12",
    hint: "Número de días con lluvia en ese mes.",
    step: "1",
    min: "0",
  },
  {
    key: "captation_area",
    label: "Área de captación",
    unit: "m²",
    placeholder: "p. ej. 15000",
    hint: "Superficie que aporta escurrimiento a la zanja.",
    step: "0.1",
    min: "0",
  },
  {
    key: "captation_percent",
    label: "Porcentaje de captación",
    unit: "%",
    placeholder: "p. ej. 60",
    hint: "Coeficiente de escurrimiento (0–100).",
    step: "1",
    min: "0",
    max: "100",
  },
  {
    key: "trench_length_m",
    label: "Largo de la zanja",
    unit: "m",
    placeholder: "p. ej. 80",
    hint: "Longitud total de la zanja de infiltración.",
    step: "1",
    min: "0",
  },
];

interface CalculatorFormProps {
  onResult: (result: CalculatorResult | null) => void;
}

export default function CalculatorForm({ onResult }: CalculatorFormProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    max_month: "",
    monthly_avg_precipitation: "",
    rain_days_month: "",
    captation_area: "",
    captation_percent: "",
    trench_length_m: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const parsed: Partial<TrenchAreaInput> = {};
    for (const field of FIELDS) {
      const raw = values[field.key].trim();
      if (raw === "") {
        setError(`El campo "${field.label}" es obligatorio.`);
        onResult(null);
        return;
      }
      const num = Number(raw);
      if (!Number.isFinite(num)) {
        setError(`El campo "${field.label}" debe ser un número válido.`);
        onResult(null);
        return;
      }
      parsed[field.key] = num;
    }

    try {
      const result = calculate(parsed as TrenchAreaInput);
      onResult(result);
    } catch (err) {
      if (err instanceof CalculatorInputError) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al calcular.");
      }
      onResult(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Datos de entrada
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Todos los campos son obligatorios.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {field.label}{" "}
              <span className="text-xs font-normal text-zinc-500">({field.unit})</span>
            </span>
            <input
              type="number"
              inputMode="decimal"
              required
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.key]}
              onChange={handleChange(field.key)}
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-500">
              {field.hint}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto"
      >
        Calcular
      </button>
    </form>
  );
}
