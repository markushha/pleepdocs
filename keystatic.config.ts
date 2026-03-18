import { config, collection, fields } from '@keystatic/core';

const storage =
  process.env.NODE_ENV === 'development'
    ? { kind: 'local' as const }
    : {
        kind: 'github' as const,
        repo: {
          owner: 'markushha',
          name: 'pleepdocs',
        },
      };

export default config({
  storage,
  collections: {
    docs: collection({
      label: 'Documentation',
      slugField: 'title',
      path: 'content/docs/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        description: fields.text({ label: 'Description' }),
        icon: fields.text({ label: 'Icon (Lucide icon name)' }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
