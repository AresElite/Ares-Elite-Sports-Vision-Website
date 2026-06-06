import { Helmet } from 'react-helmet-async';
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  schema?: Record<string, any>;
  type?: 'website' | 'article';
}

export function SEO({ title, description, path, schema, type = 'website' }: SEOProps) {
  const url = `https://areselitesports.vision${path === '/' ? '' : path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:url" content={url} />

      {/* Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
