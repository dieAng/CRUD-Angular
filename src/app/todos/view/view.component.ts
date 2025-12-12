import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TodoService } from '../todo.service';
import { UserService } from '../../users/user.service';
import { Todo } from '../todo';
import { User } from '../../users/user';

@Component({
  selector: 'app-todo-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a mat-button color="primary" routerLink="/todos">
          <mat-icon>arrow_back</mat-icon> Back to Todos
        </a>
      </div>

      @if (todo()) {
      <mat-card
        class="max-w-2xl mx-auto border-l-8"
        [ngClass]="{ 'border-green-500': todo()?.completed, 'border-red-500': !todo()?.completed }"
      >
        <mat-card-header>
          <mat-card-title>{{ todo()?.title }}</mat-card-title>
        </mat-card-header>

        <mat-card-content class="pt-4">
          <mat-chip-set class="mb-4">
            <mat-chip [color]="todo()?.completed ? 'accent' : 'warn'" selected>
              {{ todo()?.completed ? 'Completed' : 'Pending' }}
            </mat-chip>
          </mat-chip-set>

          <mat-divider class="my-4"></mat-divider>

          <h3 class="text-md font-bold text-gray-500 uppercase tracking-wider mb-3">Assigned To</h3>

          @if (user()) {
          <div class="flex items-center mb-4">
            <div
              class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg mr-4"
            >
              {{ user()?.name?.charAt(0) }}
            </div>
            <div>
              <p class="font-bold text-lg">{{ user()?.name }}</p>
              <p class="text-gray-600 text-sm">@{{ user()?.username }}</p>
            </div>
          </div>

          <mat-list>
            <mat-list-item>
              <mat-icon matListItemIcon class="text-gray-500">email</mat-icon>
              <div matListItemTitle>Email</div>
              <div matListItemLine>{{ user()?.email }}</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon class="text-gray-500">phone</mat-icon>
              <div matListItemTitle>Phone</div>
              <div matListItemLine>{{ user()?.phone }}</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon class="text-gray-500">language</mat-icon>
              <div matListItemTitle>Website</div>
              <div matListItemLine>{{ user()?.website }}</div>
            </mat-list-item>
          </mat-list>

          <div class="mt-4 text-right">
            <a mat-button color="primary" [routerLink]="['/users', user()?.id, 'view']">
              View Full User Profile <mat-icon iconPositionEnd>arrow_forward</mat-icon>
            </a>
          </div>

          } @else {
          <p class="text-gray-500 italic">User information not available.</p>
          }
        </mat-card-content>
      </mat-card>
      } @else {
      <p class="text-center text-gray-500 mt-10">Loading todo details...</p>
      }
    </div>
  `,
  styles: [],
})
export class TodoViewComponent implements OnInit {
  todo = signal<Todo | null>(null);
  user = signal<User | null>(null);

  private route = inject(ActivatedRoute);
  private todoService = inject(TodoService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todoService.get(+id).subscribe({
        next: (todo) => {
          this.todo.set(todo);
          this.loadUser(todo.userId);
        },
        error: (e) => this.snackBar.open('Error loading todo', 'Close', { duration: 3000 }),
      });
    }
  }

  loadUser(userId: number): void {
    this.userService.get(userId).subscribe({
      next: (user) => this.user.set(user),
      error: (e) => this.snackBar.open('Error loading user', 'Close', { duration: 3000 }),
    });
  }
}
