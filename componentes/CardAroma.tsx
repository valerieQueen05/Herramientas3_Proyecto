import { Card } from "@heroui/react";
import { RenderIcon } from "./RenderIcon";

interface ICardAroma {
  backgroundColor?: string;
  iconBg?: string;
  iconColor?: string;
  description?: string;
  icon?: string;
  value: number | string;
}

export default function CardAroma({
  backgroundColor = "bg-white",
  iconBg = "bg-gray-100",
  iconColor = "text-gray-500",
  description,
  icon,
  value,
}: ICardAroma) {
  return (
    <Card
      className={`w-full min-w-0 border border-black/5 shadow-sm p-4 ${backgroundColor}`}
    >
      {icon && (
        <div
          className={`flex items-center justify-center h-9 w-9 rounded-full mb-3 text-lg ${iconBg} ${iconColor}`}
        >
          <RenderIcon icon={icon} />
        </div>
      )}
      <Card.Header className="p-0 gap-0.5">
        <Card.Title className="text-2xl font-bold text-[#16123f]">
          {value}
        </Card.Title>
        {description && (
          <Card.Description className="text-xs text-gray-500">
            {description}
          </Card.Description>
        )}
      </Card.Header>
    </Card>
  );
}