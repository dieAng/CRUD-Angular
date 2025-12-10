import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumService } from '../album.service';
import { Album } from '../album';

@Component({
  selector: 'app-albums-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class AlbumsIndexComponent implements OnInit {
  albums: Album[] = [];

  constructor(public albumService: AlbumService) {}

  ngOnInit(): void {
    this.albumService.getAll().subscribe((data: Album[]) => {
      this.albums = data;
    });
  }

  deleteAlbum(id: number) {
    this.albumService.delete(id).subscribe((res) => {
      this.albums = this.albums.filter((item) => item.id !== id);
      console.log('Album deleted successfully!');
    });
  }
}
