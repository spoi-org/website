import { ComponentProps } from "react";

export interface RatingProps extends ComponentProps<"div"> {
  rating: number;
}

const rankToColor: Record<number, string> = {
  0: "gray",
  1200: "green",
  1400: "#03a89e",
  1600: "rgb(29 78 216)",
  1900: "#a0a",
  2100: "#f08400",
  2400: "red"
}

export function Rating({ rating, ...props }: RatingProps) {
  let color = rankToColor[0];
  let last = rankToColor[0];
  for (const key in rankToColor) {
    if (rating < parseInt(key)) {
      color = rankToColor[last as any];
      break;
    }
    last = key;
  }
  if (rating >= 2400) {
    color = rankToColor[2400];
  }
  return (
    <span style={{color}} {...props}>
      {rating}
    </span>
  )
}