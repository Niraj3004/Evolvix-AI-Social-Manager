export interface SocialAdapter {
  /**
   * Publishes a post to the specific social platform.
   * @param token The decrypted OAuth access token.
   * @param accountId The platform-specific account ID.
   * @param content The text body of the post.
   * @param mediaUrls Optional array of media URLs.
   * @returns The platform-specific post ID.
   */
  publish(token: string, accountId: string, content: string, mediaUrls?: string[]): Promise<string>;

  /**
   * Fetches metrics for a specific post.
   * @param token The decrypted OAuth access token.
   * @param accountId The platform-specific account ID.
   * @param postId The platform-specific post ID.
   * @returns An object containing standard metrics.
   */
  fetchMetrics(token: string, accountId: string, postId: string): Promise<{
    reach?: number;
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clicks?: number;
  }>;
}
