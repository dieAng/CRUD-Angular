import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostService } from '../post-s';
import { Post } from '../post';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class IndexComponent {
  posts: Post[] = [];
  displayedColumns: string[] = ['id', 'title', 'body', 'action'];

  page: number = 1;
  limit: number = 10;

  constructor(public postService: PostService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAll(this.page, this.limit).subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  nextPage() {
    this.page++;
    this.loadPosts();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPosts();
    }
  }

  deletePost(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete Post', message: 'Are you sure you want to delete this post?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postService.delete(id).subscribe((res) => {
          this.posts = this.posts.filter((item) => item.id !== id);
        });
      }
    });
  }
}
