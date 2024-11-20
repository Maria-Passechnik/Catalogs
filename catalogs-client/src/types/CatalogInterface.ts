export interface CatalogInterface {
  _id: string;
  name: string;
  vertical: "fashion" | "home" | "general";
  isPrimary: boolean;
  locales: string[];
  indexedAt: string | null;
}
