import styles from "./Button.module.scss";
import { ButtonProps } from "./Button.types";

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  size = "medium",
  startIcon,
  endIcon,
  className,
  fullWidth = false,
  ariaLabel,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        fullWidth ? styles.fullWidth : ""
      } ${className}`}
    >
      {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
      {children && children}
      {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
