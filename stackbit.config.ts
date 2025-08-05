
import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

// ##################################################################
// ### COMPONENT MODELS #############################################
// ##################################################################

const theme = {
  name: "Theme",
  type: "object",
  label: "Theme",
  fields: [
    { name: "backgroundColor", type: "color", label: "Background Color" },
    { name: "textColor", type: "color", label: "Text Color" },
    { name: "borderColor", type: "color", label: "Border Color" },
    { name: "gradientFrom", type: "color", label: "Gradient From" },
    { name: "gradientTo", type: "color", label: "Gradient To" },
  ],
};

const button = {
  name: "Button",
  type: "object",
  label: "Button",
  fields: [
    { name: "text", type: "string", label: "Text" },
    { name: "url", type: "string", label: "URL" },
    { name: "icon", type: "string", label: "Icon (e.g., Rocket)" },
    { name: "theme", type: "style", label: "Theme", fields: theme.fields },
  ],
};

const plan = {
  name: "Plan",
  type: "object",
  label: "Pricing Plan",
  fields: [
    { name: "name", type: "string", required: true },
    { name: "price", type: "string", required: true },
    { name: "period", type: "string", default: "/month" },
    { name: "features", type: "list", items: { type: "string" } },
    { name: "isMostPopular", type: "boolean", label: "Is Most Popular?" },
    { name: "button", type: "object", fields: button.fields },
    { name: "theme", type: "style", fields: theme.fields },
  ],
};

const faqItem = {
    name: "FaqItem",
    type: "object",
    label: "FAQ Item",
    fields: [
        { name: "question", type: "string", required: true },
        { name: "answer", type: "markdown", required: true },
    ]
};

const comparisonTableRow = {
    name: "ComparisonTableRow",
    type: "object",
    label: "Comparison Table Row",
    fields: [
        { name: "feature", type: "string", required: true },
        { name: "free", type: "string", required: true },
        { name: "pro", type: "string", required: true },
        { name: "chaos", type: "string", required: true },
    ]
};

// ##################################################################
// ### PAGE MODELS ##################################################
// ##################################################################

const dashboardPage = {
  name: "DashboardPage",
  type: "page",
  urlPath: "/dashboard",
  filePath: "content/pages/dashboard.json",
  fields: [
    { name: "pageTitle", type: "string", label: "Page Title" },
    { 
        name: "header", 
        type: "object", 
        label: "Header",
        fields: [
            { name: "greeting", type: "string", label: "Greeting Text" },
        ]
    },
    { 
        name: "planUsageSection", 
        type: "object", 
        label: "Plan Usage Section",
        fields: [
            { name: "title", type: "string", label: "Title" },
        ]
    },
    { 
        name: "quickActionsSection", 
        type: "object", 
        label: "Quick Actions Section",
        fields: [
            { name: "title", type: "string", label: "Title" },
            { name: "actions", type: "list", label: "Actions", items: { type: "object", fields: button.fields } },
        ]
    },
  ],
};

const dashboardPricingPage = {
  name: "DashboardPricingPage",
  type: "page",
  urlPath: "/dashboard/pricing",
  filePath: "content/pages/pricing.json",
  fields: [
    { name: "title", type: "string", label: "Title" },
    { name: "subtitle", type: "string", label: "Subtitle" },
    { name: "plans", type: "list", label: "Plans", items: { type: "object", fields: plan.fields } },
    { 
        name: "comparisonSection", 
        type: "object", 
        label: "Comparison Section",
        fields: [
            { name: "title", type: "string", label: "Title" },
            { name: "tableHeaders", type: "list", items: { type: "string" } },
            { name: "rows", type: "list", items: { type: "object", fields: comparisonTableRow.fields } },
        ]
    },
    { 
        name: "faqSection", 
        type: "object", 
        label: "FAQ Section",
        fields: [
            { name: "title", type: "string", label: "Title" },
            { name: "faqs", type: "list", items: { type: "object", fields: faqItem.fields } },
        ]
    },
  ],
};

const uploadPage = {
  name: "UploadPage",
  type: "page",
  urlPath: "/upload",
  filePath: "content/pages/upload.json",
  fields: [
    { name: "title", type: "string", label: "Title" },
    { name: "webOptionTitle", type: "string", label: "Web Option Title" },
    { name: "webOptionDescription", type: "string", label: "Web Option Description" },
    { name: "appOptionTitle", type: "string", label: "App Option Title" },
    { name: "appOptionDescription", type: "string", label: "App Option Description" },
    { name: "slotsFullTitle", type: "string", label: "Slots Full Title" },
    { name: "slotsFullMessage", type: "string", label: "Slots Full Message" },
  ],
};

const genericPage = {
    name: "GenericPage",
    type: "page",
    urlPath: "/{slug}",
    filePath: "content/pages/{slug}.md",
    fields: [
        { name: "title", type: "string", required: true },
        { name: "content", type: "markdown", required: true }
    ]
};

// Landing/Home Page
const homePage = {
  name: "HomePage",
  type: "page",
  urlPath: "/",
  filePath: "content/pages/home.json",
  fields: [
    { name: "heroTitle", type: "string", label: "Hero Title" },
    { name: "heroSubtitle", type: "string", label: "Hero Subtitle" },
    { name: "heroImage", type: "image", label: "Hero Background Image" },
    { name: "features", type: "list", label: "Features", items: { type: "object", fields: [
      { name: "icon", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "text" }
    ]}},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Contact Page
const contactPage = {
  name: "ContactPage",
  type: "page",
  urlPath: "/contact-us",
  filePath: "content/pages/contact.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "subtitle", type: "string", label: "Page Subtitle" },
    { name: "email", type: "string", label: "Contact Email" },
    { name: "phone", type: "string", label: "Contact Phone" },
    { name: "address", type: "text", label: "Address" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Features Page
const featuresPage = {
  name: "FeaturesPage",
  type: "page",
  urlPath: "/features",
  filePath: "content/pages/features.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "subtitle", type: "string", label: "Page Subtitle" },
    { name: "features", type: "list", label: "Features List", items: { type: "object", fields: [
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "icon", type: "string" },
      { name: "image", type: "image" }
    ]}},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Pricing Page (Public)
const pricingPage = {
  name: "PricingPage",
  type: "page",
  urlPath: "/pricing",
  filePath: "content/pages/pricing-public.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "subtitle", type: "string", label: "Page Subtitle" },
    { name: "plans", type: "list", label: "Pricing Plans", items: { type: "object", fields: plan.fields }},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// How It Works Page
const howItWorksPage = {
  name: "HowItWorksPage",
  type: "page",
  urlPath: "/how-it-works",
  filePath: "content/pages/how-it-works.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "steps", type: "list", label: "Process Steps", items: { type: "object", fields: [
      { name: "number", type: "string" },
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "image", type: "image" }
    ]}},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Use Cases Page
const useCasesPage = {
  name: "UseCasesPage",
  type: "page",
  urlPath: "/use-cases",
  filePath: "content/pages/use-cases.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "cases", type: "list", label: "Use Cases", items: { type: "object", fields: [
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "industry", type: "string" },
      { name: "image", type: "image" }
    ]}},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Documentation Page
const documentationPage = {
  name: "DocumentationPage",
  type: "page",
  urlPath: "/docs",
  filePath: "content/pages/documentation.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "sections", type: "list", label: "Doc Sections", items: { type: "object", fields: [
      { name: "title", type: "string" },
      { name: "content", type: "markdown" }
    ]}},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Legal Pages
const termsPage = {
  name: "TermsPage",
  type: "page",
  urlPath: "/terms",
  filePath: "content/pages/terms.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "content", type: "markdown", label: "Terms Content" },
    { name: "lastUpdated", type: "date", label: "Last Updated" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

const privacyPage = {
  name: "PrivacyPage",
  type: "page",
  urlPath: "/privacy-policy",
  filePath: "content/pages/privacy.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "content", type: "markdown", label: "Privacy Policy Content" },
    { name: "lastUpdated", type: "date", label: "Last Updated" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

const cookiePolicyPage = {
  name: "CookiePolicyPage",
  type: "page",
  urlPath: "/cookie-policy",
  filePath: "content/pages/cookie-policy.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "content", type: "markdown", label: "Cookie Policy Content" },
    { name: "lastUpdated", type: "date", label: "Last Updated" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Auth Pages
const loginPage = {
  name: "LoginPage",
  type: "page",
  urlPath: "/login",
  filePath: "content/pages/login.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "subtitle", type: "string", label: "Page Subtitle" },
    { name: "forgotPasswordText", type: "string", label: "Forgot Password Text" },
    { name: "signUpText", type: "string", label: "Sign Up Text" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

const signupPage = {
  name: "SignupPage",
  type: "page",
  urlPath: "/signup",
  filePath: "content/pages/signup.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "subtitle", type: "string", label: "Page Subtitle" },
    { name: "loginText", type: "string", label: "Login Text" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// Dashboard Pages
const resultsPage = {
  name: "ResultsPage",
  type: "page",
  urlPath: "/results",
  filePath: "content/pages/results.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "emptyStateText", type: "string", label: "Empty State Text" },
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

const settingsPage = {
  name: "SettingsPage",
  type: "page",
  urlPath: "/settings",
  filePath: "content/pages/settings.json",
  fields: [
    { name: "title", type: "string", label: "Page Title" },
    { name: "sections", type: "list", label: "Settings Sections", items: { type: "object", fields: [
      { name: "title", type: "string" },
      { name: "description", type: "string" }
    ]}},
    { name: "theme", type: "style", fields: theme.fields }
  ]
};

// ##################################################################
// ### STACKBIT CONFIG ##############################################
// ##################################################################

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "vite",
  nodeVersion: "18",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        // Page models
        homePage,
        dashboardPage,
        dashboardPricingPage,
        uploadPage,
        resultsPage,
        settingsPage,
        contactPage,
        featuresPage,
        pricingPage,
        howItWorksPage,
        useCasesPage,
        documentationPage,
        termsPage,
        privacyPage,
        cookiePolicyPage,
        loginPage,
        signupPage,
        genericPage,
        // Component models
        button,
        plan,
        faqItem,
        comparisonTableRow,
      ],
      assetsConfig: {
        referenceType: "static",
        staticDir: "public",
        uploadDir: "images",
        publicPath: "/",
      },
    }),
  ],
  siteMap: ({ documents, models }) => {
    // Filter all page models
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      // Filter all documents which are of a page model
      .filter((d) => pageModels.some(m => m.name === d.modelName))
      // Map each document to a SiteMapEntry
      .map((document) => {
        // Find the model for this document
        const model = models.find(m => m.name === document.modelName);
        if (!model) return null;

        // Use the urlPath from the model or construct it dynamically
        let urlPath = model.urlPath || '/';
        
        // Replace placeholders in the URL path
        if (urlPath.includes('{slug}')) {
          const slug = document.fields?.slug?.value || document.id;
          urlPath = urlPath.replace('{slug}', slug);
        }

        return {
          stableId: document.id,
          urlPath: urlPath,
          document,
          isHomePage: urlPath === '/',
        };
      })
      .filter(Boolean);
  },
});

