import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoService } from '../todo.service';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user';

@Component({
  selector: 'app-todo-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <mat-card class="max-w-xl mx-auto">
        <mat-card-header>
          <mat-card-title>Create New Todo</mat-card-title>
        </mat-card-header>

        <mat-card-content class="pt-4">
          <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Buy groceries" />
              @if (form.get('title')?.hasError('required')) {
              <mat-error>Title is <strong>required</strong></mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Assign User</mat-label>
              <mat-select formControlName="userId">
                <mat-option>-- None --</mat-option>
                @for (user of users(); track user.id) {
                <mat-option [value]="user.id"> {{ user.name }} ({{ user.username }}) </mat-option>
                }
              </mat-select>
              @if (form.get('userId')?.hasError('required')) {
              <mat-error>User assignment is <strong>required</strong></mat-error>
              }
            </mat-form-field>

            <div>
              <mat-checkbox formControlName="completed" color="primary"
                >Mark as Completed</mat-checkbox
              >
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button routerLink="/todos">Cancel</button>
          <button mat-raised-button color="primary" (click)="submit()" [disabled]="form.invalid">
            Create Todo
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class TodoCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  users = signal<User[]>([]);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    userId: ['', Validators.required],
    completed: [false],
  });

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.users.set(data),
      error: (e) => this.snackBar.open('Error loading users', 'Close', { duration: 3000 }),
    });
  }

  submit(): void {
    if (this.form.valid) {
      const payload = { ...this.form.value, userId: Number(this.form.value.userId) };
      this.todoService.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Todo created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/todos']);
        },
        error: (e) => this.snackBar.open('Error creating todo', 'Close', { duration: 3000 }),
      });
    }
  }
}
