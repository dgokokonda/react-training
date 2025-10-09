import { useState, useEffect, useCallback, useMemo } from "react";
// более корректный вариант отображения списка, фильтрации и сортировки

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Загрузка всех пользователей один раз
  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const fetchAllUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          {
            signal: abortController.signal,
          }
        );

        if (!isMounted) return;
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllUsers();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Фильтрация и сортировка
  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter((user) =>
      searchedText
        ? user.name.toLowerCase().includes(searchedText.toLowerCase())
        : true
    );

    return result.sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }, [users, searchedText, sortOrder]);

  const handleSearchChange = useCallback((e) => {
    setSearchedText(e.target.value);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="users-container">
      <div className="controls">
        <input
          type="text"
          name="search"
          id="search"
          value={searchedText}
          onChange={handleSearchChange}
          placeholder="Search for users by name"
          disabled={isLoading}
        />
        <button onClick={toggleSortOrder} disabled={isLoading}>
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {!isLoading && filteredAndSortedUsers.length === 0 && (
        <div className="no-results">No users found</div>
      )}

      <ul className="collection">
        {filteredAndSortedUsers.map((user) => (
          <li key={user.id} className="collection-item">
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
