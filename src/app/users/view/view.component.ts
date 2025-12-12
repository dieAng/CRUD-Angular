import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../user.service';
import { User } from '../user';
import { Todo } from '../../todos/todo';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a mat-button color="primary" routerLink="/users">
          <mat-icon>arrow_back</mat-icon> Back to Users
        </a>
      </div>

      @if (user()) {
      <mat-card class="mb-8 p-4">
        <mat-card-header>
          <div
            mat-card-avatar
            class="bg-primary text-white flex items-center justify-center rounded-full font-bold"
          >
            {{ user()?.name?.charAt(0) }}
          </div>
          <mat-card-title>{{ user()?.name }}</mat-card-title>
          <mat-card-subtitle>@{{ user()?.username }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                <mat-icon class="mr-2 text-gray-500">contact_mail</mat-icon> Contact Info
              </h3>
              <p><strong>Email:</strong> {{ user()?.email }}</p>
              <p><strong>Phone:</strong> {{ user()?.phone }}</p>
              <p><strong>Website:</strong> {{ user()?.website }}</p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                <mat-icon class="mr-2 text-gray-500">home</mat-icon> Address
              </h3>
              @if (user()?.address) {
              <p>{{ user()?.address?.street }}, {{ user()?.address?.suite }}</p>
              <p>{{ user()?.address?.city }}, {{ user()?.address?.zipcode }}</p>
              }
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                <mat-icon class="mr-2 text-gray-500">business</mat-icon> Company
              </h3>
              @if (user()?.company) {
              <p>
                <strong>{{ user()?.company?.name }}</strong>
              </p>
              <p class="italic text-gray-600">{{ user()?.company?.catchPhrase }}</p>
              }
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <mat-icon class="mr-2">task</mat-icon> Assigned Todos
        </h2>

        @if (todos().length === 0) {
        <p class="text-gray-500 italic">No todos found for this user.</p>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (todo of todos(); track todo.id) {
          <mat-card
            class="hover-card border-l-4"
            [ngClass]="{ 'border-green-500': todo.completed, 'border-red-500': !todo.completed }"
          >
            <mat-card-content class="p-4">
              <p class="text-gray-800 font-medium mb-3">{{ todo.title }}</p>
              <mat-chip-set>
                <mat-chip [color]="todo.completed ? 'accent' : 'warn'" selected>
                  {{ todo.completed ? 'Done' : 'Pending' }}
                </mat-chip>
              </mat-chip-set>
            </mat-card-content>
          </mat-card>
          }
        </div>
        }
      </div>
      } @else {
      <p class="text-center text-gray-500 mt-10">Loading user details...</p>
      }
    </div>
  `,
  styles: [
    `
      .hover-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class UserViewComponent implements OnInit {
  user = signal<User | null>(null);
  todos = signal<Todo[]>([]);

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const userId = +id;
      this.loadUser(userId);
      this.loadTodos(userId);
    }
  }

  loadUser(id: number): void {
    this.userService.get(id).subscribe({
      next: (data) => this.user.set(data),
      error: (e) => this.snackBar.open('Error loading user', 'Close', { duration: 3000 }),
    });
  }

  loadTodos(id: number): void {
    this.userService.getTodos(id).subscribe({
      next: (data) => this.todos.set(data),
      error: (e) => this.snackBar.open('Error loading todos', 'Close', { duration: 3000 }),
    });
  }
}
