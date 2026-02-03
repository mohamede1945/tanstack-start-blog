import { formOptions } from "@tanstack/react-form-start";
import { z } from "zod";

export const newsletterFormOptions = formOptions({
  defaultValues: {
    email: "",
  },
});

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email."),
});
