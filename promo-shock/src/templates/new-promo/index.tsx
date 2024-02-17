"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useState } from "react";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { formatUnits } from "viem";
import type { Address } from "viem";
import { estimateContractGas } from "viem/actions";
import { useClient, useConfig, useWaitForTransactionReceipt } from "wagmi";

import { simulatePromoFactoryCreatePromo } from "@generated/wagmi";

import { TxButton } from "@promo-shock/components";
import { useConfirmLeave } from "@promo-shock/services";
import {
  RangeDateField,
  TextArea,
  TextField,
  DynamicFieldset,
  ImageUploader,
} from "@promo-shock/ui-kit";

import { errorMap } from "./errors";
import { useCreatePromo, usePaymentInfo, useWriteMetadata } from "./hooks";
import classes from "./new-promo.module.scss";
import { formSchema } from "./schema";
import type { FormData } from "./types";

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
  const createPromo = useCreatePromo();
  const writeMetadata = useWriteMetadata();
  const [estimatedGasForCreatePromo, setEstimatedGasForCreatePromo] =
    useState<bigint>();
  const streamAddresses = useWatch({
    control,
    name: "promo_stream_addresses",
  });
  const transactionReceipt = useWaitForTransactionReceipt({
    hash: createPromo.data,
  });
  const [creationPrice, tokenInfo, tokenAddress] = usePaymentInfo();

  useConfirmLeave(
    isDirty,
    "Are you sure you want to leave the page? Data is not saved",
  );

  const submitHandler: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    try {
      const metadataCid = await writeMetadata.mutateAsync({
        name: data.promo_name,
        description: data.promo_description,
        image: data.promo_cover.originFileObj!,
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
        }),
        (async () => {
          const simulatedCreateStream = await simulatePromoFactoryCreatePromo(
            config,
            { args },
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

  const creationPriceSum =
    typeof creationPrice.data !== "undefined"
      ? creationPrice.data * BigInt(streamAddresses.length)
      : undefined;

  const creationPriceSumString =
    typeof creationPriceSum !== "undefined" &&
    typeof tokenInfo.data?.[0].result !== "undefined" &&
    typeof tokenInfo.data?.[1].result !== "undefined"
      ? `${formatUnits(creationPriceSum, tokenInfo.data[0].result)} ${
          tokenInfo.data[1].result
        }`
      : undefined;

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
                label="Promo name"
                placeholder="Study with the HARVARD STUDY"
                className={classNames(classes.col_1, classes.contents)}
                error={errors.promo_name?.message}
                {...field}
              />
            )}
          />
          <Controller<FormData, "promo_description">
            name="promo_description"
            control={control}
            render={({ field }) => (
              <TextArea
                label="More about"
                className={classNames(classes.col_1, classes.contents)}
                placeholder="Description. E.g. stream about the importance of renaissance art from the Master of Art Michelangelo Buonarroti"
                maxLength={100}
                error={errors.promo_description?.message}
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
              label="Smart contract address"
              placeholder="x43djvnprjvfbo2ei2e2e"
              name="promo_stream_addresses"
              errors={errors.promo_stream_addresses?.map?.(
                (error) => error?.value?.message,
              )}
            />
          </div>
        </div>
      </div>

      <div className={classes.action}>
        <TxButton
          type="submit"
          text={`Pay ${creationPriceSumString} and create promo`}
          loading={
            createPromo.isPending ||
            writeMetadata.isPending ||
            transactionReceipt.isFetching ||
            tokenInfo.isLoading ||
            creationPrice.isLoading ||
            tokenAddress.isLoading
          }
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
