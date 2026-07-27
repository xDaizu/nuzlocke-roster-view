import type { Pokemon } from "@/types/pokemon";
import SingleRowStatBars, { type StatLayoutProps } from "./stats/SingleRowStatBars";
import TwoRowStatBars from "./stats/TwoRowStatBars";

export type StatsLayout = "single-row" | "two-row";

interface StatBarsProps {
  base: Pokemon["base"];
  nature?: string;
  layout?: StatsLayout;
}

// Strategy map: each layout is a fully independent component: only the
// per-stat computation (nature-adjusted value, bar color) and the color hues for
// increase/decrease are shared (see ./stats/statHelpers).
const STAT_LAYOUT_STRATEGIES: Record<StatsLayout, React.FC<StatLayoutProps>> = {
  "single-row": SingleRowStatBars,
  "two-row": TwoRowStatBars,
};

const StatBars: React.FC<StatBarsProps> = ({ base, nature, layout = "single-row" }) => {
  const Strategy = STAT_LAYOUT_STRATEGIES[layout];
  return <Strategy base={base} nature={nature} />;
};

export default StatBars;
