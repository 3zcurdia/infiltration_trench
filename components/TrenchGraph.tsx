"use client";

import { useId } from "react";
import { formatNumber } from "@/lib/calculations";

interface TrenchGraphProps {
  runoffDailyArea: number;
  runoffPerSecond: number;
  active: boolean;
}

const VIEW_W = 600;
const VIEW_H = 360;
const TOP_Y = 90;
const BOTTOM_Y = 290;
const TOP_HALF_W = 240;
const BOTTOM_HALF_W = 140;
const CENTER_X = VIEW_W / 2;

function trapezoidPoints() {
  return [
    [CENTER_X - TOP_HALF_W, TOP_Y],
    [CENTER_X + TOP_HALF_W, TOP_Y],
    [CENTER_X + BOTTOM_HALF_W, BOTTOM_Y],
    [CENTER_X - BOTTOM_HALF_W, BOTTOM_Y],
  ];
}

function pointsToPath(points: number[][]) {
  return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]} L ${points[2][0]} ${points[2][1]} L ${points[3][0]} ${points[3][1]} Z`;
}

export default function TrenchGraph({ runoffDailyArea, runoffPerSecond, active }: TrenchGraphProps) {
  const clipId = useId();
  const trenchPath = pointsToPath(trapezoidPoints());

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      role="img"
      aria-label={
        active
          ? `Gráfico de zanja con área ${formatNumber(runoffDailyArea, 6)} m² y caudal ${formatNumber(runoffPerSecond)} L/s`
          : "Gráfico de zanja sin resultados aún"
      }
      className="h-auto max-w-md"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={trenchPath} />
        </clipPath>
        <linearGradient id="waterGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <path
          d={`M ${CENTER_X - TOP_HALF_W} ${TOP_Y} L ${CENTER_X + TOP_HALF_W} ${TOP_Y} L ${CENTER_X + BOTTOM_HALF_W} ${BOTTOM_Y} L ${CENTER_X - BOTTOM_HALF_W} ${BOTTOM_Y} Z`}
          fill="url(#waterGradient)"
        />
      </g>

      <path
        d={trenchPath}
        fill="none"
        stroke="#0f766e"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {active && (
        <g>
          <text
            x={CENTER_X - TOP_HALF_W - 20}
            y={TOP_Y + 4}
            textAnchor="end"
            fontSize="13"
            fontWeight="600"
            className="fill-sky-700 dark:fill-sky-300"
          >
            Caudal: {formatNumber(runoffPerSecond)} L/s
          </text>
          <line
            x1={CENTER_X - TOP_HALF_W - 10}
            y1={TOP_Y + 12}
            x2={CENTER_X - TOP_HALF_W + 8}
            y2={TOP_Y + 12}
            stroke="#0ea5e9"
            strokeWidth="2"
          />
        </g>
      )}

      <text
        x={CENTER_X}
        y={BOTTOM_Y + 30}
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        className="fill-zinc-700 dark:fill-zinc-300"
      >
        Capacidad de zanja
      </text>

      <text
        x={CENTER_X}
        y={(TOP_Y + BOTTOM_Y) / 2 + 6}
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        className="fill-zinc-900 dark:fill-white"
      >
        {active ? `${formatNumber(runoffDailyArea, 6)} m²` : "—"}
      </text>
    </svg>
  );
}
