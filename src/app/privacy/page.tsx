import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      lastUpdated="February 2026"
      sections={[
        {
          heading: "Information We Collect",
          content:
            "We collect information you provide during registration (name, email, business details), listing data, inquiry messages, and browsing data (session ID, recently viewed items, wishlist). We also collect standard analytics data such as IP addresses and browser information.",
        },
        {
          heading: "How We Use Your Information",
          content:
            "Your information is used to: operate and improve the marketplace; process seller applications; facilitate communication between buyers and sellers; personalize your experience (wishlist, recently viewed); send important platform notifications; prevent fraud and ensure security.",
        },
        {
          heading: "Data Sharing",
          content:
            "We do not sell your personal information. Seller profile information is publicly visible. Buyer inquiry details are shared with the relevant seller. We may share data with service providers who assist in platform operations, and when required by law.",
        },
        {
          heading: "Data Storage and Security",
          content:
            "Your data is stored securely using industry-standard encryption. We use Supabase for data storage with row-level security policies. While we take reasonable measures to protect your data, no method of electronic storage is 100% secure.",
        },
        {
          heading: "Cookies",
          content:
            "We use essential cookies for authentication and session management. A session cookie tracks your wishlist and recently viewed gems. No third-party advertising cookies are used.",
        },
        {
          heading: "Your Rights",
          content:
            "You may request access to, correction of, or deletion of your personal data by contacting us. Sellers can delete their account and associated listings. Buyers can clear their wishlist and browsing history at any time.",
        },
        {
          heading: "Contact",
          content:
            "For privacy-related inquiries, please contact us at privacy@gemmarket.com.",
        },
      ]}
    />
  );
}
