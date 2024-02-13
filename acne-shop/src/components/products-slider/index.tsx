import type { ComponentProps, FC } from "react";

import classes from "./products-slider.module.scss";
import { ProductCard } from "../product-card";

type Props = {
  items: Array<ComponentProps<typeof ProductCard>>;
};

const ProductsSlider: FC<Props> = ({ items }) => {
  return (
    <ul className={classes.root}>
      {items.map((product) => (
        <li key={product.id}>
          <ProductCard {...product} />
        </li>
      ))}
    </ul>
  );
};

export { ProductsSlider };
