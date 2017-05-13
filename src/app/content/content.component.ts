import {Component, HostListener, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {ContentService} from './content.service';
import {trigger, transition, style, animate} from '@angular/animations';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class ContentComponent implements OnInit {

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  public snippets: string[] = [];

  constructor(
    private contentService: ContentService
  ) {
  }

  ngOnInit() {
    this.contentService.snippets.subscribe(data => {
      this.snippets = data;
    });
  }

  get title () {
    return this.contentService.getTitle();
  }

  get hasImg () {
    return this.contentService.hasImg();
  }

  get imgSrc () {
    return this.contentService.imgSrc();
  }

  public forward() {
    this.contentService.nextSnippet();
  }

  public backward() {
    this.contentService.prevSnippet();
  }

  @HostListener('window:keydown', ['$event'])
  private advanceSpace (evt) {
    evt.preventDefault();
    if (evt.keyCode === 32 || evt.keyCode === 39) {
      this.contentService.nextSnippet();
      setTimeout(_ => { this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; }, 100);
    } else if (evt.keyCode === 37) {
      this.contentService.prevSnippet();
    }
  }
}

@Component({
  selector: 'app-snippet',
  template: `<div #content *ngIf="loaded" [@enterAnimation]="loaded"></div>`,
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('250ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('250ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class SnippetComponent implements OnInit {
  @Input() public templateUrl: string;

  @ViewChild('content') container: ElementRef;

  public loaded = false;

  constructor (
    private contentService: ContentService
  ) {
  }

  ngOnInit() {
    this.contentService.fetchTemplate(this.templateUrl).subscribe(
      data => {
        this.loaded = true;
        window.requestAnimationFrame(_ => {
          this.container.nativeElement.innerHTML = data;
        });
      }
    );
  }
}
