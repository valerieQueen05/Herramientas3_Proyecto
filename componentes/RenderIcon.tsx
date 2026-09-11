import { TfiCup } from "react-icons/tfi";
import { GoArrowUpRight } from "react-icons/go";
import { PiCurrencyDollar, PiTrophy, PiTrendUp } from "react-icons/pi";
import {
  MdOutlineCheckCircle,
  MdOutlineAccessTime,
  MdOutlineCancel,
  MdOutlineAssignment,
} from "react-icons/md";

export const RenderIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "cup":
      return <TfiCup />;
    case "arrowUp":
      return <GoArrowUpRight />;
    case "dollar":
      return <PiCurrencyDollar />;
    case "check":
      return <MdOutlineCheckCircle />;
    case "clock":
      return <MdOutlineAccessTime />;
    case "xCircle":
      return <MdOutlineCancel />;
    case "assignment":
      return <MdOutlineAssignment />;
    case "trophy":
      return <PiTrophy />;
    case "trend":
      return <PiTrendUp />;
    default:
      return null;
  }
};