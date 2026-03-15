export interface PartnershipCardUser {
  _id: string;
  username?: string;
  image?: string | { urls?: { thumbnail?: string } };
  googlePictureUrl?: string;
  userCategory?: { name: string };
}

export interface PartnershipCardAction {
  label: string;
  onClick: () => void;
}

export interface PartnershipCardProps {
  user: PartnershipCardUser;
  showCategory?: boolean;
  className?: string;
  /** Actions affichées dans le menu 3 points en haut à droite de la card */
  actions?: PartnershipCardAction[];
}
