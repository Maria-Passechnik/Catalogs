import * as Yup from "yup";

export const verticalOptions = ["fashion", "home", "general"] as const;
export const localeOptions = ["en_US", "en_CA", "es_ES"] as const;

export const catalogFormSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z]+$/, "Name can only contain letters")
    .required("Name is required"),
  vertical: Yup.string()
    .oneOf(verticalOptions, "Invalid vertical")
    .required("Vertical is required"),
  locales: Yup.array()
    .of(Yup.string().oneOf(localeOptions, "Invalid locale"))
    .min(1, "Select at least one locale"),
  isPrimary: Yup.boolean(),
});

export type CatalogFormSchema = Yup.InferType<typeof catalogFormSchema>;