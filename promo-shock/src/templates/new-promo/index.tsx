"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { erc20Abi, formatUnits } from "viem";
import type { Address } from "viem";
import { estimateContractGas } from "viem/actions";
import { useAccount, useClient, useConfig, useReadContracts } from "wagmi";

import {
  simulatePromoFactoryCreatePromo,
  useReadPromoFactoryGetPaymentTokenAddress,
  useReadPromoFactoryGetPromoCreationPrice,
  useWatchPromoFactoryPromotionCreatedEvent,
  useWritePromoFactoryCreatePromo,
} from "@generated/wagmi";

import { withConnect, withSwitchNetwork } from "@promo-shock/components";
import { withApprove } from "@promo-shock/components/tx-button/with-approve";
import { withBalanceCheck } from "@promo-shock/components/tx-button/with-balance-check";
// import { api } from "@promo-shock/configs/axios";
import { apiClient } from "@promo-shock/configs/api";
import { useConfirmLeave, useSuccessMessage } from "@promo-shock/services";
import {
  RangeDateField,
  TextArea,
  TextField,
  DynamicFieldset,
  ImageUploader,
  Button,
  TextLink,
} from "@promo-shock/ui-kit";

import { writeMetadata } from "./mutations";
import { NewPromoOnboarding } from "./new-promo-onboarding";
import classes from "./new-promo.module.scss";
import { formSchema } from "./schema";
import type { FormData } from "./types";

const TxButton = withApprove(
  withBalanceCheck(withSwitchNetwork(withConnect(Button))),
);

const NewPromo: FC = () => {
  const [startOnboarding, setStartOnboarding] = useState(false);
  const actionButtonElRef = useRef<HTMLButtonElement | null>(null);
  const addressesElRef = useRef<HTMLDivElement | null>(null);
  const addMoreElRef = useRef<HTMLButtonElement | null>(null);
  const fieldsElRef = useRef<HTMLDivElement | null>(null);
  const showSuccessMessage = useSuccessMessage();
  const router = useRouter();
  const account = useAccount();
  const config = useConfig();
  const client = useClient();
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promo_stream_addresses: [{ value: "" as Address }],
    },
    mode: "onChange",
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
  const [pending, setPending] = useState(false);

  useConfirmLeave(
    isDirty,
    "Are you sure you want to leave the page? Data is not saved",
  );

  useWatchPromoFactoryPromotionCreatedEvent({
    args: { marketer: account.address },
    onLogs:
      account.address && pending
        ? async (logs) => {
            const [log] = logs;
            router.push(
              `/streams?highlight_address=${log?.args?.promotion?.promoAddr?.toLowerCase()}&filters=owner`,
            );
            showSuccessMessage(
              "Congratulations! Your promo has been successfully created and will be listed shortly.",
            );

            try {
              return apiClient.index_promo_index_promo_post(undefined, {
                queries: {
                  from_block: Number(log.blockNumber) - 5,
                  to_block: Number(log.blockNumber),
                },
              });
            } catch {}
          }
        : undefined,
  });

  const submitHandler: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    setPending(true);
    try {
      const metadataCid = await metadata.mutateAsync({
        name: data.promo_name,
        description: data.promo_description,
        image: data.promo_cover.originFileObj!,
        shopping_link: data.promo_shopping_link,
      });
      const now = dayjs();
      const args = [
        {
          startTime: BigInt(
            data.promo_sale_time[0].isBefore(now)
              ? now.add(5, "minute").utc(false).unix()
              : data.promo_sale_time[0].utc(false).unix(),
          ),
          endTime: BigInt(data.promo_sale_time[1].utc(false).unix()),
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
      setPending(false);
      console.error(error);
    }
  };

  const handleStartOnboarding = () => {
    setStartOnboarding(true);
  };

  const handleStopOnboarding = () => {
    setStartOnboarding(false);
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

  const loading =
    pending ||
    tokenInfo.isLoading ||
    creationPrice.isLoading ||
    tokenAddress.isLoading;

  return (
    <>
      <NewPromoOnboarding
        actionButtonElRef={actionButtonElRef}
        addMoreElRef={addMoreElRef}
        addressesElRef={addressesElRef}
        fieldsElRef={fieldsElRef}
        creationPriceString={creationPriceString}
        open={startOnboarding}
        onClose={handleStopOnboarding}
      />
      <form className={classes.root} onSubmit={handleSubmit(submitHandler)}>
        <h1 className={classes.title}>New Promo</h1>
        <span className={classes.description}>
          Target multiple stream viewers with a single ad without needing users
          wallet address. Just drop the promo. Users will visit your shop,
          connect their wallet, and make purchases — voilà.{" "}
          <button type="button" onClick={handleStartOnboarding}>
            More
          </button>
          .
        </span>
        <div className={classes.grid}>
          <div
            className={classNames(classes.column, classes.column_1)}
            ref={fieldsElRef}
          >
            <Controller<FormData, "promo_cover">
              name="promo_cover"
              control={control}
              render={({ field }) => (
                <div className={classes.column_1_field}>
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
                  className={classes.column_1_field}
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
                  className={classes.column_1_field}
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
                  className={classes.column_1_field}
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
                  className={classes.column_1_field}
                  placeholder={["13.12.2024", "24.12.2042"]}
                  error={errors.promo_sale_time?.message}
                  disabled={pending}
                  {...field}
                />
              )}
            />
          </div>

          <div
            className={classNames(
              classes.column,
              classes.column_2,
              classes.gap,
            )}
            ref={addressesElRef}
          >
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
              addMoreText="Add address"
              addMoreTooltipContent={
                <span>
                  For targeted promos, just enter the stream ticket address your
                  audience hit up. Hover over the stream, click &quot;Copy
                  ticket address&quot;, and paste it here. All streams are
                  listed on{" "}
                  <TextLink
                    className={classes.thisLink}
                    title="this"
                    external
                    href="/streams?filters=all"
                  />{" "}
                  page.
                </span>
              }
              addMoreCaption={creationPriceString && `+${creationPriceString}`}
              uploadCSVTooltipContent="Next version: easy-peasy address upload from a CSV file!"
              errors={errors.promo_stream_addresses?.map?.(
                (error) => error?.value?.message,
              )}
              addMoreRef={addMoreElRef}
              disabled={pending}
            />
          </div>
        </div>

        <div className={classes.action}>
          <TxButton
            ref={actionButtonElRef}
            type="submit"
            text={`Pay ${creationPriceSumString} and create promo`}
            size="large"
            theme="secondary"
            loading={loading}
            estimatedGas={estimatedGasForCreatePromo}
            tokenAddress={tokenAddress.data}
            tokenAmount={creationPriceSum}
            recipientAddress={process.env.NEXT_PUBLIC_BSC_PROMO_FACTORY_ADDRESS}
            formTrigger={trigger}
          />
        </div>
      </form>
    </>
  );
};

export { NewPromo };
