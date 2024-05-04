
import { isDev, siteOrigin } from '@/lib/constants'
import { Meta } from "@/components/common/meta";
import { PageLayout } from "@/components/layout/page";
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Welcome from "@/components/common/welcome";
import { getFileContributors } from '@/lib/github'
import { getAllExperimentSlugs, getExamplePath } from '@/lib/utils'

const HomePage = ({
  experiments
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <PageLayout>
      <Meta />
      <Welcome experiments={experiments} />
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const fs = await import('fs')
  const path = await import('path');
  const experimentsDir = path.resolve(process.cwd(), 'src/experiments');
  const allSlugs = await getAllExperimentSlugs()
  function extractTagsFromFile(fileContents: string): string[] {
    const tagMatch = fileContents.match(/JustATest\.Tags\s*=\s*\[([^\]]+)\]/);
    if (tagMatch && tagMatch[1]) {
      return tagMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, '').toLowerCase());
    }
    return [];
  }
  
  
  function extractTitleFromFile(fileContents: string): string {
    const titleMatch = fileContents.match(/JustATest\.Title\s*=\s*['"]([^'"]+)['"]/);
    return titleMatch ? titleMatch[1].trim() : '';
  }
  
  

  const modules = await Promise.all(
    allSlugs.map(async (slug) => {
      const fullPath = path.join(experimentsDir, slug);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const tags = extractTagsFromFile(fileContents);
      const title = extractTitleFromFile(fileContents);
      return { slug, title, tags };
    })
  );

  let experiments = modules
    .map((exp) => {
      console.log('exp', exp);
      return {
        filename: exp.slug,
        title: exp.title || exp.slug,
        href: `/experiments/${exp.slug}`,
        tags: exp.tags.map(tag => tag.toLowerCase().trim())
      };
    })
    .sort((a, b) => b.filename.localeCompare(a.filename, undefined, { numeric: true }));


  // Add og images
  const ogFiles = fs.readdirSync(process.cwd() + '/public/ogs')

  experiments = experiments.map((e) => {
    // Remove extension
    const filename = e.filename.split(/.(jsx|js|ts|tsx)/)[0]
    const matchingOgFile = ogFiles.find((f) => f.startsWith(filename))
    const og = matchingOgFile ? `${siteOrigin}/ogs/${matchingOgFile}` : null

    return {
      ...e,
      og
    }
  })

  if (!isDev) {
    // Filter privates
    experiments = experiments.filter((e) => !e.tags.includes('private'))
  }

  const fileNameToTile = (filename: string) => {
    let title = filename
      .replace(/^\d+\./, '')
      .replace(/\.[jt]sx?$/, '')
      .replace(/-/g, ' ')

    title = title.charAt(0).toUpperCase() + title.slice(1) + '.'

    return title
  }

  // Numerate experiments
  experiments = experiments.map((e, i) => ({
    ...e,
    title: fileNameToTile(e.title),
    number: experiments.length - i
  }))

  // Add contributors
  experiments = await Promise.all(
    experiments.map(async (e) => {
      const contributors = await getFileContributors(getExamplePath(e.filename))

      return {
        ...e,
        contributors
      }
    })
  )

  fs.writeFileSync(
    process.cwd() + '/public/experiments.json',
    JSON.stringify(experiments, null, 2)
  )
  console.log('experiments', experiments)
  return {
    props: {
      experiments: experiments
    }
  }
}

export default HomePage