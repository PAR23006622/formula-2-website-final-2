export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Formula 2 Analytics',
    description: 'Comprehensive Formula 2 championship statistics, driver performance analysis, and real-time race insights.',
    url: 'https://f2analytics.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://f2analytics.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateArticleSchema({
  title,
  description,
  publishedDate,
  modifiedDate,
  image,
  authorName
}: {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate: string;
  image?: string;
  authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: authorName
    }
  };
}