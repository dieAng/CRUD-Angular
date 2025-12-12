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

  { path: 'users', redirectTo: 'users/index', pathMatch: 'full' },
  {
    path: 'users/index',
    loadComponent: () => import('./users/index/index.component').then((m) => m.UserIndexComponent),
  },
  {
    path: 'users/create',
    loadComponent: () =>
      import('./users/create/create.component').then((m) => m.UserCreateComponent),
  },
  {
    path: 'users/:id/view',
    loadComponent: () => import('./users/view/view.component').then((m) => m.UserViewComponent),
  },
  {
    path: 'users/:id/edit',
    loadComponent: () => import('./users/edit/edit.component').then((m) => m.UserEditComponent),
  },
  { path: 'todos', redirectTo: 'todos/index', pathMatch: 'full' },
  {
    path: 'todos/index',
    loadComponent: () => import('./todos/index/index.component').then((m) => m.TodoIndexComponent),
  },
  {
    path: 'todos/create',
    loadComponent: () =>
      import('./todos/create/create.component').then((m) => m.TodoCreateComponent),
  },
  {
    path: 'todos/:id/view',
    loadComponent: () => import('./todos/view/view.component').then((m) => m.TodoViewComponent),
  },
  {
    path: 'todos/:id/edit',
    loadComponent: () => import('./todos/edit/edit.component').then((m) => m.TodoEditComponent),
  },
];
