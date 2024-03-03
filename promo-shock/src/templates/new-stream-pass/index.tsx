"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { erc20Abi, parseUnits } from "viem";
import { estimateContractGas } from "viem/actions";
import { useAccount, useClient, useConfig, useReadContract } from "wagmi";

import {
  simulateTicketFactoryCreateTicketSale,
  useWatchTicketFactoryTicketSaleCreatedEvent,
  useWriteTicketFactoryCreateTicketSale,
} from "@generated/wagmi";

import {
  withBalanceCheck,
  withConnect,
  withSwitchNetwork,
} from "@promo-shock/components";
// import { api } from "@promo-shock/configs/axios";
import { apiClient } from "@promo-shock/configs/api";
import { useConfirmLeave, useSuccessMessage } from "@promo-shock/services";
import { useCmdCtrlPressed } from "@promo-shock/shared/hooks";
import {
  Button,
  DateField,
  ImageUploader,
  NumberField,
  RangeDateField,
  RangeTimeField,
  TextArea,
  TextField,
} from "@promo-shock/ui-kit";

import { writeMetadata } from "./mutations";
import classes from "./new-stream-pass.module.scss";
import { formSchema } from "./schema";
import type { FormData } from "./types";

const TxButton = withBalanceCheck(withSwitchNetwork(withConnect(Button)));

const NewStreamPass: FC = () => {
  const showSuccessMessage = useSuccessMessage();
  const showErrorMessage = useSuccessMessage();
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    shouldFocusError: false,
  });
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const config = useConfig();
  const client = useClient();
  const account = useAccount();
  const metadata = useMutation({
    mutationFn: writeMetadata,
  });
  const createStream = useWriteTicketFactoryCreateTicketSale();
  const [estimatedGasForCreateStream, setEstimatedGasForCreateStream] =
    useState<bigint>();

  const tokenDecimals = useReadContract({
    chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
    abi: erc20Abi,
    address: process.env.NEXT_PUBLIC_BSC_PAYMENT_TOKEN_ADDRESS,
    functionName: "decimals",
    query: {
      staleTime: Infinity,
    },
  });
  const isCmdCtrlPressed = useCmdCtrlPressed();

  useConfirmLeave(
    isDirty && !isCmdCtrlPressed,
    "Are you sure you want to leave the page? Data is not saved",
  );

  useWatchTicketFactoryTicketSaleCreatedEvent({
    args: { creator: account.address },
    onLogs:
      account.address && pending
        ? async (logs) => {
            const [log] = logs;
            router.push(
              `/streams?highlight_address=${log?.args?.ticketSaleAddr?.toLowerCase()}&filters=owner`,
            );
            showSuccessMessage(
              "Congratulations! Your stream pass has been created and will be available for everyone to enjoy soon.",
            );
            try {
              return apiClient.index_ticket_index_ticket_post(undefined, {
                queries: {
                  from_block: Number(log.blockNumber) - 50,
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
    const metadataCid = await metadata
      .mutateAsync({
        name: data.stream_name,
        description: data.stream_description,
        start_time: data.stream_date
          .set("hour", data.stream_time[0].hour())
          .set("minute", data.stream_time[0].minute())
          .set("second", data.stream_time[0].second())
          .utc(false)
          .unix(),
        end_time: data.stream_date
          .set("hour", data.stream_time[1].hour())
          .set("minute", data.stream_time[1].minute())
          .set("second", data.stream_time[1].second())
          .utc(false)
          .unix(),
        stream_link: data.stream_link,
        streamer_link: data.streamer_link,
        image: data.stream_image.originFileObj!,
        banner: data.stream_banner.originFileObj!,
      })
      .catch(() => {
        showErrorMessage("Failed to upload metadata");
        setPending(false);
      });
    const now = dayjs();
    const args = [
      {
        startTime: BigInt(
          data.stream_sale_time[0].isBefore(now)
            ? now.utc(false).add(5, "minute").unix()
            : data.stream_sale_time[0].utc(false).unix(),
        ),
        endTime: BigInt(data.stream_sale_time[1].utc(false).unix()),
        price: parseUnits(data.stream_price.toString(), tokenDecimals.data!),
        paymentToken: process.env.NEXT_PUBLIC_BSC_PAYMENT_TOKEN_ADDRESS,
      },
      {
        name: data.stream_name,
        symbol: data.stream_symbol,
        baseUri: `https://ipfs.io/ipfs/${metadataCid}`,
        cap: data.stream_cap,
      },
    ] as const;
    await Promise.all([
      createStream.writeContractAsync({
        args,
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
      }),
      (async () => {
        const simulatedCreateStream =
          await simulateTicketFactoryCreateTicketSale(config, {
            args,
            chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
          });
        const estimatedGas =
          client &&
          (await estimateContractGas(client, simulatedCreateStream.request));
        setEstimatedGasForCreateStream(estimatedGas);
      })(),
    ]).catch(() => {
      showErrorMessage("Failed to create stream");
      setPending(false);
    });
  };

  const loading = tokenDecimals.isLoading || pending;

  return (
    <form className={classes.root} onSubmit={handleSubmit(submitHandler)}>
      <h1 className={classes.title}>New stream pass</h1>
      <div className={classes.grid}>
        <div className={classNames(classes.column, classes.contents)}>
          <Controller<FormData, "stream_banner">
            name="stream_banner"
            control={control}
            render={({ field }) => (
              <div className={classNames(classes.col_1, classes.contents)}>
                <div />
                <ImageUploader
                  {...field}
                  disabled={pending}
                  aspectRatio="416/307"
                  error={errors.stream_banner?.message}
                  placeholder="Upload banner"
                  accept="image/jpeg, image/png"
                />
              </div>
            )}
          />
          <Controller<FormData, "stream_name">
            name="stream_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={pending}
                className={classNames(classes.col_1, classes.contents)}
                label="Stream name:"
                placeholder="Study with the HARVARD STUDY"
                error={errors.stream_name?.message}
              />
            )}
          />
          <Controller<FormData, "stream_description">
            name="stream_description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                disabled={pending}
                className={classNames(classes.col_1, classes.contents)}
                label="More about:"
                placeholder="Description. E.g. stream about the importance of renaissance art from the Master of Art Michelangelo Buonarroti"
                maxLength={100}
                error={errors.stream_description?.message}
              />
            )}
          />
          <div
            className={classNames(
              classes.link_row,
              classes.contents,
              classes.with_separator,
            )}
          >
            <Controller<FormData, "stream_link">
              name="stream_link"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={pending}
                  className={classNames(classes.col_1, classes.contents)}
                  label="Link to watch stream:"
                  placeholder="https://promoshock.metalamp.io/"
                  error={errors.stream_link?.message}
                />
              )}
            />
          </div>

          <div className={classNames(classes.date_row, classes.contents)}>
            <Controller<FormData, "stream_date">
              name="stream_date"
              control={control}
              render={({ field }) => (
                <DateField
                  {...field}
                  disabled={pending}
                  className={classNames(classes.col_1, classes.contents)}
                  label="Date to watch:"
                  error={errors.stream_date?.message}
                />
              )}
            />
          </div>
          <div
            className={classNames(
              classes.time_row,
              classes.contents,
              classes.with_separator,
            )}
          >
            <Controller<FormData, "stream_time">
              name="stream_time"
              control={control}
              render={({ field }) => (
                <RangeTimeField
                  {...field}
                  disabled={pending}
                  className={classNames(classes.col_1, classes.contents)}
                  label="Time to watch:"
                  suffixIcon="UTC time zone"
                  error={errors.stream_time?.message}
                />
              )}
            />
          </div>
          <div
            className={classNames(
              classes.price_row,
              classes.contents,
              classes.with_separator,
            )}
          >
            <Controller<FormData, "stream_cap">
              name="stream_cap"
              control={control}
              render={({ field }) => (
                <NumberField
                  {...field}
                  disabled={pending}
                  className={classes.contents}
                  label="Passes amount:"
                  placeholder="100"
                  min={0}
                  error={errors.stream_cap?.message}
                />
              )}
            />
            <Controller<FormData, "stream_price">
              name="stream_price"
              control={control}
              render={({ field }) => (
                <NumberField
                  {...field}
                  disabled={pending}
                  label="Price for each pass:"
                  placeholder="100"
                  suffix="USDT"
                  min={0}
                  max={10 ** 6}
                  error={errors.stream_price?.message}
                />
              )}
            />
          </div>
          <Controller<FormData, "stream_sale_time">
            name="stream_sale_time"
            control={control}
            render={({ field }) => (
              <RangeDateField
                {...field}
                disabled={pending}
                className={classNames(classes.col_1, classes.contents)}
                label="Selling passes period:"
                error={errors.stream_sale_time?.message}
              />
            )}
          />
          <Controller<FormData, "streamer_link">
            name="streamer_link"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={pending}
                className={classNames(classes.col_1, classes.contents)}
                label="Link to follow you:"
                placeholder="https://promoshock.metalamp.io/"
                error={errors.streamer_link?.message}
              />
            )}
          />
        </div>

        <div className={classNames(classes.column, classes.contents)}>
          <Controller<FormData, "stream_image">
            name="stream_image"
            control={control}
            render={({ field }) => (
              <div className={classNames(classes.col_2, classes.contents)}>
                <div />
                <ImageUploader
                  {...field}
                  disabled={pending}
                  error={errors.stream_image?.message}
                  aspectRatio="416/307"
                  placeholder="Upload NFT image"
                  accept="image/jpeg, image/png"
                />
              </div>
            )}
          />
          <Controller<FormData, "stream_symbol">
            name="stream_symbol"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={pending}
                className={classNames(classes.col_2, classes.contents)}
                label="NFT name:"
                placeholder="Study with the HARVARD STUDY"
                error={errors.stream_symbol?.message}
              />
            )}
          />
        </div>
      </div>

      <div className={classes.action}>
        <TxButton
          type="submit"
          text="Drop the pass"
          size="large"
          theme="secondary"
          loading={loading}
          estimatedGas={estimatedGasForCreateStream}
        />
      </div>
    </form>
  );
};

export { NewStreamPass };
