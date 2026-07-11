import { motion } from "framer-motion";
import type { MouseEventHandler, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "wood" | "emerald" | "diamond" | "portal" | "ghost";
  icon?: string;
  className?: string;
};

type ButtonProps = CommonProps & {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type AnchorProps = CommonProps & {
  href: string;
};

export function MinecraftButton(props: ButtonProps | AnchorProps) {
  const { children, variant = "wood", icon, className = "" } = props;
  const classes = `minecraft-button minecraft-button--${variant} ${className}`;

  const content = (
    <>
      {icon ? <img src={icon} alt="" aria-hidden="true" /> : null}
      <span>{children}</span>
    </>
  );

  if (typeof props.href === "string") {
    return (
      <motion.a
        whileHover={{ y: -2 }}
        whileTap={{ y: 1 }}
        className={classes}
        href={props.href}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        rel={props.href.startsWith("http") ? "noreferrer" : undefined}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 1 }}
      className={classes}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type ?? "button"}
    >
      {content}
    </motion.button>
  );
}
