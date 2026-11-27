import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

// Корень сайта ведёт на язык по умолчанию. В проде можно заменить на middleware
// с определением языка по Accept-Language.
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
