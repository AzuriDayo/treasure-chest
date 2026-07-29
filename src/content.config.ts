import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const collection = defineCollection({
  // Load Markdown and MDX files in the `src/content/collection/` directory.
  loader: glob({ base: "./src/content/collection", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      subImages: z.optional(z.array(image())),
      tags: z.array(z.string()).optional(),
      categories: z.array(z.string()).optional(),
    }),
});

export const collections = { collection };
