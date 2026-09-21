export const metadata = {
  title: "Groundwork — Payment Gateway",
  description: "Zentrales Zahlungssystem fuer Groundwork und verbundene Shops",
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
