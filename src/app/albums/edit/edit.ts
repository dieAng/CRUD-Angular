import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlbumService } from '../album.service';
import { Album } from '../album';

@Component({
  selector: 'app-albums-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class AlbumsEditComponent implements OnInit {
  id!: number;
  album!: Album;
  form!: FormGroup;

  constructor(
    public albumService: AlbumService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required]),
    });

    this.albumService.find(this.id).subscribe((data: Album) => {
      this.album = data;
      this.form.patchValue({
        title: this.album.title,
        userId: this.album.userId,
      });
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
    this.albumService.update(this.id, this.form.value).subscribe((res) => {
      console.log('Album updated successfully!');
      this.router.navigateByUrl('albums/index');
    });
  }
}
