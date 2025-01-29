import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Who is Quartz?",
  description:
    "Test your ability to identify Quartz in this exciting photo quiz!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-100 to-pink-100">
          {children}
        </main>
      </body>
    </html>
  );
}
