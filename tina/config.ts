import { TinaField, defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main";

const ruleFields = [
    {
        type: 'boolean',
        name: 'archived',
        label: 'Archived',
    },
    {
        type: 'string',
        name: 'title',
        label: 'Title',
        isTitle: true,
        required: true,
    },
    {
        type: 'rich-text',
        name: 'body',
        label: 'Body',
        isBody: true,
    },
];

export default defineConfig({
    branch,
    // Get this from tina.io
    clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
    // Get this from tina.io
    token: process.env.TINA_TOKEN,
    tinaioConfig: {
        frontendUrlOverride: 'https://app.tinajs.dev',
        identityApiUrlOverride: 'https://identity.tinajs.dev',
        contentApiUrlOverride: 'https://content.tinajs.dev',
        assetsApiUrlOverride: 'https://assets-api.tinajs.dev'
      },
    build: {
        outputFolder: "admin",
        publicFolder: "public",
    },
    media: {
        tina: {
            mediaRoot: "uploads",
            publicFolder: "public",
        },
    },
    // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
    schema: {
        collections: [
            {
              name: "post",
              label: "Posts",
              path: "content/posts",
              fields: [
                {
                  type: "string",
                  name: "title",
                  label: "Title",
                  isTitle: true,
                  required: true,
                },
                {
                  type: "rich-text",
                  name: "body",
                  label: "Body",
                  isBody: true,
                },
              ],
              ui: {
                // This is an DEMO router. You can remove this to fit your site
                router: ({ document }) => `/demo/blog/${document._sys.filename}`,
              },
            },
            {
                name: 'category',
                label: 'Categories',
                path: 'categories',
                format: 'md',
                fields: [
                    {
                        type: 'string',
                        name: 'type',
                        label: 'Type',
                        required: false
                    },
                    {
                        type: 'string',
                        name: 'uri',
                        label: 'URI Slug',
                        required: true,
                    },
                    {
                        type: 'string',
                        name: 'title',
                        label: 'Title',
                        isTitle: true,
                        required: true,
                    },
                    {
                        type: "object",
                        list: true,
                        name: "index",
                        label: "Rules",
                        ui: {
                            itemProps: (item) => {
                                return { label: item?.rule };
                            },
                        },
                        fields: [
                            {
                                type: 'reference',
                                name: 'rule',
                                label: 'Rule',
                                collections: ['rule'],
                                required: true,
                            }
                        ]
                    }
                ],
            },
            {
                name: 'rule',
                label: 'Rules',
                path: 'rules',
                format: 'md',
                fields: ruleFields as TinaField[],
            },
        ],
    },
});