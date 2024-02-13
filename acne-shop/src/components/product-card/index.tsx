"use client";
import { Card } from "antd";
import Image from "next/image";
import type { FC } from "react";

import { calculatePercent } from "@acne-shop/shared/utils";
import { Link } from "@acne-shop/ui-kit";

import classes from "./product-card.module.scss";
import { BuyButton } from "../buy-button";

type Props = {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
};

const ProductCard: FC<Props> = ({ id, name, price, image, discount }) => {
  return (
    <Card className={classes.root} hoverable>
      <div className={classes.wrap}>
        <div className={classes.content}>
          <div className={classes.image}>
            <Image src={image} alt={name} fill sizes="33vw" />
          </div>
          <h3 className={classes.title}>{name}</h3>
          <p className={classes.priceBlock}>
            {discount ? (
              <>
                <span className={classes.price}>
                  ${price - calculatePercent(discount, price)} (-{discount}%)
                </span>
                <s className={classes.priceOld}>${price}</s>
              </>
            ) : (
              <span className={classes.price}>${price}</span>
            )}
          </p>
        </div>
        <div className={classes.action}>
          <BuyButton productId={id} size="large" theme="primary" />
        </div>

        <Link href={`/product/${id}`} className={classes.link}></Link>
      </div>
    </Card>
  );
};

export { ProductCard };
