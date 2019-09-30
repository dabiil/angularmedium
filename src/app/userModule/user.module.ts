import { NgModule } from '@angular/core'
import { UsersComponent, UsersResolver } from './users'
import { UserComponent } from './user'
import { Location, CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { routes } from './user.routing'

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [UsersComponent, UserComponent],
  providers: [UsersResolver],
})
export class UserModule {}
