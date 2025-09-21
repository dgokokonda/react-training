import { useEffect, useState, useCallback } from "react";

export default function Watch() {
  const [now, setNow] = useState(new Date());

  const updateTime = useCallback(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [updateTime]);

  return (
    <div className="time">
      <span>Время сейчас: {now.toLocaleTimeString()}</span>
    </div>
  );
}
