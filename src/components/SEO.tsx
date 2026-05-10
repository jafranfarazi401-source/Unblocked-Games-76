import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: 'website' | 'article' | 'game' | 'collection';
  image?: string;
  noindex?: boolean;
  schema?: any;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonicalPath, 
  type = 'website', 
  image = 'https://classroom6x.store/logo.png',
  noindex = false,
  schema
}) => {
  const siteName = "Classroom6x";
  const baseUrl = "https://classroom6x.store";
  const fullUrl = `${baseUrl}${canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath) : ''}`;
  const defaultTitle = "Classroom 6x - Hub for Unblocked Games 6x & Best School Games";
  const defaultDesc = "Classroom 6x Hub: Play the best unblocked games 6x for school. Enjoy Slope, Retro Bowl, Duck Duck Clicker, and more with zero lag.";
  
  const displayTitle = title ? title : defaultTitle;
  const displayDesc = (description && description.trim().length > 0) ? description : defaultDesc;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="description" content={displayDesc} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={displayDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={displayDesc} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
