import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const changelog = await getCollection('changelog');
  
  // Sort by date descending (newest first)
  const sortedChangelog = changelog.sort((a, b) => 
    new Date(b.data.date) - new Date(a.data.date)
  );

  return rss({
    title: 'Vikunja Changelog',
    description: 'Latest news about Vikunja\'s product development and releases',
    site: context.site,
    items: sortedChangelog.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/changelog/${entry.slug.endsWith('/') ? entry.slug : entry.slug + '/'}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
