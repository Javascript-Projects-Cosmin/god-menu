import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService implements OnInit{
  public isSmallScreen = false;
  public isSidenavOpen = true;
  public isHoverOpen = false;

  constructor() {}
  ngOnInit(): void {

  }

  public toggleSidenav(){
    setTimeout(()=>{this.isSidenavOpen = !this.isSidenavOpen;}, 50);//TODO: Implement a better way to avoid double toggle on menu click
  }

  public hoverOpenSidenav(){
    if(!this.isSmallScreen && !this.isSidenavOpen){
      this.isHoverOpen = true;
    }
  }
  public hoverCloseSidenav(){
    if(!this.isSmallScreen && this.isHoverOpen){
      this.isHoverOpen = false;
    }
  }
  public closeSidebarOnSmall() {
    if(this.isSmallScreen && this.isSidenavOpen){
      this.isSidenavOpen = false;
    }
  }

  public openSidebarOnSmall() {
    if(this.isSmallScreen && !this.isSidenavOpen){
      this.isSidenavOpen = true;
    }
  }

}
