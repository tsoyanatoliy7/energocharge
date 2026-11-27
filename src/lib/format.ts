/** 1450000 -> "1 450 000" (неразрывные пробелы, как принято в RU/UZ). */
export const formatNumber = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");
