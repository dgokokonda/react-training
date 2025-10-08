// hooks/useLazyOptions.js
import { useState, useEffect, useCallback, useRef } from "react";

export function useLazyOptions(loadOptions) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const abortControllerRef = useRef(null);

  // Загрузка опций
  const loadMore = useCallback(
    async (isNewSearch = false) => {
      if (loading || (!hasMore && !isNewSearch)) return;

      setLoading(true);

      // Отменяем предыдущий запрос
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const currentPage = isNewSearch ? 1 : page;
        const result = await loadOptions(currentPage, search);

        setOptions((prev) =>
          isNewSearch ? result.options : [...prev, ...result.options]
        );
        setHasMore(result.hasMore);
        setPage(isNewSearch ? 2 : currentPage + 1);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading options:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [loadOptions, loading, hasMore, page, search]
  );

  // Поиск
  const handleSearch = useCallback((newSearch) => {
    setSearch(newSearch);
    setPage(1);
    // setOptions([]);
    setHasMore(true);
  }, []);

  // Сброс
  const reset = useCallback(() => {
    setOptions([]);
    setPage(1);
    setHasMore(true);
    setSearch("");
  }, []);

  // Загрузка при монтировании
  useEffect(() => {
    loadMore(true);
  }, []);

  return {
    options,
    loading,
    hasMore,
    loadMore,
    handleSearch,
    reset,
    search,
  };
}
