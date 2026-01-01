import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

/**
 * GET handler for redirecting short codes to full URLs
 * @param request - The incoming request
 * @param params - Route parameters containing the shortcode
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  // Fetch the link from the database
  const link = await getLinkByShortCode(shortcode);

  // If link not found, return 404
  if (!link) {
    return NextResponse.json(
      { error: "Link not found" },
      { status: 404 }
    );
  }

  // Redirect to the full URL
  return NextResponse.redirect(link.url, 307);
}
