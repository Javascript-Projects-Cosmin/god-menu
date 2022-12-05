import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../components/loading/loading.service';

export const BYPASS_LOG = new HttpContextToken(() => false);

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  totalRequests = 0;
  requestsCompleted = 0;

  constructor(private loader: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.context.get(BYPASS_LOG) === false)
    {
        this.loader.loadingOn();
        this.totalRequests++;
    }


    return next.handle(request).pipe(
      finalize(() => {

        this.requestsCompleted++;

        if (this.requestsCompleted === this.totalRequests) {
          this.loader.loadingOff();
          this.totalRequests = 0;
          this.requestsCompleted = 0;
        }
      })
    );
  }
}
