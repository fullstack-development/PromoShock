"use client";
import classNames from "classnames";
import Image from "next/image";
import type { FC } from "react";
import { Suspense, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { Address } from "viem";
import type { Config } from "wagmi";
import { useAccount, useConfig } from "wagmi";

import { BuyButton } from "@acne-shop/components";
import { calculatePercent } from "@acne-shop/shared/utils";
import { Button } from "@acne-shop/ui-kit";
import { TextField } from "@acne-shop/ui-kit/form";

import styles from "./product-template.module.scss";
import {
  readTicketBalanceOf,
  readTicketGetAvailablePromotions,
} from "../../../generated/wagmi";

type Props = {
  productId: string;
};

type FormData = {
  ticket_address: string;
};

const getProductMock = (): {
  name: string;
  description: string;
  price: number;
  image: string;
  discount?: number | undefined;
} => ({
  name: "Turbo chair",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  price: 3000,
  image: "https://via.placeholder.com/300x300",
});

const PRODUCT_PROMOTION_MOCK = "0x0D790354b7887791df6dB035808ED8Fe4b41BE47";
const DISCOUNT_PROMOTION_MOCK = 10;

const getProductDiscount = async (
  account: Address,
  config: Config,
  ticketAddress: `0x${string}` | null,
) => {
  if (!ticketAddress) {
    return { discount: 0 };
  }
  try {
    const isUserOwner = await readTicketBalanceOf(config, {
      account: account,
      address: ticketAddress,
      args: [account],
    });
    if (isUserOwner === BigInt(0)) {
      return { error: "You are not owner of this ticket" };
    }
  } catch {
    return { error: "Please, enter correct ticket address" };
  }

  const allPromotions = await readTicketGetAvailablePromotions(config, {
    address: ticketAddress,
    args: [process.env.NEXT_PUBLIC_BSC_PROMO_FACTORY_ADDRESS],
  });

  const isProductHasDiscount = allPromotions?.some(
    ({ promoAddr }) =>
      promoAddr.toLowerCase() === PRODUCT_PROMOTION_MOCK.toLowerCase(),
  );

  return {
    discount: isProductHasDiscount ? DISCOUNT_PROMOTION_MOCK : 0,
    error: isProductHasDiscount
      ? ""
      : "Sorry your ticket doesn't apply discount for this product",
  };
};

const Component: FC<Props> = ({ productId }) => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      ticket_address: "",
    },
    shouldFocusError: false,
  });

  const ticketAddress = useWatch({
    control,
    name: "ticket_address",
  });

  const [discount, setDiscount] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const account = useAccount();
  const config = useConfig();

  const submitHandler: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    setPending(true);
    const result =
      account.address &&
      (await getProductDiscount(
        account.address,
        config,
        data.ticket_address as `0x${string}`,
      ));

    setDiscount(result?.discount || 0);
    setError(result?.error);

    setPending(false);
  };

  const { name, description, price, image } = getProductMock();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{name}</h1>
      <p className={styles.description}>{description}</p>
      <p className={styles.priceBlock}>
        {discount ? (
          <>
            <span className={styles.price}>
              ${price - calculatePercent(discount, price)} (-{discount}%)
            </span>
            <s className={styles.oldPrice}>${price}</s>
          </>
        ) : (
          <span className={styles.price}>${price}</span>
        )}
      </p>
      <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
        <p>Ticket address</p>
        <Controller<FormData, "ticket_address">
          name="ticket_address"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Your ticket contract address"
              className={classNames(styles.textField)}
              error={error}
              disabled={pending || !account.address}
              {...field}
            />
          )}
        />

        <div>
          <Button
            text="Apply"
            type="submit"
            loading={pending}
            disabled={
              ticketAddress.length !== 42 ||
              !ticketAddress.includes("0x") ||
              !account.address
            }
          />
        </div>
      </form>

      <div className={styles.action}>
        <BuyButton productId={productId} size="large" theme="primary" />
      </div>
      <div className={styles.image}>
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
