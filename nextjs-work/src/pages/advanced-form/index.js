"use client";

import { useState, useCallback, useRef } from "react";
import { LazySelect } from "@/components/Select/Select";
import { mockLoadOptions } from "@/mock/mockData";

export default function AdvancedForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    country: "",
    gender: "",
    newsletter: false,
    terms: false,
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const selectRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Маска для телефона
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 1) return numbers;
    if (numbers.length <= 4) return `+${numbers}`;
    if (numbers.length <= 7)
      return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(
        4
      )}`;
    if (numbers.length <= 9)
      return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(
        4,
        7
      )}-${numbers.slice(7)}`;

    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(
      4,
      7
    )}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  // Маска для даты
  const formatDate = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4)
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;

    return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(
      4,
      8
    )}`;
  };

  // Обработчики изменений
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Очищаем ошибку при изменении поля
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }

      if (field === "country") selectRef.current.blur();
    },
    [errors]
  );

  const handlePhoneChange = useCallback(
    (e) => {
      const formatted = formatPhone(e.target.value);
      handleInputChange("phone", formatted);
    },
    [handleInputChange]
  );

  const handleDateChange = useCallback(
    (e) => {
      const formatted = formatDate(e.target.value);
      handleInputChange("birthDate", formatted);
    },
    [handleInputChange]
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];

      if (file) {
        const allowedExtensions = [
          ".pdf",
          ".doc",
          ".docx",
          ".rtf",
          ".jpeg",
          ".jpg",
        ];
        const fileExtension = "." + file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          setErrors((prev) => ({
            ...prev,
            file: "Разрешены только файлы: PDF, DOC, DOCX, RTF, JPEG, JPG",
          }));
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          setErrors((prev) => ({
            ...prev,
            file: "Файл слишком большой. Максимальный размер: 5MB",
          }));
          return;
        }

        setErrors((prev) => ({
          ...prev,
          file: "",
        }));

        handleInputChange("file", file);
      }
    },
    [handleInputChange]
  );

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (formData.phone.replace(/\D/g, "").length < 11) {
      newErrors.phone = "Введите полный номер телефона";
    }

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = "Дата рождения обязательна";
    } else if (!/^\d{2}\.\d{2}\.\d{4}$/.test(formData.birthDate)) {
      newErrors.birthDate = "Введите дату в формате ДД.ММ.ГГГГ";
    }

    if (!formData.country) {
      newErrors.country = "Выберите страну";
    }

    if (!formData.gender) {
      newErrors.gender = "Выберите пол";
    }

    if (!formData.terms) {
      newErrors.terms = "Необходимо согласие с условиями";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0 && !errors.file;
  };

  // Отправка формы
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const valid = validateForm();

      if (!valid) {
        setSubmitStatus("error");
        const errorField = document.querySelector(".error");

        if (errorField) {
          window.scrollTo({
            top: errorField.getBoundingClientRect().x,
            behavior: "smooth",
          });
          if (errorField.tagName === "INPUT" && errorField.type !== "file") {
            window.scrollTo({
              top: errorField.getBoundingClientRect().top,
              behavior: "smooth",
            });
            setTimeout(() => errorField.focus(), 500);
          } else
            window.scrollTo({
              top: errorField.getBoundingClientRect().x,
              behavior: "smooth",
            });
        }
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus("loading");

      try {
        // Создаем FormData для отправки файла
        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "file" && formData.file) {
            submitData.append(key, formData.file);
          } else {
            submitData.append(key, formData[key]);
          }
        });

        // Отправка на тестовый endpoint
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
          {
            method: "POST",
            body: submitData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.ok) {
          const result = await response.json();
          // console.log("Форма отправлена:", result);
          setSubmitStatus("success");

          // Сброс формы после успешной отправки
          setFormData({
            name: "",
            email: "",
            phone: "",
            birthDate: "",
            country: "",
            gender: "",
            newsletter: false,
            terms: false,
            file: null,
          });

          // Сброс файлового инпута
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = "";
        } else {
          throw new Error("Ошибка отправки");
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setSubmitStatus("error");
        // Показываем пользователю понятное сообщение
        throw new Error(
          "Не удалось загрузить данные. Проверьте подключение к интернету."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, errors]
  );

  const handleClear = (field) => {
    handleInputChange(field, "");
  };

  const countries = [
    { value: "", label: "Выберите страну" },
    { value: "ru", label: "Россия" },
    { value: "kz", label: "Казахстан" },
    { value: "by", label: "Беларусь" },
    { value: "ua", label: "Украина" },
    { value: "other", label: "Другая" },
  ];

  return (
    <div className="form-container">
      <h1>Расширенная форма</h1>

      <form onSubmit={handleSubmit} className="advanced-form">
        {/* Текстовое поле */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Имя *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="Введите ваше имя"
          />
          <span
            className={`clear-icon ${
              !formData.name ? "clear-icon--disabled" : ""
            }`}
            title="Очистить"
            onClick={() => handleClear("name")}
          >
            ✕
          </span>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Email поле */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`form-input ${errors.email ? "error" : ""}`}
            placeholder="example@mail.com"
          />
          <span
            className={`clear-icon ${
              !formData.email ? "clear-icon--disabled" : ""
            }`}
            title="Очистить"
            onClick={() => handleClear("email")}
          >
            ✕
          </span>
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Телефон с маской */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Телефон *
          </label>
          <input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`form-input ${errors.phone ? "error" : ""}`}
            placeholder="+7 (999) 999-99-99"
            maxLength="18"
          />
          <span
            className={`clear-icon ${
              !formData.phone ? "clear-icon--disabled" : ""
            }`}
            title="Очистить"
            onClick={() => handleClear("phone")}
          >
            ✕
          </span>
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        {/* Дата с маской */}
        <div className="form-group">
          <label htmlFor="birthDate" className="form-label">
            Дата рождения *
          </label>
          <input
            id="birthDate"
            type="text"
            value={formData.birthDate}
            onChange={handleDateChange}
            className={`form-input ${errors.birthDate ? "error" : ""}`}
            placeholder="ДД.ММ.ГГГГ"
            maxLength="10"
          />
          <span
            className={`clear-icon ${
              !formData.birthDate ? "clear-icon--disabled" : ""
            }`}
            title="Очистить"
            onClick={() => handleClear("birthDate")}
          >
            ✕
          </span>
          {errors.birthDate && (
            <span className="error-message">{errors.birthDate}</span>
          )}
        </div>

        {/* Select */}
        <div className="form-group">
          <label htmlFor="country" className="form-label">
            Страна *
          </label>
          <LazySelect
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="Выберите опцию..."
            loadOptions={mockLoadOptions}
            optionsHeight={250}
          />
          <select
            ref={selectRef}
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={`form-select custom-select ${
              errors.country ? "error" : ""
            }`}
          >
            {countries.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            className={`clear-icon ${
              !formData.country ? "clear-icon--disabled" : ""
            }`}
            title="Очистить"
            onClick={() => handleClear("country")}
          >
            ✕
          </span>
          {errors.country && (
            <span className="error-message">{errors.country}</span>
          )}
        </div>

        {/* Radio кнопки */}
        <div className="form-group">
          <span className="form-label">Пол *</span>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              Мужской
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              Женский
            </label>
          </div>
          {errors.gender && (
            <span className="error-message">{errors.gender}</span>
          )}
        </div>

        {/* Чекбоксы */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) =>
                handleInputChange("newsletter", e.target.checked)
              }
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            Подписаться на рассылку
          </label>

          <label className="checkbox-label required">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => handleInputChange("terms", e.target.checked)}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            Согласен с условиями использования *
          </label>
          {errors.terms && (
            <span className="error-message">{errors.terms}</span>
          )}
        </div>

        {/* Загрузка файла */}
        <div className="form-group">
          <label htmlFor="file" className="form-label">
            Загрузить документ
          </label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className={`file-input ${errors.file ? "error" : ""}`}
            accept=".pdf,.doc,.docx,.rtf,.jpeg,.jpg"
          />
          <div className="file-info">
            Разрешены: PDF, DOC, DOCX, RTF, JPEG, JPG (макс. 5MB)
          </div>
          {formData.file && (
            <div className="file-selected">
              📎 Выбран файл: {formData.file.name}
            </div>
          )}
          {errors.file && <span className="error-message">{errors.file}</span>}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`submit-button ${isSubmitting ? "loading" : ""}`}
        >
          {isSubmitting ? "Отправка..." : "Отправить форму"}
        </button>

        {/* Статус отправки */}
        {submitStatus === "success" && (
          <div className="status-message success">
            ✅ Форма успешно отправлена!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="status-message error">
            ❌ Ошибка при отправке формы
          </div>
        )}
      </form>
    </div>
  );
}
