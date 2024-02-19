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
  id: string;
};

type Stream = {
  title: string;
  description: string;
  preview: string;
  cost: number;
  date: number;
  ticketsTotal: number;
  ticketsLeft: number;
  id: string;
};
type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

export type {
  PropsWithClassName,
  CompoundComponent,
  ComponentWithSkeleton,
  UnwrapPromise,
  Stream,
  Promo,
};
