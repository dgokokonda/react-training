import React, { useState, useEffect } from "react";
// import "./timer.css";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(60); // 60 секунд
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(60);
  const [showNotification, setShowNotification] = useState(false);

  // TODO: Реализовать логику таймера с использованием useEffect
  // Таймер должен уменьшать timeLeft каждую секунду когда isRunning = true и isPaused = false
  useEffect(() => {
    let timer = null;

    // Таймер работает только когда запущен И не на паузе И время не закончилось
    if (isRunning && !isPaused && timeLeft > 0) {
      timer = setInterval(
        () =>
          setTimeLeft((time) => {
            if (time <= 1) {
              setIsRunning(false);
              return 0;
            }
            return time - 1;
          }),
        1000
      );

      return () => clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, isPaused, timeLeft]);

  // ✅ useEffect для обработки завершения таймера
  useEffect(() => {
    if (!isRunning && timeLeft === 0) {
      setIsRunning(false);
      setShowNotification(true);
      playNotificationSound();

      const notificationTimer = setTimeLeft(
        () => setShowNotification(false),
        3000
      );

      return () => clearTimeout(notificationTimer);
    }
  }, [isRunning, timeLeft]);

  // ✅ Функция для звукового уведомления
  const playNotificationSound = () => {
    // Простая имитация звука через Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log("Audio not supported:", error);
    }
  };

  // TODO: Реализовать функцию старта таймера
  const startTimer = () => {
    // Должна запускать таймер
    setIsRunning(true);
    setIsPaused(false);
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
    }
  };

  // TODO: Реализовать функцию паузы
  const pauseTimer = () => {
    // Должна ставить таймер на паузу
    setIsRunning(false);
    setIsPaused(true);
  };

  // TODO: Реализовать функцию возобновления
  const resumeTimer = () => {
    // Должна возобновлять таймер с места остановки
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  // TODO: Реализовать функцию сброса
  const resetTimer = () => {
    // Должна сбрасывать таймер на initialTime
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    setShowNotification(false);
  };

  // TODO: Реализовать функцию установки нового времени
  const setNewTime = (seconds) => {
    // Должна устанавливать новое начальное время
    if (seconds > 0 && seconds <= 3600) {
      setTimeLeft(seconds);
      setInitialTime(seconds);
      setIsRunning(false);
      setIsPaused(false);
      setShowNotification(false);
    }
  };

  // Форматирование времени в MM:SS
  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Определяем статус таймера для отображения
  const getTimerStatus = () => {
    if (timeLeft === 0) return "Завершено";
    if (isRunning && !isPaused) return "Запущен";
    if (isPaused) return "На паузе";
    return "Готов";
  };

  const canStart = !isRunning && timeLeft > 0;
  const canResume = isPaused && timeLeft > 0;

  return (
    <div className="timer-container">
      <h1>Таймер обратного отсчета</h1>

      <div className="timer-display">
        <div className={`time ${timeLeft === 0 ? "completed" : ""}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="status">{getTimerStatus()}</div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="btn-start"
            disabled={(!canStart && timeLeft > 0) || !timeLeft}
          >
            ▶️ {timeLeft === 0 ? "Перезапуск" : "Старт"}
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button onClick={pauseTimer} className="btn-pause">
                ⏸️ Пауза
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="btn-resume"
                disabled={!canResume}
              >
                ▶️ Возобновить
              </button>
            )}
            <button onClick={resetTimer} className="btn-reset">
              🔄 Сброс
            </button>
          </>
        )}
      </div>

      <div className="time-presets">
        <h3>Быстрая установка:</h3>
        <button onClick={() => setNewTime(30)}>30 сек</button>
        <button onClick={() => setNewTime(60)}>1 мин</button>
        <button onClick={() => setNewTime(120)}>2 мин</button>
        <button onClick={() => setNewTime(300)}>5 мин</button>
      </div>

      <div className="custom-time">
        <h3>Свое время:</h3>
        <input
          type="number"
          min="1"
          max="3600"
          placeholder="Секунды"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setNewTime(parseInt(e.target.value) || 60);
              e.target.value = "";
            }
          }}
        />
      </div>

      {/* ✅ Уведомление когда время вышло */}
      {showNotification && (
        <div className="notification">⏰ Время вышло! Таймер завершен.</div>
      )}

      {/* ✅ Простая версия звукового уведомления */}
      <audio id="timer-sound" preload="auto">
        <source src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YQ..." />
      </audio>
    </div>
  );
}

export default CountdownTimer;
