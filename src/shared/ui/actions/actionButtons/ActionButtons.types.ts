export type ActionType = "view" | "edit" | "delete";

export interface Action {
  type: ActionType;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface ActionButtonsProps {
  actions: Action[];
  iconSize?: number;
  className?: string;
}
