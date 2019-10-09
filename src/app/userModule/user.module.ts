import { NgModule } from '@angular/core'
import { UsersComponent } from './users'
import { UserComponent } from './user'
import { Location, CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../core'
import { PostModule } from '../postModule/post.module'

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/:userId',
    component: UserComponent,
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PostModule],
  declarations: [UsersComponent, UserComponent],
  providers: [],
})
export class UserModule {}
