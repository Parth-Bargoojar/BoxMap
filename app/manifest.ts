import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BoxMap',
    short_name: 'BoxMap',
    start_url: '/',
    scope: '/',
    theme_color: '#4F46E5',
    background_color: '#F8FAFC',
    display: 'standalone',
    protocol_handlers: [
      {
        protocol: 'web+boxmap',
        url: '/search?q=%s',
      },
    ],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '720x1280',
        type: 'image/png',
      },
    ],
  }
}