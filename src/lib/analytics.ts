// Google Analytics 4設定
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

// Google Analytics初期化
export const initGoogleAnalytics = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    // Google Analytics 4スクリプトロード
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    // Google Analytics設定
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: 'Creative Tech Portfolio',
        content_group2: '4ZIGEN',
        custom_map: {
          'custom_parameter_1': 'artwork_type',
          'custom_parameter_2': 'interaction_type'
        }
      });
    `
    document.head.appendChild(script2)
  }
}

// カスタムイベント追跡
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      custom_parameter_1: label,
      send_to: GA_MEASUREMENT_ID,
    })
  }
}

// 作品閲覧追跡
export const trackArtworkView = (artworkName: string, artworkType: string) => {
  trackEvent('view_artwork', 'engagement', artworkName)
  trackEvent('artwork_interaction', 'portfolio', `${artworkName}_${artworkType}`)
}

// ギャラリー操作追跡
export const trackGalleryInteraction = (action: string, item?: string) => {
  trackEvent('gallery_interaction', 'navigation', `${action}_${item || ''}`)
}

// 検索行動追跡
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'engagement', searchTerm, resultsCount)
}

// Web Vitalsメトリクス送信
export const sendWebVitals = ({ id, name, value, label }: {
  id: string
  name: string
  value: number
  label: 'web-vital' | 'custom'
}) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: label === 'web-vital' ? 'Core Web Vital' : 'Custom Metric',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_id: id,
      metric_value: value,
      metric_delta: 0,
      send_to: GA_MEASUREMENT_ID,
    })
  }
}

// ページビュー追跡
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_title: title,
      page_location: url,
      content_group1: 'Creative Tech Portfolio',
      content_group2: '4ZIGEN',
    })
  }
}