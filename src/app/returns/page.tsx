import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Return Policy" };

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Return Policy"
      lastUpdated="February 2026"
      sections={[
        {
          heading: "Overview",
          content:
            "GemMarket is a marketplace connecting buyers and sellers. Return policies are determined by individual sellers. We encourage buyers to confirm return terms with sellers before completing a purchase.",
        },
        {
          heading: "Return Window",
          content:
            "We recommend that sellers offer a minimum 7-day return window from the date of delivery. Buyers should inspect gems upon receipt and report any issues promptly. Returns must be initiated within the seller's specified return period.",
        },
        {
          heading: "Conditions for Return",
          content:
            "Gems must be returned in the same condition as received, with original packaging and any accompanying documentation. Gems that have been altered, damaged by the buyer, or are missing certification documents may not be eligible for return.",
        },
        {
          heading: "Disputes",
          content:
            "If a buyer and seller cannot resolve a return dispute, they may contact GemMarket support for mediation assistance. We will review the case based on listing descriptions, communication history, and evidence provided by both parties.",
        },
        {
          heading: "Misrepresentation",
          content:
            "If a gem is significantly misrepresented in its listing (wrong gem type, treated when listed as natural, etc.), buyers are entitled to a full refund. Sellers found to repeatedly misrepresent gems may have their accounts suspended.",
        },
      ]}
    />
  );
}
