import { Quote } from "lucide-react";

type Sentiment = "POSITIVE" | "NEGATIVE" | "MIXED";

type Row = {
  feature: string;
  sentiment: Sentiment;
  confidence: number;
  flag?: string;
};

const rows: Row[] = [
  { feature: "Camera Quality", sentiment: "POSITIVE", confidence: 97 },
  { feature: "Battery Life", sentiment: "NEGATIVE", confidence: 93 },
  { feature: "Packaging", sentiment: "NEGATIVE", confidence: 81, flag: "⚠️ SARCASTIC" },
  { feature: "Overall Product", sentiment: "MIXED", confidence: 89, flag: "HUMAN REVIEW REQUIRED" },
];

const pill: Record<Sentiment, string> = {
  POSITIVE: "bg-success/15 text-success ring-success/30",
  NEGATIVE: "bg-danger/15 text-danger ring-danger/30",
  MIXED: "bg-muted text-muted-foreground ring-border",
};

const bar: Record<Sentiment, string> = {
  POSITIVE: "bg-success",
  NEGATIVE: "bg-danger",
  MIXED: "bg-muted-foreground/70",
};

export function SentimentTable() {
  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Feature-Level Sentiment Extraction</h2>
        <p className="text-xs text-muted-foreground">NLP engine output · multi-lingual + sarcasm detection</p>
      </header>

      <div className="border-b border-border bg-surface/50 px-5 py-4">
        <div className="flex items-start gap-3">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm italic leading-relaxed text-foreground/90">
            "Phone is amazing, camera quality is outstanding! But{" "}
            <span className="not-italic font-medium text-warning">battery life bahut kharaab hai</span>… drains in 4hrs.
            Oh and packaging? Came in a torn box,{" "}
            <span className="not-italic font-medium text-danger">GREAT quality control</span> 🙄"
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Feature Attribute</th>
              <th className="px-5 py-3 font-medium">Sentiment</th>
              <th className="px-5 py-3 font-medium w-[32%]">Confidence Score</th>
              <th className="px-5 py-3 font-medium">AI Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.feature} className="transition-colors hover:bg-surface/60">
                <td className="px-5 py-4 font-medium">{r.feature}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${pill[r.sentiment]}`}
                  >
                    {r.sentiment}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface ring-1 ring-border">
                      <div
                        className={`h-full rounded-full ${bar[r.sentiment]}`}
                        style={{ width: `${r.confidence}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {r.confidence}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {r.flag ? (
                    <span className="rounded-md bg-warning/10 px-2 py-1 text-[11px] font-medium text-warning ring-1 ring-warning/30">
                      {r.flag}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
