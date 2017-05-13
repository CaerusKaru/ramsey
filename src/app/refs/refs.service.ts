import { Injectable } from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';

@Injectable()
export class RefsService {

  constructor(
    private http: Http
  ) { }

  public downloadFile(resourceUrl: string) {
    return this.http.get(resourceUrl, { responseType: ResponseContentType.Blob })
      .map(res => res['_body']);
  }
}
