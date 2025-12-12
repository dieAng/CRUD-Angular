import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <mat-card class="max-w-2xl mx-auto">
        <mat-card-header>
          <mat-card-title>Create New User</mat-card-title>
        </mat-card-header>

        <mat-card-content class="pt-4">
          <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="John Doe" />
                @if (form.get('name')?.hasError('required')) {
                <mat-error>Name is <strong>required</strong></mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="johndoe" />
                @if (form.get('username')?.hasError('required')) {
                <mat-error>Username is <strong>required</strong></mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="john@example.com" />
              @if (form.get('email')?.hasError('required')) {
              <mat-error>Email is <strong>required</strong></mat-error>
              } @if (form.get('email')?.hasError('email')) {
              <mat-error>Please enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Website</mat-label>
              <input matInput formControlName="website" />
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button routerLink="/users">Cancel</button>
          <button mat-raised-button color="primary" (click)="submit()" [disabled]="form.invalid">
            Create User
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class UserCreateComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    website: [''],
  });

  submit(): void {
    if (this.form.valid) {
      this.userService.create(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (e) => this.snackBar.open('Error creating user', 'Close', { duration: 3000 }),
      });
    }
  }
}
