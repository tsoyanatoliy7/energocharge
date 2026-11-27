// Корневой layout только пробрасывает children: <html>/<body> рендерятся в app/[locale]/layout.tsx,
// чтобы атрибут lang соответствовал языку страницы.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
