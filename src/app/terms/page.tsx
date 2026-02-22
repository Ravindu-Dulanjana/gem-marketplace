import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      lastUpdated="February 2026"
      sections={[
        {
          heading: "Acceptance of Terms",
          content:
            "By accessing and using GemMarket, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our platform.",
        },
        {
          heading: "User Accounts",
          content:
            "Seller accounts require registration and admin approval. You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. GemMarket reserves the right to suspend or terminate accounts that violate these terms.",
        },
        {
          heading: "Listings and Transactions",
          content:
            "Sellers are responsible for the accuracy of their gem listings, including descriptions, specifications, and images. All pricing must be in good faith. GemMarket acts as a marketplace platform and is not a party to transactions between buyers and sellers. Disputes between buyers and sellers should be resolved between the parties involved.",
        },
        {
          heading: "Prohibited Activities",
          content:
            "Users may not: list counterfeit or misrepresented gems; manipulate reviews or ratings; use the platform for fraudulent activities; violate any applicable laws or regulations; scrape or harvest data from the platform; interfere with platform security or performance.",
        },
        {
          heading: "Intellectual Property",
          content:
            "All content on GemMarket, including logos, design, and software, is owned by GemMarket or its licensors. Sellers retain ownership of their listing content but grant GemMarket a license to display it on the platform.",
        },
        {
          heading: "Limitation of Liability",
          content:
            "GemMarket provides the platform 'as is' and makes no warranties about the quality or authenticity of listed gems. We are not liable for losses resulting from transactions between users. Our total liability is limited to the fees paid to us in the preceding 12 months.",
        },
        {
          heading: "Changes to Terms",
          content:
            "GemMarket reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms. We will notify users of significant changes via email or platform notification.",
        },
      ]}
    />
  );
}
