import { NextResponse } from 'next/server';
import * as nextJson from '@/next.json.mjs';
import * as nextData from '@/next-data/index.mjs';

// loads all the data from the blog-posts-data.json file
const websiteFeeds = nextData.generateWebsiteFeeds(nextJson.blogData);

type StaticParams = { params: { feed: string } };

// This is the Route Handler for the `GET` method which handles the request
// for Blog Feeds within the Node.js Website
export async function GET(_: Request, { params }: StaticParams) {
  if (params.feed.includes('.xml') && websiteFeeds.has(params.feed)) {
    return new NextResponse(websiteFeeds.get(params.feed)?.rss2(), {
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  return new NextResponse(null, { status: 404 });
}

// This function generates the static paths that come from the dynamic segments
// `en/feeds/[feed]` and returns an array of all available static paths
// this is useful for static exports, for example.
// Note that differently from the App Router these don't get built at the build time
// only if the export is already set for static export
export const generateStaticParams = () =>
  [...websiteFeeds.keys()].map(feed => ({ feed }));
