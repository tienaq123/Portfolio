import { notFound } from "next/navigation";
import { locale } from "next/root-params";
import type { Messages } from "@/messages/en";
import { hasLocale, type Locale } from "./config";

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import("@/messages/en").then((module) => module.en),
  vi: () => import("@/messages/vi").then((module) => module.vi),
};

/** Current locale from the `[locale]` root segment; unknown values 404. */
export async function getLocale(): Promise<Locale> {
  const value = await locale();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Messages> {
  return dictionaries[await getLocale()]();
}
