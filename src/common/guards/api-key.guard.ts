import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validate(request.headers);
  }

  validate(headers) {
    const xApiKey = headers['x-api-key'];
    if (xApiKey === this.configService.get('X_API_KEY')) {
      return true;
    }
    return false;
  }
}
