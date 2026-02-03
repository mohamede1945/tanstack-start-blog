import { createServerValidate, ServerValidateError } from "@tanstack/react-form-start";
import { createServerFn } from "@tanstack/react-start";
import { newsletterFormOptions, newsletterSchema } from "@/lib/newsletter-options";

const logger = console;
const serverValidate = createServerValidate({
  ...newsletterFormOptions,
  onServerValidate: newsletterSchema,
});

const loopsApiBaseUrl = "https://app.loops.so/api/v1/contacts/update";
const newsletterSource = "template.mafifi.dev";
const newsletterProduct = "TanStack Start Blog";

export const submitNewsletterSubscribe = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      logger.error({ data }, "Invalid form data");
      throw new Error("Invalid form data");
    }
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const loopsApiKey = process.env.LOOPS_API_KEY;
      const newsletterId = process.env.LOOPS_MAILING_LIST_NEWSLETTER;

      if (!loopsApiKey) {
        logger.error({ env: process.env }, "Missing LOOPS_API_KEY");
        throw new Error("Missing LOOPS_API_KEY");
      }
      if (!newsletterId) {
        logger.error({ env: process.env }, "Missing LOOPS_MAILING_LIST_NEWSLETTER");
        throw new Error("Missing LOOPS_MAILING_LIST_NEWSLETTER");
      }

      const validatedData = await serverValidate(data);
      logger.info({ validatedData }, "Validated form data");

      const email = validatedData.email.trim();
      logger.info({ email }, "Email");

      const rawUtmSource = data.get("utm_source");
      const utmSource = typeof rawUtmSource === "string" ? rawUtmSource.trim() : "";
      const rawReferrer = data.get("referrer");
      const referrer = typeof rawReferrer === "string" ? rawReferrer.trim() : "";

      const response = await fetch(loopsApiBaseUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${loopsApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mailingLists: { [newsletterId]: true },
          source: newsletterSource,
          product: newsletterProduct,
          signup_type: "newsletter",
          ...(utmSource ? { utm_source: utmSource } : {}),
          ...(referrer ? { referrer } : {}),
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        logger.error(
          { status: response.status, statusText: response.statusText, responseText },
          "Failed to upsert Loops contact",
        );
        return {
          ok: false,
          error: "There was an error subscribing, please try again later.",
        };
      }

      return { ok: true };
    } catch (e) {
      if (e instanceof Error && e.name === ServerValidateError.name) {
        logger.error({ e }, "Server validation error");
        return {
          ok: false,
          error: "Form validation failed, please check your email and try again.",
        };
      }
      logger.error({ e }, "Error subscribing to newsletter");

      return {
        ok: false,
        error: "There was an internal error subscribing, please try again later.",
      };
    }
  });
