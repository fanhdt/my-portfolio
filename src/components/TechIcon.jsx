import { SiHtml5, SiCss, SiJavascript, SiPhp, SiLaravel, SiVuedotjs, SiReact, SiNextdotjs, SiPostgresql, SiUnity, SiDocker, SiMinio, SiMongodb, SiExpress, SiNodedotjs } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { Glasses } from "lucide-react";

const ICONS = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  php: SiPhp,
  mongodb: SiMongodb,
  express: SiExpress,
  "node.js": SiNodedotjs,
  laravel: SiLaravel,
  vue: SiVuedotjs,
  react: SiReact,
  "next.js": SiNextdotjs,
  postgresql: SiPostgresql,
  "react native": SiReact,
  unity: SiUnity,
  "c#": TbBrandCSharp,
  vr: Glasses,
  docker: SiDocker,
  minio: SiMinio,
};

const TechIcon = ({ name, className = "size-5" }) => {
  const Icon = ICONS[name.toLowerCase()];

  if (!Icon) {
    return (
      <span aria-hidden className="font-display text-[10px] uppercase">
        {name.replace(/[^A-Za-z#]/g, "").slice(0, 2)}
      </span>
    );
  }
  return <Icon aria-hidden className={className} />;
};

export default TechIcon;
