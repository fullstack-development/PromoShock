import { Suspense } from "react";
import type { ComponentProps, FC } from "react";

import type { ProductCard } from "@acne-shop/components";
import { ProductsSlider } from "@acne-shop/components";

import classes from "./recommended-template.module.scss";

type Props = {
  title?: string;
  productId: string;
};

const getProductsMock = async (): Promise<
  ComponentProps<typeof ProductCard>[]
> => [
  {
    id: "1",
    name: "Turbo chair",
    price: 3000,
    image: "https://via.placeholder.com/300x300",
    discount: 10,
  },
  {
    id: "2",
    name: "Super table",
    price: 2000,
    image: "https://via.placeholder.com/300x300",
  },
  {
    id: "3",
    name: "Mega bed",
    price: 4000,
    image: "https://via.placeholder.com/300x300",
    discount: 20,
  },
  {
    id: "4",
    name: "Awesome shelf",
    price: 1000,
    image: "https://via.placeholder.com/300x300",
  },
  {
    id: "5",
    name: "Cool lamp",
    price: 500,
    image: "https://via.placeholder.com/300x300",
  },
];

const Component: FC<Props> = async () => {
  const products = await getProductsMock();
  return <ProductsSlider items={products} />;
};

const Skeleton: FC = () => "Loading...";

const RecommendedTemplate: FC<Props> = ({
  title = "Recommended products",
  productId,
}) => {
  return (
    <section className={classes.root}>
      <h3 className={classes.title}>{title}</h3>
      <Suspense fallback={<Skeleton />}>
        <Component productId={productId} />
      </Suspense>
    </section>
  );
};

export { RecommendedTemplate };
