import type { HTMLAttributes, ReactNode } from "react";

type TexturePanelProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "section" | "article" | "div";
  texture?: "wood" | "stone" | "obsidian" | "book" | "emerald" | "deepslate";
};

export function TexturePanel({
  children,
  as: Tag = "section",
  texture = "wood",
  className = "",
  ...rest
}: TexturePanelProps) {
  return (
    <Tag className={`texture-panel texture-panel--${texture} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
