import { Component, OnInit } from '@angular/core';

import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  public activeUser: User | undefined = undefined;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserData.subscribe((data: User) => {
      this.activeUser = data;
    })
  }

}
