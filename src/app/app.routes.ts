import { Routes } from '@angular/router'

import { LoginComponent } from './login/login.component'
import { AuthGuard } from './core/auth.guard'

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'users',
    loadChildren: () =>
      import('./userModule/user.module').then((m) => m.UserModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
]
