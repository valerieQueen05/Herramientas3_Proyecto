import { Card, ProgressBar } from "@heroui/react";

interface IMetaDelDia {
  actual: number;
  meta: number;
}

export default function MetaDelDia({ actual, meta }: IMetaDelDia) {
  const porcentaje = Math.round((actual / meta) * 100);

  return (
    <Card className="w-full min-w-0 bg-[#16123f] text-white border-0 shadow-sm p-4">
      <Card.Header className="p-0 flex-row items-center justify-between mb-2">
        <Card.Title className="text-xs font-medium text-gray-300">
          Meta del día
        </Card.Title>
        <span className="text-xs font-semibold text-[#ffe26a]">
          {porcentaje}%
        </span>
      </Card.Header>

      <p className="text-2xl font-bold mb-3">
        {actual}
        <span className="text-sm font-medium text-gray-400">/{meta}</span>
      </p>

      <ProgressBar value={porcentaje} className="w-full">
        <ProgressBar.Track className="bg-white/10 h-1.5 rounded-full">
          <ProgressBar.Fill
            className="bg-[#ffe26a] h-1.5 rounded-full"
            style={{ width: `${porcentaje}%` }}
          />
        </ProgressBar.Track>
      </ProgressBar>
    </Card>
  );
}