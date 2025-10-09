import styles from "./Button.module.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
}) {
  const className = `
    ${styles.button}
    ${styles[variant]}
    ${size === "large" ? styles.large : styles.small}
    ${disabled ? styles.disabled : ""}
  `.trim();
  console.log(size, variant, disabled, className);

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
