import { RenderIcon } from "./RenderIcon";

interface ITitle {
  title: string;
  icon?: string;
}

export default function Title({ title, icon }: ITitle) {
  return (
    <h3 className="font-bold flex items-center gap-2">
      {icon && <RenderIcon icon={icon} />}
      {title}
    </h3>
  );
}
