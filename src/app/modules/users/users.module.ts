import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteButtonComponent } from '@shared/components/delete-button/delete-button.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [],
  imports: [
    DeleteButtonComponent,
    ConfirmDialogComponent,
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class UsersModule { }
