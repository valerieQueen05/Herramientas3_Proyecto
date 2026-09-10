import { Card } from "@heroui/react";
import { RenderIcon } from "./RenderIcon";

interface ICardAroma {
  backgroundColor?: string;
  description?: string;
  icon?: string;
  value: number;
}

export default function CardAroma({
  backgroundColor,
  description,
  icon,
  value,
}: ICardAroma) {
  return (
    <Card className={`w-100 ${backgroundColor}`}>
      {icon && <RenderIcon icon={icon} />}
      <Card.Header>
        <Card.Title>{value}</Card.Title>
        {description && <Card.Description>{description}</Card.Description>}
      </Card.Header>
    </Card>
  );
}
