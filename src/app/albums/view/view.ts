import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlbumService } from '../album.service';
import { Album } from '../album';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-albums-view',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class AlbumsViewComponent implements OnInit {
  id!: number;
  album!: Album;
  images: string[] = [];

  constructor(
    public albumService: AlbumService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.albumService.find(this.id).subscribe((data: Album) => {
      this.album = data;
    });

    // Generate 10 random image URLs
    for (let i = 0; i < 10; i++) {
      // specific random sig to avoid browser caching same image
      this.images.push(`https://picsum.photos/300/200?random=${i}`);
    }
  }
}
