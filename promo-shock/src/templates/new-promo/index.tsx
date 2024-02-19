"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import { useState } from "react";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { erc20Abi, formatUnits } from "viem";
import type { Address } from "viem";
import { estimateContractGas } from "viem/actions";
import { useClient, useConfig, useReadContracts } from "wagmi";

import {
  simulatePromoFactoryCreatePromo,
  useReadPromoFactoryGetPaymentTokenAddress,
  useReadPromoFactoryGetPromoCreationPrice,
  useWritePromoFactoryCreatePromo,
} from "@generated/wagmi";

import { withSwitchNetwork } from "@promo-shock/components";
import { withApprove } from "@promo-shock/components/tx-button/with-approve";
import { withBalanceCheck } from "@promo-shock/components/tx-button/with-balance-check";
import { useConfirmLeave } from "@promo-shock/services";
import {
  RangeDateField,
  TextArea,
  TextField,
  DynamicFieldset,
  ImageUploader,
  Button,
} from "@promo-shock/ui-kit";

import { errorMap } from "./errors";
import { writeMetadata } from "./mutations";
import classes from "./new-promo.module.scss";
import { formSchema } from "./schema";
import type { FormData } from "./types";

const TxButton = withApprove(withBalanceCheck(withSwitchNetwork(Button)));

const NewPromo: FC = () => {
  const config = useConfig();
  const client = useClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema, { errorMap }),
    defaultValues: {
      promo_stream_addresses: [{ value: "" as Address }],
    },
    shouldFocusError: false,
  });
  const createPromo = useWritePromoFactoryCreatePromo();
  const metadata = useMutation({
    mutationFn: writeMetadata,
  });
  const [estimatedGasForCreatePromo, setEstimatedGasForCreatePromo] =
    useState<bigint>();
  const streamAddresses = useWatch({
    control,
    name: "promo_stream_addresses",
  });
  const creationPrice = useReadPromoFactoryGetPromoCreationPrice({
    chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
  });
  const tokenAddress = useReadPromoFactoryGetPaymentTokenAddress({
    chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
  });
  const tokenInfo = useReadContracts({
    query: { staleTime: Infinity },
    contracts: [
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        address: tokenAddress.data,
        functionName: "decimals",
      },
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        address: tokenAddress.data,
        functionName: "symbol",
      },
    ],
  });

  useConfirmLeave(
    isDirty,
    "Are you sure you want to leave the page? Data is not saved",
  );

  const submitHandler: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    try {
      const metadataCid = await metadata.mutateAsync({
        name: data.promo_name,
        description: data.promo_description,
        image: data.promo_cover.originFileObj!,
        shopping_link: data.promo_shopping_link,
      });
      const args = [
        {
          startTime: BigInt(data.promo_sale_time[0].unix()),
          endTime: BigInt(data.promo_sale_time[1].unix()),
          promoAddr: process.env.NEXT_PUBLIC_BSC_PROMO_TOKEN_ADDRESS,
          streams: data.promo_stream_addresses.map((address) => address.value),
          description: data.promo_description,
        },
        `https://ipfs.io/ipfs/${metadataCid}`,
      ] as const;
      await Promise.all([
        createPromo.writeContractAsync({
          args,
          chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        }),
        (async () => {
          const simulatedCreateStream = await simulatePromoFactoryCreatePromo(
            config,
            {
              args,
              chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
            },
          );
          const estimatedGas =
            client &&
            (await estimateContractGas(client, simulatedCreateStream.request));
          setEstimatedGasForCreatePromo(estimatedGas);
        })(),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const [tokenDecimals, tokenSymbol] = tokenInfo.data || [];

  const creationPriceSum =
    typeof creationPrice.data !== "undefined"
      ? creationPrice.data * BigInt(streamAddresses.length)
      : undefined;

  const creationPriceSumString =
    typeof creationPriceSum !== "undefined" &&
    typeof tokenDecimals?.result !== "undefined" &&
    typeof tokenSymbol?.result !== "undefined"
      ? `${formatUnits(creationPriceSum, tokenDecimals.result)} ${
          tokenSymbol.result
        }`
      : undefined;

  const creationPriceString =
    typeof creationPrice.data !== "undefined" &&
    typeof tokenDecimals?.result !== "undefined" &&
    typeof tokenSymbol?.result !== "undefined"
      ? `${formatUnits(creationPrice.data, tokenDecimals.result)} ${
          tokenSymbol.result
        }`
      : undefined;

  const pending = createPromo.isPending || metadata.isPending;
  const loading =
    pending ||
    tokenInfo.isLoading ||
    creationPrice.isLoading ||
    tokenAddress.isLoading;

  return (
    <form className={classes.root} onSubmit={handleSubmit(submitHandler)}>
      <h1 className={classes.title}>New Promo</h1>
      <div className={classes.grid}>
        <div className={classNames(classes.column, classes.contents)}>
          <Controller<FormData, "promo_cover">
            name="promo_cover"
            control={control}
            render={({ field }) => (
              <div className={classNames(classes.col_1, classes.contents)}>
                <div />
                <ImageUploader
                  aspectRatio="416/307"
                  placeholder="Upload promo cover"
                  error={errors.promo_cover?.message}
                  disabled={pending}
                  {...field}
                />
              </div>
            )}
          />
          <Controller<FormData, "promo_name">
            name="promo_name"
            control={control}
            render={({ field }) => (
              <TextField
                label="Promo name:"
                placeholder="Study with the HARVARD STUDY"
                className={classNames(classes.col_1, classes.contents)}
                error={errors.promo_name?.message}
                disabled={pending}
                {...field}
              />
            )}
          />
          <Controller<FormData, "promo_description">
            name="promo_description"
            control={control}
            render={({ field }) => (
              <TextArea
                label="More about:"
                className={classNames(classes.col_1, classes.contents)}
                placeholder="Description. E.g. stream about the importance of renaissance art from the Master of Art Michelangelo Buonarroti"
                maxLength={100}
                error={errors.promo_description?.message}
                disabled={pending}
                {...field}
              />
            )}
          />
          <Controller<FormData, "promo_shopping_link">
            name="promo_shopping_link"
            control={control}
            render={({ field }) => (
              <TextField
                label="Link to shopping:"
                placeholder="heretowatch.com"
                className={classNames(classes.col_1, classes.contents)}
                error={errors.promo_shopping_link?.message}
                disabled={pending}
                {...field}
              />
            )}
          />
          <Controller<FormData, "promo_sale_time">
            name="promo_sale_time"
            control={control}
            render={({ field }) => (
              <RangeDateField
                label="Promotional period"
                className={classNames(classes.col_1, classes.contents)}
                placeholder={["13.12.2024", "24.12.2042"]}
                error={errors.promo_sale_time?.message}
                disabled={pending}
                {...field}
              />
            )}
          />
        </div>

        <div className={classNames(classes.column, classes.contents)}>
          <div className={classes.col_2}>
            <span className={classes.caption}>
              Your promotion will be targeted to these addresses. You can enter
              one or more addresses.
            </span>

            <DynamicFieldset<FormData, "promo_stream_addresses">
              control={control}
              labelPosition="top"
              label="Smart contract address:"
              placeholder="x43djvnprjvfbo2ei2e2e"
              name="promo_stream_addresses"
              errors={errors.promo_stream_addresses?.map?.(
                (error) => error?.value?.message,
              )}
              disabled={pending}
              caption={creationPriceString && `+${creationPriceString}`}
            />
          </div>
        </div>
      </div>

      <div className={classes.action}>
        <TxButton
          type="submit"
          text={`Pay ${creationPriceSumString} and create promo`}
          size="large"
          theme="secondary"
          loading={loading}
          estimatedGas={estimatedGasForCreatePromo}
          tokenAddress={tokenAddress.data}
          tokenAmount={creationPriceSum}
          recipientAddress={process.env.NEXT_PUBLIC_BSC_PROMO_FACTORY_ADDRESS}
        />
      </div>
    </form>
  );
};

export { NewPromo };