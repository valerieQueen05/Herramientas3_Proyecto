interface CampoErrorProps {
  mensaje?: string;
}

export default function CampoError({ mensaje }: CampoErrorProps) {
  if (!mensaje) return null;
  return <p className="mt-1 text-xs text-red-500">{mensaje}</p>;
}
