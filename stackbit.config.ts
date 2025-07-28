
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
        dashboardPage,
        dashboardPricingPage,
        uploadPage,
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
  siteMap: ({ documents }) => {
    return documents.map((doc) => ({
        stableId: doc.id,
        urlPath: doc.urlPath,
        document: doc,
        isHomePage: doc.urlPath === '/',
    }));
  },
});

