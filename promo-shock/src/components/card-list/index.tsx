"use client";
import type { InfiniteData, QueryFunction } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactElement } from "react";

import { Button, Multiselect } from "@promo-shock/ui-kit";

import styles from "./card-list.module.scss";

type Props<
  TValue,
  TFilters,
  TFilterKeys extends string,
  QueryValue extends { items: Array<TValue>; cursor: number | null },
  QueryKey extends [string, TFilters],
  QueryFn extends QueryFunction<QueryValue, QueryKey, number>,
> = {
  queryFn: QueryFn;
  queryKey: QueryKey;
  children: (item: TValue) => ReactElement;
  initialData?: InfiniteData<QueryValue, number>;
  filterOptions?: { label: string; value: TFilterKeys | "all" }[];
  defaultFilters?: TFilterKeys[];
  mapKeysToFilter?: QueryKey extends [string, filters: infer Filters]
    ? (filterKeys: (TFilterKeys | "all")[]) => Filters
    : never;
};

export const CardList = <
  TValue,
  TFilters,
  TFilterKeys extends string,
  QueryValue extends { items: Array<TValue>; cursor: number | null },
  QueryKey extends [string, TFilters],
  QueryFn extends QueryFunction<QueryValue, QueryKey, number>,
>({
  children,
  queryFn,
  queryKey,
  initialData,
  mapKeysToFilter,
  defaultFilters,
  filterOptions,
}: Props<
  TValue,
  TFilters,
  TFilterKeys,
  QueryValue,
  QueryKey,
  QueryFn
>): ReactElement => {
  const [key, filters] = queryKey;
  const [filterKeys, setFilterKeys] = useState(
    defaultFilters || (["all"] as (TFilterKeys | "all")[]),
  );
  const cards = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey: [
      key,
      {
        ...filters,
        ...((filterKeys && mapKeysToFilter?.(filterKeys)) || {}),
      },
    ] as QueryKey,
    queryFn,
    select: (data) => data.pages.map((item) => item.items).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const handleGetMore = async () => {
    try {
      await cards.fetchNextPage();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFilter = (value: (TFilterKeys | "all")[]) => {
    if (value.length === 0 || value[value.length - 1] === "all")
      setFilterKeys(["all"]);
    else setFilterKeys(value.filter((v) => v !== "all"));
  };

  return (
    <div className={styles.root}>
      {filterOptions && (
        <div className={styles.filter}>
          <Multiselect
            value={filterKeys}
            options={filterOptions}
            onChange={handleFilter}
          />
        </div>
      )}
      <div className={styles.list}>{cards.data?.map(children)}</div>
      {cards.hasNextPage && (
        <Button
          text="Get more"
          size="medium"
          theme="tertiary"
          loading={cards.isFetchingNextPage}
          onClick={handleGetMore}
        />
      )}
    </div>
  );
};
