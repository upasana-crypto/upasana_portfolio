import { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Content',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'mainTitle',
      type: 'text',
      required: true,
      label: "Main Title (e.g., 'Upasana's Something')",
      defaultValue: "Upasana's Something",
    },
    {
      name: 'mainDescription',
      type: 'textarea',
      label: 'Main Description (appears under title)',
      admin: {
        description: 'Optional description text that appears below the main title.',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image for Entire Page',
      admin: {
        description: 'This image will be used as the background for the entire homepage.',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      required: true,
      label: 'Default Text Color',
      admin: {
        description:
          'Hex code (e.g., #FFFFFF) or Tailwind class (e.g., text-white) for fallback/default text color.',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Homepage Sections (Arts, Sciences)',
      minRows: 2,
      maxRows: 2,
      labels: {
        singular: 'Section',
        plural: 'Sections',
      },
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          required: true,
          label: 'Section Title (e.g., Arts, Sciences)',
        },
        {
          name: 'backgroundColor',
          type: 'text',
          required: true,
          label: 'Section Background Color',
          admin: {
            description: 'Hex code or Tailwind class (e.g., #FF7F50, bg-blue-700)',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          required: true,
          label: 'Section Text Color',
          admin: {
            description: 'Hex code or Tailwind class (e.g., #FFFFFF, text-white)',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Section Background Image (Optional)',
          admin: {
            description: 'Optional background image for this section.',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Section Icon (Optional)',
          admin: {
            description: 'Upload an SVG or PNG icon for this section.',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Sub-links within this Section',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Link Label (e.g., Nrtyopānā, WORK, Publications)',
            },
            {
              name: 'linkType',
              type: 'radio',
              options: [
                { label: 'Internal Page', value: 'internal' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'internal',
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'internalPage',
              type: 'relationship',
              relationTo: ['pages', 'posts'], //'projects',
              label: 'Select Internal Page/Project/Post',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'internal',
              },
            },
            {
              name: 'customUrl',
              type: 'text',
              label: 'Custom URL',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'custom',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default Homepage
