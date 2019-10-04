import { NgModule } from '@angular/core'
import { UsersComponent } from './users'
import { UserComponent } from './user'
import { Location, CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../core'

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'me',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      isCurrentUser: true,
    },
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: ':userId',
    component: UserComponent,
  },
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [UsersComponent, UserComponent],
  providers: [],
})
export class UserModule {}
