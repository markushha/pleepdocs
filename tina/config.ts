import { defineConfig } from 'tinacms';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  // Get your clientId and token from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'docs',
        label: 'Documentation',
        path: 'content/docs',
        format: 'mdx',
        match: {
          include: '**/*',
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'string',
            name: 'icon',
            label: 'Icon',
            description: 'Icon name for sidebar navigation',
          },
          {
            type: 'boolean',
            name: 'full',
            label: 'Full Width',
            description: 'Display page in full width mode',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
            templates: [
              {
                name: 'Callout',
                label: 'Callout',
                fields: [
                  {
                    name: 'type',
                    label: 'Type',
                    type: 'string',
                    options: ['info', 'warn', 'error'],
                  },
                  {
                    name: 'title',
                    label: 'Title',
                    type: 'string',
                  },
                  {
                    name: 'children',
                    label: 'Content',
                    type: 'rich-text',
                  },
                ],
              },
              {
                name: 'Steps',
                label: 'Steps',
                fields: [
                  {
                    name: 'children',
                    label: 'Steps Content',
                    type: 'rich-text',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
