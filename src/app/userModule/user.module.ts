import { NgModule } from '@angular/core'
import { UsersComponent, UsersResolver } from './users'
import { UserComponent } from './user'
import { Location, CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      users: UsersResolver,
    },
    children: [
      {
        path: ':userId/',
        component: UserComponent,
      },
    ],
  },
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [UsersComponent, UserComponent],
  providers: [UsersResolver],
})
export class UserModule {}
