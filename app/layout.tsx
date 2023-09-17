import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PDF Chat',
  description: 'Interact with PDF files with AI. A clone of popular pdf app, Suleiman Odetoro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  )
}
