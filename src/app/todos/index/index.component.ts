import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';

@Component({
  selector: 'app-todo-index',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Todos</h1>
        <a mat-raised-button color="primary" routerLink="/todos/create">
          <mat-icon>add</mat-icon> Create New Todo
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (todo of todos(); track todo.id) {
        <mat-card
          class="h-100 hover-card border-l-4"
          [ngClass]="{ 'border-green-500': todo.completed, 'border-red-500': !todo.completed }"
        >
          <mat-card-content class="pt-4">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-medium leading-snug">{{ todo.title }}</h3>
            </div>

            <mat-chip-set>
              <mat-chip [color]="todo.completed ? 'accent' : 'warn'" selected>
                {{ todo.completed ? 'Done' : 'Pending' }}
              </mat-chip>
            </mat-chip-set>
          </mat-card-content>

          <mat-card-actions align="end">
            <a
              mat-icon-button
              color="primary"
              [routerLink]="['/todos', todo.id, 'view']"
              matTooltip="View"
            >
              <mat-icon>visibility</mat-icon>
            </a>
            <a
              mat-icon-button
              color="accent"
              [routerLink]="['/todos', todo.id, 'edit']"
              matTooltip="Edit"
            >
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button color="warn" (click)="deleteTodo(todo.id)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
        }
      </div>
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
export class TodoIndexComponent implements OnInit {
  todos = signal<Todo[]>([]);
  private todoService = inject(TodoService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.todoService.getAll().subscribe({
      next: (data) => this.todos.set(data.slice(0, 50)),
      error: (e) => this.snackBar.open('Error loading todos', 'Close', { duration: 3000 }),
    });
  }

  deleteTodo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete Todo', message: 'Are you sure you want to delete this todo?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoService.delete(id).subscribe({
          next: () => {
            this.todos.update((current) => current.filter((t) => t.id !== id));
            this.snackBar.open('Todo deleted successfully', 'Close', { duration: 3000 });
          },
          error: (e) => this.snackBar.open('Error deleting todo', 'Close', { duration: 3000 }),
        });
      }
    });
  }
}
