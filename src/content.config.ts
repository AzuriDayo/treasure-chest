import { defineCollection } from "astro:content";
import { glob, type LoaderContext, type ParseDataOptions } from "astro/loaders";
import { z } from "astro/zod";
import { existsSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const markdownLoader = glob({
  base: "./src/content/collection",
  pattern: "**/*.{md,mdx}",
});

function resolveImagePath(imagePath: unknown, filePath?: string) {
  if (
    typeof imagePath !== "string" ||
    !filePath ||
    imagePath.startsWith(".") ||
    imagePath.startsWith("/") ||
    imagePath.includes("://") ||
    imagePath.includes("/")
  ) {
    return imagePath;
  }

  const postName = basename(filePath, extname(filePath));
  const postImagePath = join(dirname(filePath), postName, imagePath);

  return existsSync(postImagePath) ? `./${postName}/${imagePath}` : imagePath;
}

function resolvePostImages<TData extends Record<string, unknown>>(
  data: TData,
  filePath?: string,
): TData {
  return {
    ...data,
    heroImage: resolveImagePath(data.heroImage, filePath),
    subImages: Array.isArray(data.subImages)
      ? data.subImages.map((image) => resolveImagePath(image, filePath))
      : data.subImages,
  } as TData;
}

const collectionLoader = {
  name: "collection-loader",
  load(context: LoaderContext) {
    return markdownLoader.load({
      ...context,
      parseData: <TData extends Record<string, unknown>>({
        id,
        data,
        filePath,
      }: ParseDataOptions<TData>) =>
        context.parseData<TData>({
          id,
          data: resolvePostImages(data, filePath),
          filePath,
        }),
    });
  },
};

const collection = defineCollection({
  // Load Markdown and MDX files in the `src/content/collection/` directory.
  loader: collectionLoader,
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
      showDate: z.boolean().default(true).optional(),
    }),
});

export const collections = { collection };
