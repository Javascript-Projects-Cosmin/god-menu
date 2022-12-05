import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { FirestoreUploadService } from 'src/app/_services/firestore-upload.service';
import { SidebarService } from 'src/app/_services/sidebar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public activeUser: User | undefined = undefined;
  public activityToString: string = '1';
  public shownComments: {dishId: string, dishName: string, comment: string, date: string, dishType: string}[] = [];

  constructor(public sidebarService: SidebarService, public authService: AuthService, public fireHost: FirestoreUploadService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.authService.getUserData.subscribe((data: User) => {
      this.activeUser = data;
      this.activityToString = `${data.activity}`;
      this.shownComments = data.comments.reverse().slice(0, 5);
    })
    this.fireHost.imageRef.subscribe((data: string) => {
      if(this.activeUser && this.activeUser.profilePicturePath && data !== ''){
        this.activeUser.profilePicturePath = data;
        this.cdr.detectChanges();
      }
    })
  }

  saveInfo(): void {
    if(this.activeUser !== undefined){
      this.activeUser.activity = Number(this.activityToString);
      this.authService.UpdateUser(this.activeUser);
    }
  }

  onFileUpload(event : any) {
    const file = event.target.files[0];
    this.fireHost.uploadImage(file, 'user');
  }

  checkType(input: string): string{
    return input.slice(0, input.indexOf('/') - 1);
  }

}
