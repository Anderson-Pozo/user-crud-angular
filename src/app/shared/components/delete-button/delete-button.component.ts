import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { User } from '@interfaces/user';

@Component({
  selector: 'app-delete-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.css'
})
export class DeleteButtonComponent {
  @Input() item: User | undefined;
  @Output() delete = new EventEmitter<any>();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) { }

  confirmDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `¿Estás seguro de eliminar a ${this.item?.firstname}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete.emit(this.item);
        this.snackBar.open('Registro eliminado', 'Cerrar', { duration: 2000 });
      }
    });
  }
}