import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js Supabase MVP',
  description: 'A Next.js Supabase MVP',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider>
          <Nav />
          <div className="mt-16 flex min-h-[calc(100vh-4rem)] flex-col items-center">
            <div className="flex w-full flex-grow flex-col items-center px-4 py-12">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
