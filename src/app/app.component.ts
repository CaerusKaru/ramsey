import { Component } from '@angular/core';
import {Location} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public navLinks = [
    {route: '', label: 'Home'},
    {route: 'demos', label: 'Demos'},
    {route: 'refs', label: 'References'},
    {route: 'bios', label: 'Bios'}
  ];

  public activeLinkIndex = -1;

  constructor (
    public location: Location,
    public router: Router
  ) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event) => this.changeTab());
  }

  private changeTab() {
    const findTab = (nav) => {
      if (nav.route === '') {
        return this.router.url === '' || this.router.url === '/' || this.router.url.startsWith('section') ||
          this.router.url.startsWith('/section');
      }
      return this.location.path().indexOf(nav.route) !== -1;
    };

    this.activeLinkIndex =
      this.navLinks.indexOf(this.navLinks.find(findTab));
  }

}
