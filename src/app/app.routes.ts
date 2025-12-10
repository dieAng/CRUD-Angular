import { Routes } from '@angular/router';

import { IndexComponent } from './post/index/index';
import { ViewComponent } from './post/view/view';
import { CreateComponent } from './post/create/create';
import { EditComponent } from './post/edit/edit';

import { AlbumsIndexComponent } from './albums/index/index';
import { AlbumsViewComponent } from './albums/view/view';
import { AlbumsCreateComponent } from './albums/create/create';
import { AlbumsEditComponent } from './albums/edit/edit';

import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'post', redirectTo: 'post/index', pathMatch: 'full' },
  { path: 'post/index', component: IndexComponent },
  { path: 'post/:postId/view', component: ViewComponent },
  { path: 'post/create', component: CreateComponent },
  { path: 'post/:postId/edit', component: EditComponent },

  { path: 'albums', redirectTo: 'albums/index', pathMatch: 'full' },
  { path: 'albums/index', component: AlbumsIndexComponent },
  { path: 'albums/create', component: AlbumsCreateComponent },
  { path: 'albums/:id/view', component: AlbumsViewComponent },
  { path: 'albums/:id/edit', component: AlbumsEditComponent },
];
