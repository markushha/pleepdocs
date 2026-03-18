import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { i18n } from './i18n';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import { createElement } from 'react';

export const source = loader({
  i18n,
  baseUrl: '/',
  source: createMDXSource(docs.docs, docs.meta),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  },
});
