import "@/styles/globals.css";
import '@/css/global.scss'
import type { AppProps } from "next/app";
import React from "react";
import { montekLog, isClient, isDev, isProd } from "@/lib/constants";
import { useAppStore } from "@/context/use-app-store";

export type GetLayoutFn<P = Record<string, unknown>> = (
  props: AppProps<P>
) => React.ReactNode

if (isProd && isClient || isDev) {
  // eslint-disable-next-line no-console
  console.log(montekLog)
}


export default function App({ Component, pageProps,...rest }: AppProps) {
  React.useEffect(() => {
    if (!isDev) return
    let mousetrapRef: Mousetrap.MousetrapInstance | undefined = undefined
    import('mousetrap').then(({ default: mousetrap }) => {
      mousetrapRef = mousetrap.bind(['command+i', 'ctrl+i', 'alt+i'], () => {
        document.body.classList.toggle('inspect')
      })
    })

    return () => {
      mousetrapRef?.unbind(['command+i', 'ctrl+i', 'alt+i'])
    }
  }, [])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === `Tab`) {
        document.body.classList.add('user-is-tabbing')
      }
    }

    function handleMouseDown() {
      document.body.classList.remove('user-is-tabbing')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  React.useEffect(() => {
    const maxWaitTime = 1500 // tweak this as needed.

    const timeout = window.setTimeout(() => {
      onReady()
    }, maxWaitTime)

    function onReady() {
      window.clearTimeout(timeout)
      useAppStore.setState({ fontsLoaded: true })
      document.documentElement.classList.add('fonts-loaded')
    }

    try {
      document.fonts.ready
        .then(() => {
          onReady()
        })
        .catch((error: unknown) => {
          console.error(error)
          onReady()
        })
    } catch (error) {
      console.error(error)
      onReady()
    }
  }, [])

  const getLayout: GetLayoutFn =
    (Component as any).getLayout ||
    (({ Component, pageProps }) => <Component {...pageProps} />)
  
    return (
      <>
        {getLayout({ Component, pageProps, ...rest })}
      </>
    )
}
