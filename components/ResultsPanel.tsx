"use client";

import { formatNumber, type CalculatorResult } from "@/lib/calculations";
import TrenchGraph from "./TrenchGraph";

interface ResultsPanelProps {
  result: CalculatorResult | null;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const hasResult = result !== null;

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Resultados
      </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Área de la zanja para el escurrimiento máximo y para un día de lluvia
          promedio, más el caudal en litros por segundo.
        </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultCard
          title="Área zanja (escurrimiento)"
          value={hasResult ? `${formatNumber(result.runoff_daily_area)} m²` : "—"}
          subtitle="Sección transversal para la lluvia máxima"
        />
        <ResultCard
          title="Escurrimiento por segundo"
          value={hasResult ? `${formatNumber(result.runoff_per_second)} L/s` : "—"}
          subtitle="Caudal de escurrimiento en litros por segundo"
        />
        <ResultCard
          title="Área zanja (promedio)"
          value={hasResult ? `${formatNumber(result.normal_daily_area)} m²` : "—"}
          subtitle="Sección transversal para un día de lluvia promedio"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Representación gráfica
        </h3>
        <div className="mt-4 flex justify-center rounded-xl bg-zinc-50 p-6 dark:bg-zinc-800/40">
          <TrenchGraph
            runoffDailyArea={result?.runoff_daily_area ?? 0}
            runoffPerSecond={result?.runoff_per_second ?? 0}
            normalDailyArea={result?.normal_daily_area ?? 0}
            active={hasResult}
          />
        </div>
      </div>
    </section>
  );
}

function ResultCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/60">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}
