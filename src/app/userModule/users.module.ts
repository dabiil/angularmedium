import { NgModule } from '@angular/core'
import { UsersComponent, UsersResolver } from './users'
import { UsersRoutingModule } from './users.routing'
import { Location, CommonModule } from '@angular/common'

@NgModule({
  imports: [UsersRoutingModule, CommonModule],
  declarations: [UsersComponent],
  providers: [UsersResolver],
})
export class UsersModule {}
