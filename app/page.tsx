"use client";

import { useState } from "react";
import CalculatorForm from "@/components/CalculatorForm";
import ResultsPanel from "@/components/ResultsPanel";
import type { CalculatorResult } from "@/lib/calculations";

export default function Home() {
  const [result, setResult] = useState<CalculatorResult | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Cosecha de agua
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Calculadora de zanja de infiltración
          </h1>
          <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            Determina el área de la zanja de infiltración para el evento de
            escurrimiento máximo y para un día de lluvia promedio, además del
            caudal en litros por segundo, a partir de las precipitaciones
            máxima y promedio mensuales, los días de lluvia, el área de
            captación, el porcentaje de captación y el largo de la zanja.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CalculatorForm onResult={setResult} />
          <ResultsPanel result={result} />
        </div>

        <footer className="pt-4 text-center text-xs text-zinc-500">
          max_day_mm = Pmax / días · max_day_m = max_day_mm / 1000 · runoff =
          max_day_m × área · excedente = runoff × (% / 100) · área zanja =
          excedente / largo (m²) · caudal = excedente × 1000 / 86400 (L/s) ·
          área promedio = mismo cálculo con Pprom (m²)
        </footer>
      </main>
    </div>
  );
}
