interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  sections: { heading: string; content: string }[];
}

export default function PolicyPage({ title, lastUpdated, sections }: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-2">
          {title}
        </h1>
        <p className="text-xs text-muted mb-8">Last updated: {lastUpdated}</p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-semibold text-foreground mb-3">
                {i + 1}. {section.heading}
              </h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
