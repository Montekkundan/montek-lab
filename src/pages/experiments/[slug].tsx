import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { FC, useEffect, useState } from 'react'

import { Meta } from '@/components/common/meta'
import { R3FCanvasLayout } from '@/components/layout/r3f-canvas-layout'
import { getAllExperimentSlugs } from '@/lib/utils'

type Module<P> = {
  default: P
}

type Component<P = Record<string, unknown>> = FC<P> & {
  Layout?: FC
  getLayout?: GetLayoutFn<P>
  Title?: string
  Description?: string
  background?: 'white' | 'dots' | 'dots_white' | 'none'
}

type GetLayoutFn<P = Record<string, unknown>> = FC<{
  Component: Component<P>
  title?: string
  description?: string
  slug: string
  background?: 'white' | 'dots' | 'dots_white' | 'none'
}>

const resolveLayout = (Comp: Module<Component>): GetLayoutFn => {
  const Component = Comp.default

  if (Component?.getLayout) {
    return Component.getLayout
  }

  if (Component?.Layout) {
    const Layout = Component.Layout as FC<{ children: React.ReactNode, [key: string]: any }>

    return ({ Component, ...rest }) => (
      <Layout {...rest} background={Component.background}>
        <Component />
      </Layout>
    )
  }

  return ({ Component, ...rest }) => {
    return (
      <R3FCanvasLayout {...rest}>
        <Component />
      </R3FCanvasLayout>
    )
  }
}

const Experiment = ({
  slug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [Component, setComponent] = useState<Module<Component>>()

  useEffect(() => {
    import(`@/experiments/${slug}`).then((Comp) => {
      setComponent(Comp)
    })
  }, [slug])

  if (!Component) {
    return (
      <>
        <Meta />
        <div>Loading...</div>
      </>
    )
  }

  const Layout = resolveLayout(Component)

  return (
    <>
      <Meta />
      <Layout
        Component={Component.default}
        title={Component.default.Title}
        description={Component.default.Description}
        slug={slug}
        background={Component.default.background}
      />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = await getAllExperimentSlugs()

  const paths = allSlugs.map((exp) => {
    return {
      params: {
        slug: exp
      }
    }
  })

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = ({ params }) => {
  return {
    props: {
      slug: (params as ParsedUrlQuery).slug
    }
  }
}

export default Experiment