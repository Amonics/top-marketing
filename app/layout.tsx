export const metadata = {
  title: "Top Marketing — Payment Gateway",
  description: "Zentrales Zahlungssystem fuer Top Marketing und verbundene Shops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
