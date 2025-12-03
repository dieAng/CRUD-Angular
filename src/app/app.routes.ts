import { Routes } from '@angular/router';

import { IndexComponent } from './post/index/index';
import { ViewComponent } from './post/view/view';
import { CreateComponent } from './post/create/create';
import { EditComponent } from './post/edit/edit';

export const routes: Routes = [
  { path: 'post', redirectTo: 'post/index', pathMatch: 'full' },
  { path: 'post/index', component: IndexComponent },
  { path: 'post/:postId/view', component: ViewComponent },
  { path: 'post/create', component: CreateComponent },
  { path: 'post/:postId/edit', component: EditComponent },
];
