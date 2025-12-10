import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-albums-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class AlbumsCreateComponent implements OnInit {
  form!: FormGroup;

  constructor(public albumService: AlbumService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
    this.albumService.create(this.form.value).subscribe((res) => {
      console.log('Album created successfully!');
      this.router.navigateByUrl('albums/index');
    });
  }
}
