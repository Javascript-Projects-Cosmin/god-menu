import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { E } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';
import { DishService } from './_services/dish.service';
import { SidebarService } from './_services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('word-appear', [
      state('close', style({ opacity: 0, display: 'none' })),
      state('open', style({ opacity: 1 })),
      transition('close => open', [animate('0.5s 0.2s ease-in', keyframes([
        style({display: 'block', offset: 0.3})
      ]))]),
      transition('open => close', [animate('0.1s')])
    ]),
    trigger('logo-appear', [
      state('close', style({ opacity: 0, display: 'none' })),
      state('open', style({ opacity: 1 })),
      transition('close => open', [animate('0.5s 0.2s ease-in', keyframes([
        style({display: 'block', offset: 0.7})
      ]))]),
      transition('open => close', [animate('0.5s ease-in', keyframes([
        style({display: 'none', offset: 0})
      ]))])
    ]),
  ],
})
export class AppComponent implements OnInit{
  public activeUser: User | undefined = undefined;

  public sidenavItems = [
    {"title": "Breakfasts", "route": "/breakfasts", "icon": "breakfast_dining"},
    {"title": "Meals", "route": "/meals", "icon": "restaurant"},
    {"title": "Snacks", "route": "/snacks", "icon": "icecream"},

  ]
  public authSidenavItems = [
    {"title": "Profile", "route": "/profile", "icon": "face"},
    {"title": "Fridge", "route": "/fridge", "icon": "kitchen"},
    {"title": "Stats", "route": "/stats", "icon": "query_stats"},
    {"title": "Planner", "route": "/planner", "icon": "event_available"},
  ]
  // Sidenav functionality

  public activeRoute: string = "";

  constructor(
    private breakpointObserver: BreakpointObserver,
    private eRef: ElementRef,
    private router: Router,
    public authService: AuthService,
    public dishService: DishService,
    public sidebarService: SidebarService,
  ) {}

  ngOnInit(): void {
    this.sidebarService.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 1000px)');
    this.breakpointObserver.observe('(max-width: 1000px)').subscribe((result) => {
      this.sidebarService.isSmallScreen = result.matches;
    });
    this.router.events.subscribe((event: any) => {
      if(event instanceof NavigationStart) {
        this.activeRoute = event.url.split("?")[0];
      }
    });
    this.authService.getUserData.subscribe((data: User) => {
      if(data !== undefined){
        this.activeUser = data;
      } else {
        this.activeUser = undefined;
      }
    })
  }

  public userLogout() {
    this.authService.SignOut();
  }

}
