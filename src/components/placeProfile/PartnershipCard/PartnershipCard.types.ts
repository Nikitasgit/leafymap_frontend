export interface PartnershipCardProps {
  creator: {
    _id: string;
    name?: string;
    image?: {
      urls?: {
        thumbnail?: string;
      };
    };
    categories?: Array<{
      name: string;
    }>;
  };
  showCategory?: boolean;
  className?: string;
}
