export interface ButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "simple" | "danger";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  size?: "xSmall" | "small" | "medium" | "large";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  ariaLabel?: string;
  badge?: number;
}
