"use client";

import useGlobalState from "@/hooks/useGlobalState";
import { useEffect } from "react";

function ContextPage() {
  const { user, setUser } = useGlobalState();

  useEffect(() => {
    setUser({
      id: "1",
      email: "user@context.com",
      username: "context",
    });
  }, []);

  return (
    <>
      <p>{user?.id}</p>
      <p>{user?.email}</p>
      <p>{user?.username}</p>
    </>
  );
}

export default ContextPage;
