"use client";

import Modal from "@/components/common/Modal";
import InterestForm from "@/components/listings/detail/InterestForm";
import ListingDescription from "@/components/listings/detail/ListingDescription";
import ListingHeader from "@/components/listings/detail/ListingHeader";
import ListingOverviewSection from "@/components/listings/detail/ListingOverviewSection";
import ListingPriceAndCharges from "@/components/listings/detail/ListingPriceAndCharges";
import ListingSidebar from "@/components/listings/detail/ListingSidebar";
import MediaViewer, { Media } from "@/components/listings/detail/MediaViewer";
import SimilarListings from "@/components/listings/detail/SimilarListings";
import { Armchair, Bath, BedDouble, Car } from "lucide-react";
import { useState } from "react";

export default function ListingDetailPage({ params }: { params: { slug: string } }) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const media: Media[] = [
    {
      id: "v1",
      type: "video",
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumb: "https://picsum.photos/id/1020/400/300",
    },
    { id: "i1", type: "image", src: "https://picsum.photos/id/1018/1200/900" },
    { id: "i2", type: "image", src: "https://picsum.photos/id/1025/1200/900" },
    { id: "i3", type: "image", src: "https://picsum.photos/id/1039/1200/900" },
    { id: "i4", type: "image", src: "https://picsum.photos/id/1040/1200/900" },
  ];

  const [interestOpen, setInterestOpen] = useState(false);

  const handleContact = () => setInterestOpen(true);

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setInterestOpen(false);
    alert("Your interest has been submitted!");
  };

  return (
    <main className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-6 mt-16">
      <ListingHeader
        listingId="abc123"
        title="2 BHK Apartment in Baliapanda"
        price={{ amount: 12500000, negotiable: true }}
        location={{ locality: "Baliapanda", city: "Puri" }}
        badges={["New", "Verified"]}
        className="mb-4"
      />

      {/* two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)]">
        {/* LEFT MAIN CONTENT */}
        <div className="space-y-6">
          <ListingOverviewSection
            media={media}
            headlineFacts={[
              { icon: BedDouble, label: "2 Beds" },
              { icon: Bath, label: "2 Baths" },
              { icon: Car, label: "1 Covered Parking" },
              { icon: Armchair, label: "Unfurnished" },
            ]}
            primaryFacts={[
              { label: "Carpet Area", value: "768 sqft", highlight: true },
              { label: "Price / sqft", value: "₹13,336" },
              { label: "Developer", value: "Laxmi Infra Venture Pvt. Ltd." },
              { label: "Project", value: "Laxmi Vaikunthapuram" },
            ]}
            secondaryFacts={[
              { label: "Transaction Type", value: "New Property" },
              { label: "Status", value: "Under Construction" },
              { label: "Lifts", value: "2" },
              { label: "Furnished Status", value: "Unfurnished" },
            ]}
            onOpenMedia={() => setMediaOpen(true)}
          />

          <ListingDescription
            text={`This airy 2 BHK in Baliapanda offers a practical layout with a bright living area opening to a cozy balcony.
The project has strong road connectivity and daily conveniences within a short walk.

Bedrooms are well-proportioned with cross-ventilation, and the kitchen has a compact utility.
Possession target is within 6–9 months, subject to final RERA updates.`}
            highlights={[
              "Sea breeze corridor; balcony faces East",
              "Daily needs & school within 500 m",
              "Two elevators per block; 24×7 security",
              "Covered parking + visitor parking",
            ]}
          />

          <ListingPriceAndCharges
            totalPrice="₹1.25 Cr"
            negotiable
            pricePerSqft="₹13,336"
            basePrice="₹1.20 Cr"
            otherCharges={[
              { label: "Maintenance", value: "₹2 / sqft / month" },
              { label: "Parking", value: "₹1.5 Lakh" },
              { label: "Registration", value: "As per govt norms" },
            ]}
            note="All charges are indicative and subject to change. Please verify before finalizing."
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <ListingSidebar
          mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14729.423523292517!2d85.8197425!3d19.8133822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19c6d8b8b3db63%3A0x44db7c2f6fcbf37f!2sPuri%2C%20Odisha!5e0!3m2!1sen!2sin!4v1717651290052!5m2!1sen!2sin"
          seller={{
            name: "Sandeep Rath",
            experience: "8 years",
            firm: "Laxmi Infra Realty",
            verified: true,
            contactNumber: "9876543210",
          }}
          onContact={handleContact}
        />
      </div>
      <Modal open={interestOpen} onClose={() => setInterestOpen(false)} title="Express Interest">
        <InterestForm onSubmit={handleFormSubmit} />
      </Modal>
      <SimilarListings
        listings={[
          {
            id: "1",
            title: "3 BHK Apartment near Chakratirth Road",
            location: "Puri",
            price: "₹1.45 Cr",
            image: "https://picsum.photos/id/1051/400/300",
            slug: "3bhk-chakratirth-puri",
            badge: "Verified",
          },
          {
            id: "2",
            title: "2 BHK Flat near VIP Road",
            location: "Puri",
            price: "₹95 Lakh",
            image: "https://picsum.photos/id/1053/400/300",
            slug: "2bhk-viproad-puri",
            badge: "New",
          },
          {
            id: "3",
            title: "Residential Plot near Baliapanda Beach",
            location: "Puri",
            price: "₹78 Lakh",
            image: "https://picsum.photos/id/1056/400/300",
            slug: "plot-baliapanda-puri",
          },
          {
            id: "4",
            title: "2 BHK Apartment at Lighthouse Road",
            location: "Puri",
            price: "₹1.02 Cr",
            image: "https://picsum.photos/id/1054/400/300",
            slug: "2bhk-lighthouse-puri",
          },
        ]}
        className="mt-6"
      />

      <MediaViewer media={media} isOpen={mediaOpen} onClose={() => setMediaOpen(false)} />
    </main>
  );
}
