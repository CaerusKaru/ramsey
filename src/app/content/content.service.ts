import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ContentService {

  public snippets: Observable<string[]>;

  private config;
  private currentSub: number = null;
  private currentSec: number = null;
  private currentState = 0;

  private _snippets: BehaviorSubject<string[]> = new BehaviorSubject([]);

  // ROUTE -> changes

  constructor(
    private http: Http,
    private router: Router
  ) {
    this.snippets = this._snippets.asObservable();
    this.initConfig();
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event) => {
        const routerParams = this.router.url.split('/');
        this.currentState = 0;
        this.currentSub = parseFloat(routerParams[routerParams.length - 1]);
        this.currentSec = parseFloat(routerParams[routerParams.length - 2]);
        if (this.validState(this.currentSec, this.currentSub, this.currentState)) {
          this._snippets.next([this.httpString(this.currentSec, this.currentSub, this.currentState)]);
        } else {
          this._snippets.next([]);
        }
      });
  }

  public getTitle(): string {
    if (!this.config) {
      return null;
    }
    if (this.currentSec === null || this.currentSub === null || this.currentState === null) {
      return null;
    }
    return this.config[this.currentSec].subsections[this.currentSub].title || this.config[this.currentSec].title;
  }

  public hasImg(): boolean {
    if (!this.config) {
      return false;
    }
    if (this.currentSec === null || this.currentSub === null || this.currentState === null) {
      return false;
    }
    return this.config[this.currentSec].subsections[this.currentSub].snippets[this.currentState].hasImg;
  }

  public imgSrc(): string {
    if (this.currentSec === null || this.currentSub === null || this.currentState === null) {
      return null;
    }
    return this.config[this.currentSec].subsections[this.currentSub].snippets[this.currentState].imgSrc;
  }

  public nextSnippet () {
    if (this.validState(this.currentSec, this.currentSub, this.currentState + 1)) {
      console.log('next state');
      this._snippets.next(this._snippets.getValue().concat(...[this.httpString(this.currentSec, this.currentSub,
        this.currentState + 1)]));
      this.currentState += 1;
    } else if (this.validState(this.currentSec, this.currentSub + 1, 0)) {
      console.log('next sub');
      this._snippets.next([this.httpString(this.currentSec, this.currentSub + 1, 0)]);
      this.currentSub += 1;
      this.currentState = 0;
      this.router.navigate(['/section', this.currentSec, this.currentSub]);
    } else {
      console.log('next sec');
      this.currentState = 0;
      this.router.navigate(['/section', this.currentSec + 1, 0]);
    }
  }

  public prevSnippet () {
    if (this.validState(this.currentSec, this.currentSub, this.currentState - 1)) {
      console.log('prev state');
      console.log(this.currentState - 1);
      this._snippets.next(this._snippets.getValue().slice(0, -1));
      this.currentState -= 1;
    } else if (this.validState(this.currentSec, this.currentSub - 1, 0)) {
      console.log('prev sub');
      const newSnips = [];
      const snipsLength = this.config[this.currentSec].subsections[this.currentSub - 1].snippets.length;
      for (let i = 0; i < snipsLength; i++) {
        newSnips.push(this.httpString(this.currentSec, this.currentSub - 1, i));
      }
      this._snippets.next(newSnips);
      this.currentSub -= 1;
      this.currentState = this.config[this.currentSec].subsections[this.currentSub].snippets.length - 1;
      this.router.navigate(['/section', this.currentSec, this.currentSub]);
    } else {
      console.log('prev sec');
      if (this.currentSec - 1 < 0) {
        return;
      }
      this.currentSub = this.config[this.currentSec - 1].subsections.length - 1;
      this.currentState = this.config[this.currentSec - 1].subsections[this.currentSub].snippets.length - 1;
      const newSnips = [];
      const snipsLength = this.config[this.currentSec - 1].subsections[this.currentSub].snippets.length;
      for (let i = 0; i < snipsLength; i++) {
        newSnips.push(this.httpString(this.currentSec - 1, this.currentSub, i));
      }
      this._snippets.next(newSnips);
      this.router.navigate(['/section', this.currentSec - 1, this.currentSub]);
    }
  }

  public fetchTemplate (templateUrl: string): Observable<string> {
    return this.http.get(templateUrl)
      .map((res: Response) => res['_body'])
      .catch(this.handleError);
  }

  private validState (section: number, subsection: number, state: number) {
    if (!this.config) {
      return false;
    }
    if (section < 0 || subsection < 0 || state < 0) {
      return false;
    }
    if (section === null || subsection === null || state === null) {
      return false;
    }
    return this.config[section] && this.config[section].subsections[subsection] &&
      this.config[section].subsections[subsection].snippets[state];
  }

  private httpString (section: number, subsection: number, state: number) {
    return `./assets/repo/html/${section}/${subsection}/${state}.html`;
  }

  private initConfig () {
    this.http.get('./assets/repo/config.json')
      .map(this.extractData)
      .catch(this.handleError)
      .subscribe(
        data => {
          this.config = data.sections;
          const routerParams = this.router.url.split('/');
          this.currentSec = parseFloat(routerParams[routerParams.length - 2]);
          this.currentSub = parseFloat(routerParams[routerParams.length - 1]);
          if (this.validState(this.currentSec, this.currentSub, this.currentState)) {
            this._snippets.next([this.httpString(this.currentSec, this.currentSub, this.currentState)]);
          } else {
            this._snippets.next([]);
          }
        }
      );
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || { };
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
