import { items } from "../assets/minecraft";
import { MinecraftButton } from "./MinecraftButton";

export function VillagerTradeCard({
  title,
  detail,
  href,
  action,
}: {
  title: string;
  detail: string;
  href: string;
  action: string;
}) {
  return (
    <article className="trade-card">
      <div className="trade-card__slot">
        <img src={items.emerald} alt="" aria-hidden="true" />
        <span>Opportunity</span>
      </div>
      <div className="trade-card__arrow" aria-hidden="true">=</div>
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
        <MinecraftButton href={href} variant="emerald">
          {action}
        </MinecraftButton>
      </div>
    </article>
  );
}
