import { useForm } from "@tanstack/react-form-start";
import { Loader2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterFormOptions, newsletterSchema } from "@/lib/newsletter-options";
import { cn } from "@/lib/utils";
import { submitNewsletterSubscribe } from "@/server/newsletter-subscribe";

type NewsletterFormProps = {
  onSuccess: (email: string) => void;
  aside?: ReactNode;
};

export const NewsletterForm = ({ onSuccess, aside }: NewsletterFormProps) => {
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const form = useForm({
    ...newsletterFormOptions,
    validators: {
      onBlur: newsletterSchema,
      onSubmit: newsletterSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(undefined);
      try {
        const formData = new FormData();
        formData.set("email", value.email);
        if (typeof window !== "undefined") {
          const utmSource = new URLSearchParams(window.location.search).get("utm_source")?.trim();
          if (utmSource) {
            formData.set("utm_source", utmSource);
          }
          const referrer = document.referrer?.trim();
          if (referrer) {
            formData.set("referrer", referrer);
          }
        }
        const result = await submitNewsletterSubscribe({ data: formData });

        if (!result.ok) {
          setServerError(result.error);
          return;
        }

        onSuccess(value.email);
      } catch {
        setServerError("Something went wrong while subscribing.");
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex w-full flex-col gap-2"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex w-full flex-col gap-2">
                  <label className="sr-only" htmlFor={field.name}>
                    Email address
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-10 rounded-2xl border-border bg-background text-sm"
                    placeholder="you@domain.com"
                    type="email"
                    autoComplete="email"
                    aria-invalid={isInvalid}
                    required
                  />
                </div>
              );
            }}
          </form.Field>

          <form.Subscribe
            selector={(formState) => ({
              canSubmit: formState.canSubmit,
              isSubmitting: formState.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <Button
                type="submit"
                size="sm"
                className={cn("h-10 px-4", isSubmitting && "cursor-wait")}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Subscribing" : "Subscribe"}
              </Button>
            )}
          </form.Subscribe>
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
      <form.Subscribe
        selector={(formState) => {
          const emailMeta = formState.fieldMeta.email;
          if (!emailMeta?.isTouched || emailMeta.isValid) {
            return undefined;
          }
          return emailMeta.errors?.[0]?.message;
        }}
      >
        {(errorMessage) =>
          errorMessage ? (
            <p className="text-destructive text-xs" role="alert">
              {errorMessage}
            </p>
          ) : null
        }
      </form.Subscribe>

      {serverError ? (
        <p className="text-destructive text-xs" role="alert">
          {serverError}
        </p>
      ) : null}

      <form.Subscribe selector={(formState) => formState.isSubmitting}>
        {(isSubmitting) =>
          isSubmitting ? (
            <p className="text-muted-foreground text-xs" aria-live="polite">
              Hang tight. Subscribing you now.
            </p>
          ) : null
        }
      </form.Subscribe>
    </form>
  );
};
