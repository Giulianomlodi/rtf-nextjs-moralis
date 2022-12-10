import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/config.jsx'
import Layout from '@/components/dom/Layout'
import '@/styles/index.css'
import { createClient, mainnet, configureChains, defaultChains, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { SessionProvider } from 'next-auth/react'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const { chains, provider, webSocketProvider } = configureChains([mainnet], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
})

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors,
})

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const ref = useRef()
  return (
    <>
      <WagmiConfig client={client}>
        <SessionProvider session={session} refetchInterval={0}>
          <RainbowKitProvider chains={chains}>
            <Header title={pageProps.title} />
            <Layout ref={ref}>
              <Component {...pageProps} />
              {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
               * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
               * Since the event source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
              {Component?.canvas && (
                <Scene className='pointer-events-none' eventSource={ref} eventPrefix='client'>
                  {Component.canvas(pageProps)}
                </Scene>
              )}
            </Layout>
          </RainbowKitProvider>
        </SessionProvider>
      </WagmiConfig>
    </>
  )
}
