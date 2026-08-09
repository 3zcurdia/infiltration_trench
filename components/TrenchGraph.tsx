"use client";

import { formatNumber } from "@/lib/calculations";

interface TrenchGraphProps {
  runoffDailyArea: number;
  runoffPerSecond: number;
  normalDailyArea: number;
  active: boolean;
}

const VIEW_W = 600;
const VIEW_H = 360;

const LEFT_X = 175;
const RIGHT_X = 425;
const TOP_Y = 70;
const BOTTOM_Y = 250;
const TOP_HALF_W = 110;
const BOTTOM_HALF_W = 60;
const HEIGHT = BOTTOM_Y - TOP_Y;

function pointsToPath(points: number[][]) {
  return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} L ${points[3][0]} ${points[3][1]} Z`;
}

function trenchPoints(centerX: number, scale: number) {
  const topW = TOP_HALF_W * scale;
  const botW = BOTTOM_HALF_W * scale;
  const topY = BOTTOM_Y - HEIGHT * scale;
  return [
    [centerX - topW, topY],
    [centerX + topW, topY],
    [centerX + botW, BOTTOM_Y],
    [centerX - botW, BOTTOM_Y],
  ];
}

export default function TrenchGraph({
  runoffDailyArea,
  runoffPerSecond,
  normalDailyArea,
  active,
}: TrenchGraphProps) {
  const maxArea = Math.max(runoffDailyArea, normalDailyArea, 0);
  const hasComputedResult = active && maxArea > 0;

  const runoffScale = hasComputedResult
    ? Math.sqrt(runoffDailyArea / maxArea)
    : 1;
  const normalScale = hasComputedResult
    ? Math.sqrt(normalDailyArea / maxArea)
    : 1;

  const runoffPoints = trenchPoints(LEFT_X, runoffScale);
  const normalPoints = trenchPoints(RIGHT_X, normalScale);
  const runoffPath = pointsToPath(runoffPoints);
  const normalPath = pointsToPath(normalPoints);

  const runoffTopY = BOTTOM_Y - HEIGHT * runoffScale;
  const normalTopY = BOTTOM_Y - HEIGHT * normalScale;
  const runoffMidY = (runoffTopY + BOTTOM_Y) / 2;
  const normalMidY = (normalTopY + BOTTOM_Y) / 2;

  const stroke = hasComputedResult ? "#0f766e" : "#a1a1aa";
  const dash = hasComputedResult ? undefined : "6 4";

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      role="img"
      aria-label={
        active
          ? `Gráfico: zanja de escurrimiento con área ${formatNumber(runoffDailyArea)} m² y caudal ${formatNumber(runoffPerSecond)} L/s; zanja promedio con área ${formatNumber(normalDailyArea, 6)} m²`
          : "Gráfico de zanjas sin resultados aún"
      }
      className="h-auto max-w-md"
    >
      <defs>
        <linearGradient id="waterGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <g>
        {hasComputedResult && (
          <path d={runoffPath} fill="url(#waterGradient)" />
        )}
        <path
          d={runoffPath}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray={dash}
        />
      </g>

      <g>
        {hasComputedResult && (
          <path d={normalPath} fill="url(#waterGradient)" />
        )}
        <path
          d={normalPath}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray={dash}
        />
      </g>

      {active && (
        <>
          <text
            x={LEFT_X}
            y={runoffTopY - 14}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            className="fill-sky-700 dark:fill-sky-300"
          >
            Caudal: {formatNumber(runoffPerSecond)} L/s
          </text>
          <line
            x1={LEFT_X - 6}
            y1={runoffTopY - 6}
            x2={LEFT_X + 6}
            y2={runoffTopY - 6}
            stroke="#0ea5e9"
            strokeWidth="2"
          />

          <text
            x={LEFT_X}
            y={runoffMidY + 6}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            className="fill-zinc-900 dark:fill-white"
          >
            {formatNumber(runoffDailyArea)} m²
          </text>
          <text
            x={RIGHT_X}
            y={normalMidY + 6}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fill-zinc-900 dark:fill-white"
          >
            {formatNumber(normalDailyArea)} m²
          </text>
        </>
      )}

      <text
        x={LEFT_X}
        y={BOTTOM_Y + 24}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        className="fill-zinc-700 dark:fill-zinc-300"
      >
        Escurrimiento (máx)
      </text>
      <text
        x={RIGHT_X}
        y={BOTTOM_Y + 24}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        className="fill-zinc-700 dark:fill-zinc-300"
      >
        Normal (promedio)
      </text>

      {!active && (
        <>
          <text
            x={LEFT_X}
            y={runoffMidY + 6}
            textAnchor="middle"
            fontSize="20"
            fontWeight="600"
            className="fill-zinc-400"
          >
            —
          </text>
          <text
            x={RIGHT_X}
            y={normalMidY + 6}
            textAnchor="middle"
            fontSize="20"
            fontWeight="600"
            className="fill-zinc-400"
          >
            —
          </text>
        </>
      )}
    </svg>
  );
}
