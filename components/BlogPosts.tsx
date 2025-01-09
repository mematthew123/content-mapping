import React from "react";
import { getPosts } from "@/sanity/lib/queries";
import { Post } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

export default async function BlogPosts() {
  const posts = await getPosts(0, 6);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Stories and adventures from the road
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post: Post, index: number) => {
            const imageUrl = post.mainImage?.asset?._ref
              ? urlFor(post.mainImage).width(800).height(600).url()
              : null;
              const key = post.slug?.current || `post-${index}`;

            return (
              <article
                key={key}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={post.title || ""}
                    className="absolute inset-0 -z-10 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm text-gray-300">
                  <time dateTime={post.publishedAt}>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : ""}
                  </time>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-white">
                  <a href={`/post/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
