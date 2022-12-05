import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { FirebaseStorage, getDownloadURL, uploadBytesResumable } from "@angular/fire/storage";
import { getStorage, ref, StorageReference, uploadBytes } from "firebase/storage";
import { BehaviorSubject } from "rxjs";
import { SnackbarHelperService } from "../_helpers/snackbar.helper";

@Injectable({
  providedIn: 'root'
})
export class FirestoreUploadService implements OnInit{

  public storage!: FirebaseStorage;

  constructor(private snackbar: SnackbarHelperService){
    this.storage = getStorage();
  }
  ngOnInit() {}

  public imageRef = new BehaviorSubject<string>('');
  public dishImageRef = new BehaviorSubject<string>('');

  uploadImage(file: File, type: string){
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'god-diet/mountains.jpg'
    const storageRef = ref(this.storage, 'god-diet/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        https://stackoverflow.com/questions/63799899/how-do-you-recreate-the-automatically-generated-self-signed-cert-that-the-angula/63814027#63814027
        //https://trustsu.com/reactjs/permission-denied-please-enable-firebase-storage-for-your-bucket-by-visiting-the-storage-tab-in-the-firebase-console-and-ensure-that-you-have-sufficient-permission-to-properly-provision-reso/
        switch (error.code) {
          case 'storage/unauthorized':
            this.snackbar.createErrorNotification("Error: Unauthorized Storage");
            console.log(error);
            break;
          case 'storage/canceled':
            this.snackbar.createErrorNotification("Error: Storage Canceled");
            console.log(error);
            break;
          case 'storage/unknown':
            this.snackbar.createErrorNotification("Error: Unknown");
            console.log(error);
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if(type === 'dish'){
            this.dishImageRef.next(downloadURL);
          } else {
            this.imageRef.next(downloadURL);
          }
        });
      }
    );
  }

}
