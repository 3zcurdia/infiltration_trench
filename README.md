# Zanja de Infiltración — Calculadora

Calculadora web para determinar el **excedente diario** (m³/día) y el **área de la zanja** (m²) de infiltración.

Hecha con **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**. Lista para desplegar en Vercel sin configuración adicional.

## Datos de entrada

| Campo | Unidad | Descripción |
|---|---|---|
| `max_month` | mm | Precipitación del mes más húmedo |
| `rain_days_month` | días | Días de lluvia en ese mes |
| `captation_area` | m² | Área de la superficie de captación |
| `captation_percent` | % (0–100) | Porcentaje de captación (coeficiente de escurrimiento) |
| `trench_length_m` | m | Largo total de la zanja |

## Funciones puras

Definidas en `lib/calculations.ts`:

```ts
overflowPerDay(max_month, rain_days_month, captation_area, captation_percent)
trenchArea(max_month, rain_days_month, captation_area, captation_percent, trench_length_m)
```

## Algoritmo

```
max_day_mm   = max_month / rain_days_month
max_day_m    = max_day_mm / 100.0
runoff       = max_day_m * captation_area
excedente    = runoff * (captation_percent / 100)
runoff_daily_area = excedente / trench_length_m
zanja        = runoff_daily_area / 86400
```

El mismo algoritmo produce tanto el excedente (m³/día) como el área de la zanja (m²).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Verificación

```bash
npm run lint
npm run build
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Entra a <https://vercel.com/new> e importa el repositorio.
3. Vercel detecta automáticamente el framework Next.js. Pulsa **Deploy**.

Como alternativa con la CLI:

```bash
npm i -g vercel
vercel
```

No requiere variables de entorno ni configuración especial: la app es 100 % cliente y se prerenderiza como contenido estático.

## Estructura

```
app/
  layout.tsx          # Layout raíz, lang="es", fuentes Geist
  page.tsx            # Página principal (Client Component con estado)
  globals.css         # Tailwind v4
components/
  CalculatorForm.tsx  # Formulario con 5 campos obligatorios y validación
  ResultsPanel.tsx    # Tarjetas con excedente y zanja + gráfico
  TrenchGraph.tsx     # SVG trapezoidal con el área de zanja dentro
lib/
  calculations.ts     # Funciones puras: overflowPerDay, trenchArea + validación
```
