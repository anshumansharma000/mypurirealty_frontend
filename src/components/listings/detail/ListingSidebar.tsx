"use client";

import ListingMap from "./ListingMap";
import ListingSellerCard from "./ListingSellerCard";

const defMap =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14729.423523292517!2d85.8197425!3d19.8133822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19c6d8b8b3db63%3A0x44db7c2f6fcbf37f!2sPuri%2C%20Odisha!5e0!3m2!1sen!2sin!4v1717651290052!5m2!1sen!2sin";
type Props = {
  mapEmbedUrl?: string;
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
      <ListingMap mapEmbedUrl={mapEmbedUrl ?? defMap} />
      <ListingSellerCard {...seller} onContact={onContact} />
    </aside>
  );
}
