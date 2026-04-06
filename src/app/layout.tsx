import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
    title: {
        template: '%s | Swiftly IMS',
        default: 'Swiftly IMS',
    },
    description: 'Efficient inventory management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
