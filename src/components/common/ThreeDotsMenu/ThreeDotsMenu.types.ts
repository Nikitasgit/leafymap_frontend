import { ReactNode } from "react";

export interface ThreeDotsMenuAction {
  label: string;
  onClick: () => void;
}

export interface ThreeDotsMenuProps {
  /** Liste des actions du menu */
  actions: ThreeDotsMenuAction[];
  /** Contenu du bouton déclencheur (par défaut : icône 3 points) */
  trigger?: ReactNode;
  /** Label d'accessibilité du bouton */
  ariaLabel?: string;
  /** Alignement du menu par rapport au trigger */
  align?: "left" | "right";
  /** Class CSS du wrapper (pour le positionnement) */
  className?: string;
}
