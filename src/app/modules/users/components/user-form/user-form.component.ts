import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { User } from '@interfaces/user';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  dialogTitle: string = 'Crear Usuario';
  submitButtonLabel: string = 'Crear';
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();

    if (this.data && this.data.user) {
      this.isEditMode = true;
      this.dialogTitle = 'Editar Usuario';
      this.submitButtonLabel = 'Actualizar';
      this.userForm.patchValue({
        ...this.data.user,
        password: ''
      });

      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      const editPassword = this.userForm.value.password === '' ?
        this.data.user?.password :
        this.authService.hashPassword(this.userForm.value.password);

      this.userService.updateUser(this.data.user?.id!, {
        ...this.userForm.value,
        password: editPassword
      }).subscribe({
        next: (data) => {
          this.dialogRef.close(data);
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error({ error });
          this.snackBar.open('Ocurrió un error al actualizar el usuario', 'Cerrar', {
            duration: 3000
          });
        }
      });
    } else {
      const hashedPassword = this.authService.hashPassword(this.userForm.value.password);
      this.userService.createUser({
        ...this.userForm.value,
        password: hashedPassword
      }).subscribe({
        next: (data: User[]) => {
          this.dialogRef.close(data);
          this.snackBar.open('Usuario creado correctamente', 'Cerrar', {
            duration: 3000
          }
          );
        },
        error: (error) => {
          console.error({ error });
          this.snackBar.open('Ocurrió un error al crear el usuario', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
