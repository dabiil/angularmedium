import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../core'
import { UsersComponent, UsersResolver } from './users'
import { UserComponent } from './user'
// default path /users
export const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      users: UsersResolver,
    },
  },
  {
    path: ':userId',
    component: UserComponent,
  },
  {
    path: 'me',
    component: UserComponent,
  },
]
