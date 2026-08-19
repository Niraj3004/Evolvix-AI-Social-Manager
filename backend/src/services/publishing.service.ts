import { SocialAdapter } from '../adapters/SocialAdapter';
import { MetaAdapter } from '../adapters/MetaAdapter';
import { AppError } from '../middlewares/errorMiddleware';

export class PublishingService {
  private static getAdapter(platform: string): SocialAdapter {
    switch (platform.toLowerCase()) {
      case 'meta':
      case 'facebook':
      case 'instagram':
        return new MetaAdapter();
      default:
        throw new AppError(`Platform ${platform} is currently unsupported`, 400);
    }
  }

  public static async publish(platform: string, token: string, accountId: string, content: string): Promise<string> {
    const adapter = this.getAdapter(platform);
    return adapter.publish(token, accountId, content);
  }

  public static async fetchMetrics(platform: string, token: string, accountId: string, postId: string) {
    const adapter = this.getAdapter(platform);
    return adapter.fetchMetrics(token, accountId, postId);
  }
}
