"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { useAccount } from "wagmi";

import { useIsMounted } from "@promo-shock/shared/hooks";
import { readFileAsDataURL } from "@promo-shock/shared/utils";
import {
  Button,
  DateField,
  ImageUploader,
  NumberField,
  RangeDateField,
  TextArea,
  TextField,
  TimeField,
} from "@promo-shock/ui-kit";

import { errorMap } from "./errors";
import { useCreateStream, useWriteMetadata } from "./hooks";
import classes from "./new-stream-pass.module.scss";
import { formSchema } from "./schema";
import type { FormData } from "./types";

const NewStreamPass: FC = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema, {
      errorMap,
    }),
    shouldFocusError: false,
  });
  const account = useAccount();
  const metadata = useWriteMetadata();
  const createStream = useCreateStream();
  const isMounted = useIsMounted();

  const submitHandler: SubmitHandler<FormData> = async (data, e) => {
    e?.preventDefault();
    const [image, banner] = await Promise.all([
      readFileAsDataURL(data.stream_image.originFileObj!),
      readFileAsDataURL(data.stream_banner.originFileObj!),
    ]);
    try {
      const cid = await metadata.mutateAsync({
        image,
        banner,
        name: data.stream_name,
        description: data.stream_description,
        start_time: data.stream_date
          .set("hour", data.stream_time.hour())
          .set("minute", data.stream_time.minute())
          .set("second", data.stream_time.second())
          .unix(),
        stream_link: data.stream_link,
        streamer_link: data.streamer_link,
      });
      await createStream.writeContractAsync({
        args: [
          {
            startTime: BigInt(data.stream_sale_time[0].unix()),
            endTime: BigInt(data.stream_sale_time[1].unix()),
            price: BigInt(data.stream_price),
            paymentToken: process.env.NEXT_PUBLIC_BSC_PAYMENT_TOKEN_ADDRESS,
          },
          {
            name: data.stream_name,
            symbol: data.stream_symbol,
            baseUri: `ipfs://${cid.toString()}`,
            cap: data.stream_cap,
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit(submitHandler)}>
      <h1 className={classes.title}>New stream pass</h1>
      <div className={classes.grid}>
        <Controller<FormData, "stream_banner">
          name="stream_banner"
          control={control}
          render={({ field }) => (
            <div
              className={classNames(
                classes.col_1,
                classes.contents,
                classes.first_row,
              )}
            >
              <div />
              <ImageUploader
                {...field}
                aspectRatio="416/307"
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
              className={classNames(classes.col_1, classes.contents)}
              label="More about:"
              placeholder="Description. E.g. stream about the importance of renaissance art from the Master of Art Michelangelo Buonarroti"
              maxLength={100}
              error={errors.stream_description?.message}
            />
          )}
        />
        <Controller<FormData, "stream_link">
          name="stream_link"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className={classNames(classes.col_1, classes.contents)}
              label="Link to watch stream:"
              placeholder="heretowatch.com"
              prefix="https://"
              error={errors.stream_link?.message}
            />
          )}
        />

        <div className={classNames(classes.date_row, classes.contents)}>
          <Controller<FormData, "stream_date">
            name="stream_date"
            control={control}
            render={({ field }) => (
              <DateField
                {...field}
                className={classes.contents}
                label="Date to watch:"
                placeholder="13.12.2024"
                error={errors.stream_date?.message}
              />
            )}
          />
          <Controller<FormData, "stream_time">
            name="stream_time"
            control={control}
            render={({ field }) => (
              <TimeField
                {...field}
                label="Time to watch:"
                placeholder="15:00:00"
                error={errors.stream_time?.message}
              />
            )}
          />
        </div>
        <div className={classNames(classes.price_row, classes.contents)}>
          <Controller<FormData, "stream_cap">
            name="stream_cap"
            control={control}
            render={({ field }) => (
              <NumberField
                {...field}
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
                label="Price for each pass:"
                placeholder="100"
                suffix="USDT"
                min={0}
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
              className={classNames(classes.col_1, classes.contents)}
              label="Selling passes period:"
              placeholder={["13.12.2024", "14.12.2024"]}
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
              className={classNames(
                classes.col_1,
                classes.contents,
                classes.last_row,
              )}
              label="Link to follow you:"
              placeholder="heretowatch.com"
              prefix="https://"
              error={errors.streamer_link?.message}
            />
          )}
        />

        <Controller<FormData, "stream_image">
          name="stream_image"
          control={control}
          render={({ field }) => (
            <div
              className={classNames(
                classes.col_2,
                classes.contents,
                classes.first_row,
              )}
            >
              <div />
              <ImageUploader
                {...field}
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
              className={classNames(classes.col_2, classes.contents)}
              label="NFT name:"
              placeholder="Study with the HARVARD STUDY"
              error={errors.stream_symbol?.message}
            />
          )}
        />
      </div>

      <div className={classes.action}>
        {isMounted && (
          <Button
            type="submit"
            size="large"
            text="Drop the pass"
            disabled={!account.address}
          />
        )}
      </div>
    </form>
  );
};

export { NewStreamPass };
