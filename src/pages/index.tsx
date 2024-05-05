
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
    const tagRegex = /([A-Za-z_$][A-Za-z0-9_$]*)\.Tags\s*=\s*\[\s*([^\]]+?)\s*\]/s;
    const tagMatch = fileContents.match(tagRegex);
    if (tagMatch && tagMatch[2]) {
      return tagMatch[2].split(',')
        .map(tag => tag.trim().replace(/['"]/g, '').toLowerCase());
    }
    return [];
  }
  
  function extractTitleFromFile(fileContents: string): string {
    const titleRegex = /([A-Za-z_$][A-Za-z0-9_$]*)\.Title\s*=\s*['"]([^'"]+)['"]/s;
    const titleMatch = fileContents.match(titleRegex);
    return titleMatch ? titleMatch[2].trim() : '';
  }
  
  const modules = await Promise.all(
    allSlugs.map(async (slug) => {
      let fullPath = path.join(experimentsDir, slug);
      if (fs.lstatSync(fullPath).isDirectory()) {
        // Check for index file with different extensions
        const extensions = ['js', 'jsx', 'tsx'];
        const defaultFile = extensions.map(ext => `index.${ext}`).find(file => fs.existsSync(path.join(fullPath, file)));
        if (defaultFile) {
          fullPath = path.join(fullPath, defaultFile);
        }
      }
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
  return {
    props: {
      experiments: experiments
    }
  }
}

export default HomePage