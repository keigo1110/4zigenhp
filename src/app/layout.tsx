import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4ZIGEN | 東京大学発 ワクワククリエイター集団",
  description: "4ZIGENは東京大学の学生によるものづくり集団です。おもしろい、ワクワクする、心震える革新的なアイデアを形にして、デジタルファブリケーション、インタラクティブアート、メディアアートの新たな可能性を探求しています。",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    // コア情報
    "4ZIGEN", "四次元", "東京大学", "ものづくり", "学生サークル", "クリエイター集団",
    // 技術・分野
    "デジタルファブリケーション", "メディアアート", "インタラクティブアート", "プロトタイピング",
    "HCI", "Human Computer Interaction", "IoT", "電子工作", "Arduino",
    // 作品名
    "CottonSketchPen", "Geocussion", "Protophysica", "Metransfer", "Puflica", "覗香", "Protozoa", "Edge of Bubbles",
    // 概念・体験
    "社会実装", "ワクワク", "アーティスト", "イノベーション", "創造性", "体験デザイン",
    // 学術・教育
    "STEAM教育", "制作展", "研究開発", "プロダクトデザイン", "テクノロジーアート",
    // 英語キーワード
    "Tokyo University", "Digital Fabrication", "Interactive Art", "Media Art", "Creative Technology",
    "Innovation", "Prototyping", "Student Creators", "Art Collective", "Technology Art"
  ],
  authors: [
    { name: "4ZIGEN" },
    { name: "岡空来", url: "https://sites.google.com/view/soraoka" },
    { name: "金澤政宜", url: "https://kanassi.info/" },
    { name: "中田裕紀", url: "https://yuki-nakata.org/" },
    { name: "南田桂吾", url: "https://keigominamida.com/" }
  ],
  creator: "4ZIGEN - 東京大学発クリエイター集団",
  publisher: "4ZIGEN",
  category: "Technology, Art, Education, Innovation",
  classification: "Creative Technology, Digital Art, Interactive Media",
  openGraph: {
    title: "4ZIGEN | 東京大学発 ワクワククリエイター集団",
    description: "デジタルファブリケーション・メディアアートで新たな可能性を創造する東京大学の学生集団。",
    url: "https://4zigen.xyz",
    siteName: "4ZIGEN",
    images: [
      {
        url: "/media/4zigen-logo.png",
        width: 1200,
        height: 630,
        alt: "4ZIGEN - 東京大学発ワクワククリエイター集団",
      },
      {
        url: "/works/cottonsketchgan.jpg",
        width: 800,
        height: 600,
        alt: "CottonSketchPen - 必要な時に必要なものを創り出す",
      },
      {
        url: "/works/geophoto.jpeg",
        width: 800,
        height: 600,
        alt: "Geocussion - イメージを形にして音を鳴らす変身可能な楽器",
      }
    ],
    locale: "ja_JP",
    type: "website",
    emails: ["kamashigsii@gmail.com"],
  },
  twitter: {
    card: "summary_large_image",
    title: "4ZIGEN | 東京大学発 ワクワククリエイター集団",
    description: "デジタルファブリケーション・メディアアートで新たな可能性を創造する東京大学の学生集団。",
    images: ["/media/4zigen-logo.png"],
    creator: "@4ZIGENGSii",
    site: "@4ZIGENGSii",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://4zigen.xyz",
    languages: {
      'ja': 'https://4zigen.xyz',
      'en': 'https://4zigen.xyz/en',
    },
  },
  verification: {
    google: "google-site-verification-code-here",
    yandex: "yandex-verification-code-here",
    other: {
      "msvalidate.01": "bing-verification-code-here",
    },
  },
  metadataBase: new URL('https://4zigen.xyz'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* AIクローラー最適化のための追加メタタグ */}
        <meta name="subject" content="デジタルファブリケーション・メディアアート・学生クリエイター集団" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="format-detection" content="telephone=no" />

        {/* 学術・研究機関として */}
        <meta name="DC.title" content="4ZIGEN - 東京大学発クリエイター集団" />
        <meta name="DC.creator" content="4ZIGEN" />
        <meta name="DC.subject" content="Digital Fabrication, Media Art, Interactive Technology" />
        <meta name="DC.description" content="デジタルファブリケーション・メディアアートで新たな可能性を創造する東京大学の学生集団" />
        <meta name="DC.publisher" content="4ZIGEN" />
        <meta name="DC.type" content="Text" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.language" content="ja" />

        {/* 地理的情報 */}
        <meta name="geo.region" content="JP-13" />
        <meta name="geo.placename" content="Tokyo, Japan" />
        <meta name="geo.position" content="35.712776;139.762221" />
        <meta name="ICBM" content="35.712776, 139.762221" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/media/4zigen-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/media/4zigen-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/media/4zigen-logo.png" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Additional Performance Optimizations */}
        <link rel="prefetch" href="/works/" />
        <link rel="prefetch" href="/members/" />
      </head>
      <body className={inter.className}>
        {children}

        {/* 包括的なJSON-LD構造化データ */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://4zigen.xyz/#organization",
              name: "4ZIGEN",
              alternateName: ["四次元", "よじげん"],
              url: "https://4zigen.xyz",
              logo: {
                "@type": "ImageObject",
                url: "https://4zigen.xyz/media/4zigen-logo.png",
                width: "200",
                height: "200"
              },
              image: "https://4zigen.xyz/media/4zigen-logo.png",
              description: "4ZIGENは東京大学の学生によるものづくり集団です。HCI、デジタルファブリケーション、メディアアート、インタラクティブアートの分野で革新的な作品を制作しています。",
              foundingDate: "2020",
              foundingLocation: {
                "@type": "Place",
                name: "東京大学",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "東京",
                  addressRegion: "東京都",
                  addressCountry: "JP"
                }
              },
              areaServed: "JP",
              knowsAbout: [
                "デジタルファブリケーション", "メディアアート", "インタラクティブアート",
                "プロトタイピング", "HCI", "IoT", "電子工作", "Arduino",
                "3Dプリンティング", "レーザーカッター", "プロダクトデザイン"
              ],
              sameAs: [
                "https://twitter.com/4ZIGENGSii",
                "https://www.instagram.com/4zigen_official/",
                "https://github.com/4zigen"
              ],
              member: [
                {
                  "@type": "Person",
                  "@id": "https://sites.google.com/view/soraoka",
                  name: "岡空来",
                  givenName: "空来",
                  familyName: "岡",
                  jobTitle: "純正東大生",
                  affiliation: {
                    "@type": "Organization",
                    name: "東京大学"
                  },
                  sameAs: "https://sites.google.com/view/soraoka"
                },
                {
                  "@type": "Person",
                  "@id": "https://kanassi.info/",
                  name: "金澤政宜",
                  givenName: "政宜",
                  familyName: "金澤",
                  jobTitle: "つくってワイワイ",
                  description: "すーぱーえくすぱんど！！！",
                  sameAs: "https://kanassi.info/"
                },
                {
                  "@type": "Person",
                  "@id": "https://yuki-nakata.org/",
                  name: "中田裕紀",
                  givenName: "裕紀",
                  familyName: "中田",
                  jobTitle: "ぐわぐわ〜",
                  description: "やるっしょ",
                  sameAs: "https://yuki-nakata.org/"
                },
                {
                  "@type": "Person",
                  "@id": "https://keigominamida.com/",
                  name: "南田桂吾",
                  givenName: "桂吾",
                  familyName: "南田",
                  jobTitle: "ホームページ芸人",
                  description: "しょうねん←→おじさん",
                  sameAs: "https://keigominamida.com/"
                }
              ]
            })
          }}
        />

        {/* 作品コレクションのスキーマ */}
        <Script
          id="creative-works-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWorkSeries",
              "@id": "https://4zigen.xyz/#works",
              name: "4ZIGEN作品集",
              description: "デジタルファブリケーションとメディアアートを融合した革新的作品群",
              creator: {
                "@type": "Organization",
                "@id": "https://4zigen.xyz/#organization"
              },
              hasPart: [
                {
                  "@type": "CreativeWork",
                  name: "CottonSketchPen",
                  description: "必要な時に必要なものを創り出す世界をつくりたい。",
                  url: "https://cotton-sketch-pen-hp.vercel.app/",
                  image: "https://4zigen.xyz/works/cottonsketchgan.jpg",
                  genre: ["デジタルファブリケーション", "インタラクティブアート"],
                  keywords: ["綿", "わたあめ機", "オンデマンド製造", "creative tools"]
                },
                {
                  "@type": "CreativeWork",
                  name: "Geocussion",
                  description: "イメージを形にして音を鳴らす変身可能な楽器",
                  url: "https://geohp.vercel.app/",
                  image: "https://4zigen.xyz/works/geophoto.jpeg",
                  genre: ["サウンドアート", "インタラクティブ楽器"],
                  keywords: ["砂場楽器", "位置情報", "音楽制作", "GPS"]
                },
                {
                  "@type": "CreativeWork",
                  name: "Protophysica",
                  description: "新たな制作の可能性を広げる。",
                  url: "https://protophysicahp.vercel.app/",
                  image: "https://4zigen.xyz/works/super.jpeg",
                  genre: ["テクノロジーアート", "物理学アート"],
                  keywords: ["スーパーキャパシタ", "電子部品", "飛行", "エネルギー"]
                },
                {
                  "@type": "CreativeWork",
                  name: "Metransfer",
                  description: "波、泡沫、鼓動",
                  url: "https://metransferhp.vercel.app/",
                  image: "https://4zigen.xyz/works/metransfer.png",
                  genre: ["インスタレーション", "インタラクティブアート"],
                  keywords: ["toio", "シャボン玉", "リズム", "パフォーマンス"]
                },
                {
                  "@type": "CreativeWork",
                  name: "Puflica",
                  description: "ドスン，ビュン，ストン，プカプカ．",
                  url: "https://puflicahp.vercel.app/",
                  image: "https://4zigen.xyz/works/puflica.png",
                  genre: ["キネティックアート", "インフレータブルアート"],
                  keywords: ["傘袋", "浮遊", "空気", "軽やか"]
                },
                {
                  "@type": "CreativeWork",
                  name: "覗香",
                  description: "香りを拡張する",
                  url: "https://nozohp.vercel.app/",
                  image: "https://4zigen.xyz/works/nozo.jpg",
                  genre: ["感覚アート", "体験デザイン"],
                  keywords: ["香り", "嗅覚", "センサー", "拡張現実"]
                },
                {
                  "@type": "CreativeWork",
                  name: "Protozoa",
                  description: "触れたら動き出す原生機械種",
                  url: "https://protozoahp.vercel.app/",
                  image: "https://4zigen.xyz/works/wat.png",
                  genre: ["バイオアート", "人工生命"],
                  keywords: ["原生生物", "触覚", "機械", "生命体"]
                },
                {
                  "@type": "CreativeWork",
                  name: "Edge of Bubbles",
                  description: "波打ち際のように揺れ動くシャボン塊",
                  url: "https://keigo1110.github.io/edgeofbubbles/",
                  image: "https://4zigen.xyz/works/eob.png",
                  genre: ["ジェネラティブアート", "インスタレーション"],
                  keywords: ["シャボン玉", "波", "境界", "ephemeral"]
                }
              ]
            })
          }}
        />

        {/* WebSiteスキーマ */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://4zigen.xyz/#website",
              name: "4ZIGEN",
              url: "https://4zigen.xyz",
              description: "東京大学発のクリエイター集団による革新的作品ポートフォリオ",
              inLanguage: "ja",
              isPartOf: {
                "@type": "Organization",
                "@id": "https://4zigen.xyz/#organization"
              },
              about: {
                "@type": "Thing",
                name: "デジタルファブリケーション・メディアアート",
                description: "学生による創造的技術開発とアート制作"
              },
              keywords: [
                "4ZIGEN", "東京大学", "デジタルファブリケーション", "メディアアート",
                "インタラクティブアート", "学生クリエイター", "プロトタイピング"
              ],
              potentialAction: {
                "@type": "SearchAction",
                target: "https://4zigen.xyz/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* 教育機関としてのスキーマ */}
        <Script
          id="educational-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "@id": "https://4zigen.xyz/#education",
              name: "4ZIGEN Educational Initiative",
              description: "デジタルファブリケーション技術とアート制作の教育普及活動",
              educationalLevel: "University",
              teaches: [
                "デジタルファブリケーション", "3Dプリンティング", "レーザーカッター操作",
                "Arduino プログラミング", "電子工作", "プロトタイピング手法",
                "インタラクティブアート制作", "メディアアート理論"
              ],
              courseMode: ["hands-on", "workshop", "project-based"],
              availableLanguage: ["ja", "en"]
            })
          }}
        />
      </body>
    </html>
  );
}
