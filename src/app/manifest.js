export default function manifest() {
  return {
    name: 'ArkaHome Real Estate',
    short_name: 'ArkaHome',
    description: 'Your Gateway to Albanian Dreams',
    start_url: '/',
    display: 'standalone',
    background_color: '#233F8E',
    theme_color: '#F77F2D',
    icons: [
      {
        "src": "/icon512_maskable.png",
        sizes: '192x192',
        type: 'image/png',
      },
      {
       "src": "/icon512_rounded.png",
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}