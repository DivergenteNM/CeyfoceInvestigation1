import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-alert',
  templateUrl: './login-alert.component.html'
})
export class LoginAlertComponent {

  constructor(private dialogRef: MatDialogRef<LoginAlertComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
