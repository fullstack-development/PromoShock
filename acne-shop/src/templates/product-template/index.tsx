import Image from "next/image";
import type { FC } from "react";
import { Suspense } from "react";

import { BuyButton } from "@acne-shop/components";
import { calculatePercent } from "@acne-shop/shared/utils";

import classes from "./product-template.module.scss";

type Props = {
  productId: string;
};

const getProductMock = async (): Promise<{
  name: string;
  description: string;
  price: number;
  image: string;
  discount?: number;
}> => ({
  name: "Turbo chair",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  price: 3000,
  image: "https://via.placeholder.com/300x300",
  discount: 10,
});

const Component: FC<Props> = async ({ productId }) => {
  const { name, description, price, discount, image } = await getProductMock();

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>{name}</h1>
      <p className={classes.description}>{description}</p>
      <p className={classes.priceBlock}>
        {discount ? (
          <>
            <span className={classes.price}>
              ${price - calculatePercent(discount, price)} (-{discount}%)
            </span>
            <s className={classes.oldPrice}>${price}</s>
          </>
        ) : (
          <span className={classes.price}>${price}</span>
        )}
      </p>
      <div className={classes.action}>
        <BuyButton productId={productId} size="large" theme="primary" />
      </div>
      <div className={classes.image}>
        <Image src={image} alt={name} fill sizes="50vw" priority />
      </div>
    </div>
  );
};

const Skeleton = () => "...Loading";

const ProductTemplate: FC<Props> = (props) => {
  return (
    <Suspense fallback={<Skeleton />}>{<Component {...props} />}</Suspense>
  );
};

export { ProductTemplate };
