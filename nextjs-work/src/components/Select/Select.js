// components/LazySelect.js
"use client";

import { useState, useRef, useEffect } from "react";
import { useLazyOptions } from "@/hooks/useLazyOptions";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";

const ITEM_HEIGHT = 40;
const OPTIONS_HEIGHT = 300;

export function LazySelect({
  value,
  onChange,
  placeholder = "Выберите опцию...",
  loadOptions,
  optionsHeight = OPTIONS_HEIGHT,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { options, loading, hasMore, loadMore, handleSearch } =
    useLazyOptions(loadOptions);

  const {
    containerRef: optionsContainerRef,
    visibleItems,
    startIndex,
    totalHeight,
  } = useVirtualScroll(ITEM_HEIGHT, optionsHeight, options.length);

  // Обработчик скролла для подгрузки
  const handleOptionsScroll = () => {
    if (!optionsContainerRef.current || loading || !hasMore) return;

    const container = optionsContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;

    // Подгружаем когда дошли до конца
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMore();
    }
  };

  // Поиск с дебаунсом
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Клик вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Поле выбора */}
      <div
        className={`
          flex items-center justify-between w-full p-3 border rounded-lg
          bg-white cursor-pointer transition-colors
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed opacity-60"
              : "hover:border-gray-400 focus-within:border-blue-500"
          }
          ${isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"}
        `}
        onClick={handleToggle}
      >
        <div className="flex-1 truncate">
          {value ? (
            <span className="text-gray-900">{value.label}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Поле поиска */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Контейнер опций */}
          <div
            ref={optionsContainerRef}
            style={{ height: `${optionsHeight}px` }}
            className="overflow-y-auto custom-scrollbar"
            onScroll={handleOptionsScroll}
          >
            <div style={{ height: `${totalHeight}px`, position: "relative" }}>
              {visibleItems.map((index) => {
                const option = options[index];
                if (!option) return null;

                return (
                  <div
                    key={option.id}
                    style={{
                      position: "absolute",
                      top: `${index * ITEM_HEIGHT}px`,
                      height: `${ITEM_HEIGHT}px`,
                      width: "100%",
                    }}
                  >
                    <div
                      className={`
                        flex items-center px-3 cursor-pointer transition-colors
                        ${
                          value?.id === option.id
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-50"
                        }
                      `}
                      onClick={() => handleSelect(option)}
                      style={{ height: "100%" }}
                    >
                      <span className="truncate">{option.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Лоадер */}
            {loading && (
              <div className="flex justify-center items-center p-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Загрузка...</span>
                </div>
              </div>
            )}

            {/* Сообщение о конце списка */}
            {!hasMore && options.length > 0 && (
              <div className="text-center p-2 text-gray-500 text-sm">
                Все опции загружены
              </div>
            )}

            {/* Нет результатов */}
            {!loading && options.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                {searchQuery ? "Ничего не найдено" : "Нет доступных опций"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
