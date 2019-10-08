import { Routes } from '@angular/router'

import { LoginComponent } from './login/login.component'
import { AuthGuard } from './core/auth.guard'

// , canActivate: [AuthGuard]
export const rootRouterConfig: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'users',
    loadChildren: () =>
      import('./userModule/user.module').then((m) => m.UserModule),
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./postModule/post.module').then((m) => m.PostModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
]
