import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TimeCapsule — Send Memories Into The Future' },
      { name: 'description', content: 'Create digital time capsules filled with messages, photos, and videos that unlock in the future. Send memories to your future self or someone you love.' },
      { name: 'theme-color', content: '#06060e' },

      // ✅ BUNU EKLEDİM (DOĞRU YER)
      { name: 'google-adsense-account', content: 'ca-pub-5934642727917171' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5934642727917171"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
