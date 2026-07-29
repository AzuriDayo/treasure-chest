import type { CollectionEntry } from "astro:content";

type CollectionPost = CollectionEntry<"collection">;

export function isCollectionIndex(post: CollectionPost) {
  return /(?:^|\/)index\.(?:md|mdx)$/.test(post.filePath?.replaceAll("\\", "/") ?? "");
}

export function getCollectionPath(post: CollectionPost) {
  return isCollectionIndex(post) ? post.id.replace(/\/index$/, "") : post.id;
}

export function getCollectionPosts(posts: CollectionPost[]) {
  return getChildPosts(posts, "");
}

function getChildPosts(posts: CollectionPost[], parentPath: string) {
  return posts.filter((post) => {
    const postPath = getCollectionPath(post);
    const separatorIndex = postPath.lastIndexOf("/");
    const postParentPath = separatorIndex === -1 ? "" : postPath.slice(0, separatorIndex);

    return postParentPath === parentPath;
  });
}

export function getNestedPosts(posts: CollectionPost[], collection: CollectionPost) {
  if (!isCollectionIndex(collection)) return [];

  const collectionPath = getCollectionPath(collection);
  return getChildPosts(posts, collectionPath).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
