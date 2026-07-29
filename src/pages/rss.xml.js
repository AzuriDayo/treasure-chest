import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getCollectionPath } from "../utils/collection";

export async function GET(context) {
  const posts = await getCollection("collection");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/collection/${getCollectionPath(post)}/`,
    })),
  });
}
