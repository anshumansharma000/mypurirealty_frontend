"use client";

import ListingMap from "./ListingMap";
import ListingSellerCard from "./ListingSellerCard";

type Props = {
  mapEmbedUrl: string;
  seller: {
    name: string;
    experience?: string;
    firm?: string;
    verified?: boolean;
    contactNumber?: string;
  };
  onContact?: () => void;
};

export default function ListingSidebar({ mapEmbedUrl, seller, onContact }: Props) {
  return (
    <aside className="space-y-4">
      <ListingMap mapEmbedUrl={mapEmbedUrl} />
      <ListingSellerCard {...seller} onContact={onContact} />
    </aside>
  );
}
