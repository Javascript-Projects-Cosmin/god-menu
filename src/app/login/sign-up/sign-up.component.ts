import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { FirestoreUploadService } from 'src/app/_services/firestore-upload.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public email: string = "";
  public password: string = "";
  public activity!: number;
  public age: number = 18;
  public name: string = "";
  public gender: string = "Man";
  public height: number = 180;
  public weight: number = 80;
  public profilePicturePath: string = "";

  constructor(
    public authService: AuthService,
    private fireHost: FirestoreUploadService,
    private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.fireHost.imageRef.subscribe((data: string) => {
      this.profilePicturePath = data;
      this.cdr.detectChanges();
    })
  }

  onFileSelected(event: any){
    const file:File = event.target.files[0];
    if (file) {
      this.fireHost.uploadImage(file, 'user');
    }
  }

}
