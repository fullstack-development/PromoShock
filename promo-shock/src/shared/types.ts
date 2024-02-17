import type { FC } from "react";

type PropsWithClassName<T = object> = T & { className?: string };
type CompoundComponent<K, T = object> = FC<T> & K;
type ComponentWithSkeleton<T> = CompoundComponent<{ Skeleton: FC }, T>;

type Promo = {
  preview: string;
  endDate: number;
  startDate: number;
  title: string;
  description: string;
};

type Stream = {
  title: string;
  description: string;
  preview: string;
  cost: number;
  date: number;
  ticketsTotal: number;
  ticketsLeft: number;
};

export type {
  PropsWithClassName,
  CompoundComponent,
  ComponentWithSkeleton,
  Promo,
  Stream,
};
