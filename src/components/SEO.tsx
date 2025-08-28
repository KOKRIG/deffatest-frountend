import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "DEFFATEST - #1 AI-Powered App Testing Platform | Find Bugs Faster",
  description = "Revolutionary AI testing platform that finds more bugs faster than manual testing. Autonomous QA testing for web and mobile apps. Save 90% testing time. Try free!",
  keywords = "AI testing, automated testing, app testing, QA testing, mobile app testing, web testing, bug detection, software testing, autonomous testing, AI QA, test automation",
  image = "https://deffatest.online/og-image.png",
  url = "https://deffatest.online",
  type = "website",
  author = "DEFFATEST",
  publishedTime,
  modifiedTime,
  schema,
  canonical
}) => {
  const defaultSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        "url": url,
        "name": "DEFFATEST",
        "description": "AI-Powered App Testing Platform",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${url}/?s={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        "name": "DEFFATEST",
        "url": url,
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": `${url}/#/schema/logo/image/`,
          "url": `${url}/DEFFATEST-logo copy copy.png`,
          "contentUrl": `${url}/DEFFATEST-logo copy copy.png`,
          "width": 512,
          "height": 512,
          "caption": "DEFFATEST"
        },
        "image": {
          "@id": `${url}/#/schema/logo/image/`
        },
        "sameAs": [
          "https://github.com/deffatest",
          "https://linkedin.com/company/deffatest"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-DEFFA-TEST",
          "contactType": "customer service",
          "availableLanguage": ["en", "es", "fr", "de", "zh"]
        }
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        "url": url,
        "name": title,
        "isPartOf": {
          "@id": `${url}/#website`
        },
        "about": {
          "@id": `${url}/#organization`
        },
        "primaryImageOfPage": {
          "@id": `${url}/#primaryimage`
        },
        "image": {
          "@id": `${url}/#primaryimage`
        },
        "thumbnailUrl": image,
        "datePublished": publishedTime || "2024-01-01T00:00:00+00:00",
        "dateModified": modifiedTime || new Date().toISOString(),
        "author": {
          "@id": `${url}/#organization`
        },
        "description": description,
        "breadcrumb": {
          "@id": `${url}/#breadcrumb`
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "ImageObject",
        "inLanguage": "en-US",
        "@id": `${url}/#primaryimage`,
        "url": image,
        "contentUrl": image,
        "width": 1200,
        "height": 630,
        "caption": title
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": url
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "DEFFATEST",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser, iOS, Android",
        "description": "AI-powered autonomous testing platform for web and mobile applications",
        "url": url,
        "author": {
          "@id": `${url}/#organization`
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "500",
          "bestRating": "5"
        },
        "featureList": [
          "AI-Powered Testing",
          "Autonomous Bug Detection", 
          "Web Application Testing",
          "Mobile App Testing",
          "Real-time Reporting",
          "CI/CD Integration",
          "Performance Testing",
          "Security Testing"
        ]
      },
      {
        "@type": "Service",
        "name": "AI App Testing",
        "description": "Autonomous AI-powered testing service for web and mobile applications",
        "provider": {
          "@id": `${url}/#organization`
        },
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Testing Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Free Plan",
                "description": "1 free test per month with basic features"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "Pro Plan",
                "description": "25 tests per month with advanced features"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service", 
                "name": "Chaos Plan",
                "description": "Unlimited tests with premium features"
              }
            }
          ]
        }
      }
    ]
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="DEFFATEST" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:author" content={author} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:image:alt" content={title} />
      <meta property="twitter:creator" content="@deffatest" />
      <meta property="twitter:site" content="@deffatest" />

      {/* Additional Meta Tags for SEO */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="application-name" content="DEFFATEST" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="DEFFATEST" />
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://api.deffatest.online" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
