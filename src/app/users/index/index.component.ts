import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../user';
import { UserService } from '../user.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Users</h1>
        <a mat-raised-button color="primary" routerLink="/users/create">
          <mat-icon>add</mat-icon> Create New User
        </a>
      </div>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="users()" class="w-full">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <!-- Username Column -->
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Username</th>
            <td mat-cell *matCellDef="let user">{{ user.username }}</td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <a
                mat-icon-button
                color="primary"
                [routerLink]="['/users', user.id, 'view']"
                matTooltip="View"
              >
                <mat-icon>visibility</mat-icon>
              </a>
              <a
                mat-icon-button
                color="accent"
                [routerLink]="['/users', user.id, 'edit']"
                matTooltip="Edit"
              >
                <mat-icon>edit</mat-icon>
              </a>
              <button
                mat-icon-button
                color="warn"
                (click)="deleteUser(user.id)"
                matTooltip="Delete"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      .mat-column-actions {
        width: 150px;
        text-align: right;
      }
    `,
  ],
})
export class UserIndexComponent implements OnInit {
  users = signal<User[]>([]);
  displayedColumns: string[] = ['name', 'username', 'email', 'actions'];

  page = 1;
  limit = 5;
  isLoading = false;
  allUsersLoaded = false;

  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    if (this.isLoading || this.allUsersLoaded) return;

    this.isLoading = true;
    this.userService.getAll(this.page, this.limit).subscribe({
      next: (data) => {
        if (data.length < this.limit) {
          this.allUsersLoaded = true;
        }
        this.users.update((current) => [...current, ...data]);
        this.isLoading = false;
      },
      error: (e) => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      if (!this.isLoading && !this.allUsersLoaded) {
        this.page++;
        this.loadUsers();
      }
    }
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete User', message: 'Are you sure you want to delete this user?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.delete(id).subscribe({
          next: () => {
            this.users.update((currentUsers) => currentUsers.filter((u) => u.id !== id));
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          },
          error: (e) => this.snackBar.open('Error deleting user', 'Close', { duration: 3000 }),
        });
      }
    });
  }
}
