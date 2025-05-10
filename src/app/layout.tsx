import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4ZIGEN | ワクワククリエイター",
  description: "4ZIGENは東京大学の学生によるものづくり集団です。デジタルファブリケーションを活用した作品制作と展示を行っています。",
  keywords: ["4ZIGEN", "四次元", "東京大学", "ものづくり", "デジタルファブリケーション", "メディアアート", "制作展", "学生サークル", "社会実装", "アーティスト", "ワクワク", "クリエイター", "HCI"],
  authors: [{ name: "4ZIGEN" }],
  creator: "4ZIGEN",
  publisher: "4ZIGEN",
  openGraph: {
    title: "4ZIGEN | ワクワククリエイター",
    description: "4ZIGENは東京大学の学生によるものづくり集団です。デジタルファブリケーションを活用した作品制作と展示を行っています。",
    url: "https://4zigen.vercel.app",
    siteName: "4ZIGEN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "4ZIGEN - ワクワククリエイター",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "4ZIGEN | ワクワククリエイター",
    description: "4ZIGENは東京大学の学生によるものづくり集団です。デジタルファブリケーションを活用した作品制作と展示を行っています。",
    images: ["/og-image.jpg"],
    creator: "@4ZIGEN",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://4zigen.vercel.app",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        <Script
          id="schema-org-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "4ZIGEN",
              url: "https://4zigen.vercel.app",
              logo: "https://4zigen.vercel.app/logo.png",
              description: "4ZIGENは東京大学の学生によるものづくり集団です。デジタルファブリケーションを活用した作品制作と展示を行っています。",
              sameAs: [
                "https://twitter.com/4ZIGEN",
                "https://www.instagram.com/4zigen_official/",
              ],
              member: [
                {
                  "@type": "Person",
                  name: "岡空来",
                  jobTitle: "純正東大生",
                },
                {
                  "@type": "Person",
                  name: "金澤政宜",
                  jobTitle: "つくってワイワイ",
                },
                {
                  "@type": "Person",
                  name: "中田裕紀",
                  jobTitle: "ぐわぐわ〜",
                },
                {
                  "@type": "Person",
                  name: "南田桂吾",
                  jobTitle: "hogehoge",
                }
              ],
              knowsAbout: [
                "デジタルファブリケーション",
                "メディアアート",
                "インタラクティブアート",
                "プロトタイピング",
                "HCI",
                "社会実装",
                "ワクワク",
                "クリエイター",
                "アーティスト",
                "ワクワク",
                "クリエイター",
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
