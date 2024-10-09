import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    let tracker: string;

    if (req.headers) {
      if (req.headers['x-forwarded-for']) {
        tracker = req.headers['x-forwarded-for'];
      } else if (req.headers['cf-connecting-ip']) {
        const ips = req.headers['cf-connecting-ip'].split(', ');
        if (ips?.length) {
          tracker = ips[0];
        }
      }
    }

    console.log('tracker ip', tracker);
    return tracker;
  }
}
