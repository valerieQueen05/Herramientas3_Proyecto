import { TfiCup } from "react-icons/tfi";
import { GoArrowUpRight } from "react-icons/go";
import { PiCurrencyDollar } from "react-icons/pi";
import { MdOutlineCheckCircle } from "react-icons/md";

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
    default:
      return null;
  }
};
