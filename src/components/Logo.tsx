import logoSrc from "@/assets/Logo.svg";

const Logo = () => {
  return (
    <img
      src={logoSrc}
      alt="Project Runner logo"
      className="h-12 w-auto"
      loading="lazy"
    />
  );
};

export default Logo;
