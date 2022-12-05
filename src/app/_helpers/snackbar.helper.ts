import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarHelperService {
  snackBarNotificationDurationMs = 4000;

  constructor(private snackBar: MatSnackBar) {}

  public async createSuccessNotification(key = '', color = 'bg-success') {
    this.createNotification(key, color);
  }

  public async createErrorNotification(key = '', color = 'bg-danger') {
   this.createNotification(key, color);
  }

  dismissNotification() {
    this.snackBar.dismiss();
  }

  private createNotification(message: string, color: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: this.snackBarNotificationDurationMs,
      data: message,
      panelClass: color
    });
  }
}
