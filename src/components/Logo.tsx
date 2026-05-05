import logoSrc from "@/assets/Logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <img
      src={logoSrc}
      alt="Project Runner logo"
      className={cn("h-12 w-auto", className)}
      loading="lazy"
    />
  );
};

export default Logo;
