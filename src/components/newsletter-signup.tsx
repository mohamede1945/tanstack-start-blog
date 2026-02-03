import { Check } from "lucide-react";
import { type ReactNode, useState } from "react";
import { NewsletterForm } from "@/components/newsletter-form";

type NewsletterSignupProps = {
  aside?: ReactNode;
};

export function NewsletterSignup({ aside }: NewsletterSignupProps) {
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  if (subscribedEmail) {
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-md items-start gap-3 rounded-3xl border border-border/60 bg-muted/30 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary">
            <Check className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground text-sm">You're subscribed.</p>
            <p className="text-muted-foreground text-xs">
              New posts will land in {subscribedEmail}.
            </p>
          </div>
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    );
  }

  return <NewsletterForm onSuccess={setSubscribedEmail} aside={aside} />;
}
