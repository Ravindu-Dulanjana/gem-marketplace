import { Mail, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-4">
            Contact Us
          </h1>
          <p className="text-muted text-base">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Mail,
              title: "Email",
              detail: "support@gemmarket.com",
              sub: "We reply within 24 hours",
            },
            {
              icon: MapPin,
              title: "Location",
              detail: "Colombo, Sri Lanka",
              sub: "Global operations",
            },
            {
              icon: Clock,
              title: "Hours",
              detail: "Mon - Sat, 9AM - 6PM",
              sub: "Sri Lanka Standard Time",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-card-bg border border-card-border rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10 mx-auto mb-3">
                  <Icon className="text-gold" size={20} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground">{item.detail}</p>
                <p className="text-xs text-muted mt-0.5">{item.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-playfair)] text-foreground mb-6">
            Send us a message
          </h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Name</label>
                <input
                  type="text"
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Subject</label>
              <input
                type="text"
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Message</label>
              <textarea
                rows={5}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-gold text-background font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-gold-light transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
