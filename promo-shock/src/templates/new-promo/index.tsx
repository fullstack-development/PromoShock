"use client";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Button,
  ImageUploader,
  RangeDateField,
  TextArea,
  TextField,
} from "@promo-shock/ui-kit";

import type { FormData } from "./types";

const NewPromo: FC = () => {
  const { control } = useForm<FormData>();

  return (
    <form>
      <h1>New Promo</h1>
      <div>
        <Controller<FormData, "promo_cover">
          name="promo_cover"
          control={control}
          render={({ field }) => (
            <div>
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
        <Controller<FormData, "promo_name">
          name="promo_name"
          control={control}
          render={({ field }) => <TextField label="Promo name" {...field} />}
        />
        <Controller<FormData, "promo_description">
          name="promo_description"
          control={control}
          render={({ field }) => (
            <TextArea
              label="More about"
              placeholder="Description. E.g. stream about the importance of renaissance art from the Master of Art Michelangelo Buonarroti"
              maxLength={100}
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
              placeholder={["13.12.2024", "24.12.2042"]}
              {...field}
            />
          )}
        />

        <span>
          Your promotion will be targeted to these addresses. You can enter one
          or more addresses.
        </span>
      </div>

      <Button text="Pay 10 USDT and create promo" />
    </form>
  );
};

export { NewPromo };
