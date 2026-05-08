import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../../context/SiteContext';

const SEO = ({ title, description, keywords, image }) => {
  const { settings } = useSiteSettings();

  // Fallback to site-wide settings if individual page props are missing
  const seoTitle = title || settings?.seo_title || settings?.website_name || 'Bipin Interior';
  const seoDescription = description || settings?.seo_description || settings?.footer_description || '';
  const seoKeywords = keywords || settings?.seo_keywords || '';
  const seoImage = image || settings?.logo || '';
  const siteName = settings?.website_name || 'Bipin Interior';

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Favicon handling via Helmet */}
      {settings?.favicon && (
        <link rel="icon" type="image/x-icon" href={settings.favicon} />
      )}
    </Helmet>
  );
};

export default SEO;
