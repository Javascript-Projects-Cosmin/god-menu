import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-verify-mail',
  templateUrl: './verify-mail.component.html',
  styleUrls: ['./verify-mail.component.scss']
})
export class VerifyMailComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
