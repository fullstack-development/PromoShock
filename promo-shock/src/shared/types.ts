import type { FC } from "react";

type PropsWithClassName<T = object> = T & { className?: string };
type CompoundComponent<K, T = object> = FC<T> & K;
type ComponentWithSkeleton<T> = CompoundComponent<{ Skeleton: FC }, T>;

export type { PropsWithClassName, CompoundComponent, ComponentWithSkeleton };
