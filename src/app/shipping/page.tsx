import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Shipping Information" };

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping Information"
      lastUpdated="February 2026"
      sections={[
        {
          heading: "Shipping Responsibility",
          content:
            "Shipping is arranged between the buyer and seller. Sellers are responsible for packaging gems securely and providing tracking information. We recommend using insured shipping for all gemstone shipments.",
        },
        {
          heading: "Packaging Standards",
          content:
            "Sellers should package gems in protective containers with adequate cushioning. We recommend using gem jars or boxes with foam inserts. Fragile items should be clearly marked on the outer packaging.",
        },
        {
          heading: "International Shipping",
          content:
            "For international shipments, buyers may be responsible for import duties, taxes, and customs fees in their country. Sellers should provide accurate customs declarations. Shipping times vary by destination and carrier.",
        },
        {
          heading: "Insurance",
          content:
            "We strongly recommend that sellers insure all shipments for the full value of the gem. GemMarket is not responsible for items lost or damaged during shipping. Buyers should verify insurance coverage before the seller ships.",
        },
        {
          heading: "Delivery Confirmation",
          content:
            "All shipments should include delivery confirmation or signature requirement. Sellers should share tracking information with buyers promptly. Buyers should inspect packages upon delivery and report any issues immediately.",
        },
      ]}
    />
  );
}
