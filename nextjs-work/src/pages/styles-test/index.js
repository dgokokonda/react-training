import { useMemo } from "react";
import Button from "./components/Button/Button";
import styled from "styled-components";
import { css } from "@emotion/react";

export default function StylesTest({ isActive }) {
  // inline styles with useMemo
  const buttonStyles = useMemo(
    () => ({
      backgroundColor: isActive ? "blue" : "grey",
      color: "white",
      fontSize: "16px",
      padding: "10px 16px",
      borderRadius: "4px",
    }),
    [isActive]
  );

  // styled components
  // styled.button - это указание тега button
  const BaseButton = styled.button`
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: ${(props) => {
      switch (props.size) {
        case "medium":
          return "16px";
        case "small":
          return "12px";
        case "large":
          return "20px";
        default:
          return "16px";
      }
    }};
    cursor: pointer;
    transition: all 0.3s ease;
  `;

  // расширение стилей
  const PrimaryButton = styled(BaseButton)`
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  `;

  const OutlineButton = styled(BaseButton)`
    background-color: transparent;
    color: #007bff;
    border: 2px solid #007bff;

    &:hover {
      background-color: #007bff;
      color: white;
    }
  `;

  // Emotion Styled
  const emotionButtonStyles = (variant, size) => css`
    padding: ${size === "large" ? "16px 32px" : "12px 24px"};
    background-color: ${variant === "primary" ? "#007bff" : "#6c757d"};
    color: white;
    border: none;
    border-radius: 6px;
    font-size: ${size === "large" ? "18px" : "16px"};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      background-color: ${variant === "primary" ? "#0056b3" : "#545b62"};
    }
  `;

  function EmotionButton({ variant = "primary", size = "medium", children }) {
    return <button css={emotionButtonStyles(variant, size)}>{children}</button>;
  }

  return (
    <>
      {/* inline styles */}
      <p style={{ color: "blue", marginBottom: "10px" }}>Inline Styles</p>
      <button style={buttonStyles}>Кнопка с инлайновыми стилями</button>
      {/* CSS modules and file structure in components */}
      <p style={{ color: "blue", marginBottom: "10px" }}>CSS Modules</p>
      <Button
        size="small"
        variant="primary"
        onClick={() => console.log("click")}
      >
        Кнопка на CSS модулях
      </Button>
      {/* CSS-in-JS - Styles Components */}
      {/* npm install styled-components */}
      <p style={{ color: "blue", marginBottom: "10px" }}>
        Styled Components (CSS-in-JS)
      </p>
      <PrimaryButton
        size="large"
        onClick={() => console.log("primary btn click")}
      >
        Кнопка на CSS-in-JS
      </PrimaryButton>
      <OutlineButton
        size="medium"
        onClick={() => console.log("outline btn click")}
      >
        Кнопка на CSS-in-JS
      </OutlineButton>
      {/* CSS-in-JS библиотеки (Emotion) */}
      {/* npm install @emotion/react @emotion/styled */}
      <p style={{ color: "blue", marginBottom: "10px" }}>
        CSS-in-JS библиотеки (Emotion)
      </p>
      <EmotionButton variant="primary" size="large">
        Кнопка с Emotion styles
      </EmotionButton>
      <div
        css={css`
          background-color: hotpink;
          &:hover {
            color: ${"green"};
          }
        `}
      >
        Hello World.
      </div>
      {/* Tailwind CSS */}
      <p style={{ color: "blue", marginBottom: "10px" }}>Tailwind CSS</p>
      <button className="text-2xl flex-col flex p-{16px} bg-amber-500!">
        Кнопка с Tailwind styling
      </button>
      {/* SCSS/SASS */}
      <p style={{ color: "blue", marginBottom: "10px" }}>SCSS/SASS</p>
    </>
  );
}
