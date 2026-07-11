import type { ReactNode } from "react";

export function SignBoard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="sign-board">
      {title ? <h2>{title}</h2> : null}
      <div>{children}</div>
    </div>
  );
}
