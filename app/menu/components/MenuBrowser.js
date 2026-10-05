"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { MenuList } from "./MenuList";

function pageHref(query, page) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("page", String(page));
  return `/menu?${params.toString()}`;
}

export default function MenuBrowser({ initialData }) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialData.query);
  const [debouncedQuery, setDebouncedQuery] = useState(initialData.query);
  const [page, setPage] = useState(initialData.page);
  const queryKey = debouncedQuery
    ? `/api/dishes?q=${encodeURIComponent(debouncedQuery)}&page=${page}`
    : null;
  const hasMatchingFallback =
    initialData.query === debouncedQuery && initialData.page === page;

  const { data, error, isLoading, isValidating } = useSWR(queryKey, fetcher, {
    fallbackData: hasMatchingFallback ? initialData : undefined,
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextQuery = searchInput.trim();
      if (nextQuery === debouncedQuery) return;

      setDebouncedQuery(nextQuery);
      setPage(1);
      router.replace(pageHref(nextQuery, 1), { scroll: false });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [debouncedQuery, router, searchInput]);

  const results = data ?? initialData;

  return (
    <section className="menu-browser" aria-busy={isValidating}>
      <label className="menu-search">
        Search dishes
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Try doro or lentils"
        />
      </label>

      {error ? <p role="alert">Could not load dishes: {error.message}</p> : null}
      {isLoading && !results ? <p role="status">Loading dishes...</p> : null}
      {isValidating && results.query !== debouncedQuery ? (
        <p className="query-status" role="status">
          Showing {results.query || "all dishes"} while results for {debouncedQuery} load...
        </p>
      ) : null}

      <p className="result-count">
        {results.total} {results.total === 1 ? "dish" : "dishes"}
        {results.query ? ` matching “${results.query}”` : " available"}
      </p>
      <MenuList items={results.dishes} />

      {results.totalPages > 1 ? (
        <nav className="pagination" aria-label="Dish pages">
          {results.page > 1 ? (
            <Link href={pageHref(debouncedQuery, results.page - 1)} className="secondary-button">
              Previous
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          <span>Page {results.page} of {results.totalPages}</span>
          {results.page < results.totalPages ? (
            <Link href={pageHref(debouncedQuery, results.page + 1)} className="secondary-button">
              Next
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      ) : null}
    </section>
  );
}