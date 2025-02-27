import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { User } from '@interfaces/user';
import { UserService } from '@core/services/user.service';
import { DeleteButtonComponent } from '@shared/components/delete-button/delete-button.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    DeleteButtonComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  standalone: true
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'cellphone', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  loading = true;
  error = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.error = true;
        this.loading = false;
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user: user ? { ...user } : undefined }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  copyToClipboard(id: number): void {
    navigator.clipboard.writeText(id.toString()).then(() => {
      this.snackBar.open('ID copiado al portapapeles', 'Cerrar', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
