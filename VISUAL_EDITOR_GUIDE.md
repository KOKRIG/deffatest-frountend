# Visual Editor Implementation Guide for Deffatest

## Overview
This guide explains how to implement Stackbit's visual editor for deffatest.online, allowing you to edit every aspect of your site - text, colors, images, fonts, animations, and more - without touching code.

## 1. Configuration Status ✅

### What's Done:
- **stackbit.config.ts** is fully configured with:
  - All page models for your site
  - Component models (buttons, pricing plans, etc.)
  - Theme fields for colors, fonts, and styles
  - Proper sitemap implementation

### Page Models Created:
- HomePage (/)
- Dashboard (/dashboard)
- Upload (/upload)
- Results (/results)
- Settings (/settings)
- Pricing (/pricing)
- Features (/features)
- Contact (/contact-us)
- Documentation (/docs)
- Login/Signup pages
- Legal pages (Terms, Privacy, Cookie Policy)
- And more...

## 2. Adding Visual Editor Attributes

To make your components editable, add these data attributes:

### Basic Structure:
```jsx
<div data-sb-object-id="unique-id">
  <h1 data-sb-field-path="title">Page Title</h1>
  <p data-sb-field-path="subtitle">Page subtitle text</p>
</div>
```

### Example for Your Dashboard:
```jsx
<DashboardLayout currentPage="dashboard" data-sb-object-id="dashboard-page">
  <div data-sb-field-path="header">
    <h1 data-sb-field-path=".greeting">{dashboardContent.header.greeting}</h1>
  </div>
  
  <div data-sb-field-path="planUsageSection">
    <h2 data-sb-field-path=".title">{dashboardContent.planUsageSection.title}</h2>
    <!-- Rest of the content -->
  </div>
</DashboardLayout>
```

### For Lists/Arrays:
```jsx
<div data-sb-field-path="features">
  {features.map((feature, index) => (
    <div key={index} data-sb-field-path={`.${index}`}>
      <h3 data-sb-field-path=".title">{feature.title}</h3>
      <p data-sb-field-path=".description">{feature.description}</p>
    </div>
  ))}
</div>
```

## 3. Making Styles Editable

### Background Colors:
```jsx
<div 
  style={{ backgroundColor: pageContent.theme?.backgroundColor || '#000000' }}
  data-sb-field-path="theme.backgroundColor"
>
```

### Text Colors:
```jsx
<h1 
  style={{ color: pageContent.theme?.textColor || '#ffffff' }}
  data-sb-field-path="theme.textColor"
>
  {pageContent.title}
</h1>
```

### Gradients:
```jsx
<div 
  style={{ 
    background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})` 
  }}
  data-sb-field-path="theme"
>
```

### Fonts:
```jsx
<h1 
  className={pageContent.theme?.font || 'font-orbitron'}
  data-sb-field-path="theme.font"
>
```

## 4. Content Files Structure

Create JSON files in `content/pages/` for each page:

### Example: content/pages/dashboard.json
```json
{
  "pageTitle": "Dashboard",
  "header": {
    "greeting": "Welcome back!"
  },
  "planUsageSection": {
    "title": "Plan Usage"
  },
  "quickActionsSection": {
    "title": "Quick Actions",
    "actions": [
      {
        "text": "Start New Test",
        "url": "/upload",
        "description": "Begin a new test session"
      }
    ]
  },
  "theme": {
    "backgroundColor": "#0a0a0a",
    "textColor": "#ffffff",
    "primaryColor": "#8b5cf6",
    "font": "font-orbitron",
    "glowEffect": true
  }
}
```

## 5. Images and Assets

### Making Images Editable:
```jsx
<img 
  src={pageContent.heroImage || '/default-hero.jpg'} 
  alt="Hero"
  data-sb-field-path="heroImage"
/>
```

### Background Images:
```jsx
<div 
  style={{ 
    backgroundImage: `url(${pageContent.backgroundImage})` 
  }}
  data-sb-field-path="backgroundImage"
>
```

## 6. Animations and Effects

### Glow Effects:
```jsx
<div 
  className={`${pageContent.theme?.glowEffect ? 'neon-glow-strong' : ''}`}
  data-sb-field-path="theme.glowEffect"
>
```

## 7. Implementation Steps for Each Page

### Step 1: Import Content
```jsx
import pageContent from '../../content/pages/[pagename].json';
```

### Step 2: Add Root Object ID
```jsx
<div data-sb-object-id="page-name">
```

### Step 3: Add Field Paths
Add `data-sb-field-path` to every editable element.

### Step 4: Use Content Values
Replace hardcoded values with content from JSON:
```jsx
// Before:
<h1>Welcome to Deffatest</h1>

// After:
<h1 data-sb-field-path="title">{pageContent.title}</h1>
```

## 8. Third-Party Integrations

### Asset Management:
You can connect:
- **Cloudinary** for image management
- **Aprimo** for digital assets
- **Bynder** for brand assets

These allow uploading and managing images directly from the visual editor.

## 9. Publishing Workflow

1. Content editors make changes in visual editor
2. Changes are saved to your Git repository
3. You can set up auto-merge to main branch
4. Netlify automatically deploys changes

## 10. Best Practices

1. **Always use data-sb-field-path**: Every editable element needs this
2. **Nest paths correctly**: Use dots for nested objects (e.g., "header.title")
3. **Array indices**: Use `.${index}` for array items
4. **Default values**: Always provide fallbacks for content
5. **Type consistency**: Match field types in config with actual usage

## 11. Testing Your Implementation

1. Run your site locally
2. Access Stackbit visual editor
3. Click on any element with data-sb attributes
4. You should see editing controls appear
5. Make changes and see them reflect instantly

## 12. Complete Example Component

```jsx
import React from 'react';
import heroContent from '../../content/pages/home.json';

function Hero() {
  const { heroTitle, heroSubtitle, heroImage, theme } = heroContent;

  return (
    <section 
      data-sb-object-id="hero-section"
      className={`hero ${theme?.glowEffect ? 'neon-glow' : ''}`}
      style={{
        backgroundColor: theme?.backgroundColor || '#000',
        color: theme?.textColor || '#fff',
        backgroundImage: `url(${heroImage})`
      }}
    >
      <h1 
        data-sb-field-path="heroTitle"
        className={theme?.font || 'font-orbitron'}
      >
        {heroTitle}
      </h1>
      
      <p data-sb-field-path="heroSubtitle">
        {heroSubtitle}
      </p>
      
      <div data-sb-field-path="theme" style={{ display: 'none' }}>
        {/* Hidden div to make theme editable */}
      </div>
    </section>
  );
}
```

## Next Steps

1. Create content JSON files for all your pages
2. Add data-sb attributes to all components
3. Test in Stackbit visual editor
4. Configure asset sources if needed
5. Set up publishing workflow

With this setup, you'll have complete control over every aspect of your site through the visual editor!
