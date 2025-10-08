// blocks/OwnContentMatrix/index.ts
import type { Block, Field } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

// Note: Replace this with your actual reusable link field function or implementation
// import { link } from '@/fields/link';

// --- 1. Content Element Blocks (The granular content types) ---

const RichTextElement: Block = {
  slug: 'richtext-element',
  interfaceName: 'RichtextElement',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      label: false,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h4', 'h5', 'h6'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}

const MediaElement: Block = {
  slug: 'media-element',
  interfaceName: 'MediaElement',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media', // CHECK: Replace 'media' with your actual Media collection slug
      required: true,
      label: 'Image or Video',
    },
  ],
}

const LinkElement: Block = {
  slug: 'link-element',
  interfaceName: 'LinkElement',
  fields: [
    // Use your reusable link function if available, otherwise use basic fields:
    {
      name: 'linkText',
      type: 'text',
      label: 'Button/Link Text',
      required: true,
    },
    {
      name: 'linkURL',
      type: 'text',
      label: 'URL',
      required: true,
    },
  ],
}

const allContentElements = [RichTextElement, MediaElement, LinkElement]

// --- 2. Column Fields (The container for content elements) ---

const columnFields: Field[] = [
  // Column Width Control (Grid system based on 12)
  {
    name: 'size',
    type: 'select',
    label: 'Column Width (out of 12)',
    defaultValue: '4',
    options: [
      { label: 'Full (12/12)', value: '12' },
      { label: 'Two Thirds (8/12)', value: '8' },
      { label: 'Half (6/12)', value: '6' },
      { label: 'One Third (4/12)', value: '4' },
      { label: 'Quarter (3/12)', value: '3' },
    ],
  },

  // Column Content (The Nested Blocks Field)
  {
    name: 'contentElements',
    type: 'blocks',
    label: 'Column Content',
    minRows: 1,
    blocks: allContentElements,
    admin: {
      initCollapsed: true,
    },
  },
]

// --- 3. Row Fields (The horizontal container for columns) ---

const rowFields: Field[] = [
  {
    name: 'rowTitle',
    type: 'text',
    admin: {
      description: 'Optional: Title for this row (only visible in Admin).',
    },
  },
  {
    name: 'backgroundStyle',
    type: 'select',
    label: 'Row Background Style',
    defaultValue: 'none',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Light Gray', value: 'light-gray' },
      { label: 'Dark Blue', value: 'dark-blue' },
    ],
  },
  {
    name: 'columns',
    type: 'array',
    minRows: 1,
    maxRows: 4,
    // ✅ CORRECT PLACEMENT for 'labels' on an Array field
    labels: {
      singular: 'Column',
      plural: 'Columns',
    },
    admin: {
      initCollapsed: true,
    },
    fields: columnFields,
  },
]

// --- 4. Main Block Definition ---

export const OwnContentMatrix: Block = {
  slug: 'own-content-matrix',
  // ✅ CORRECT PLACEMENT for 'labels' on a Block
  labels: {
    singular: 'Content Matrix',
    plural: 'Content Matrices',
  },
  interfaceName: 'OwnContentMatrixBlock',
  fields: [
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      // ✅ CORRECT PLACEMENT for 'labels' on an Array field
      labels: {
        singular: 'Row',
        plural: 'Rows',
      },
      admin: {
        initCollapsed: false,
      },
      fields: rowFields,
    },
  ],
}
