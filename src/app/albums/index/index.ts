import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlbumService } from '../album.service';
import { Album } from '../album';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';

@Component({
  selector: 'app-albums-index',
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
export class AlbumsIndexComponent implements OnInit {
  albums: Album[] = [];
  displayedColumns: string[] = ['id', 'title', 'userId', 'action'];

  constructor(public albumService: AlbumService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.albumService.getAll().subscribe((data: Album[]) => {
      this.albums = data;
    });
  }

  deleteAlbum(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Delete Album', message: 'Are you sure you want to delete this album?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.albumService.delete(id).subscribe((res) => {
          this.albums = this.albums.filter((item) => item.id !== id);
        });
      }
    });
  }
}
