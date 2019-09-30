import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router'
import { FSUser, UserService } from '../../core'

@Injectable()
export class UsersResolver implements Resolve<FSUser[]> {
  constructor(public userService: UserService, private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<FSUser[]> {
    try {
      const { skip, take } = route.queryParams
      const users = await this.userService.getUsers({
        skip: skip || 0,
        take: take || 10,
      })
      return users.docs.map((x) => x.data()) as FSUser[]
    } catch (error) {
      console.log(error)
      return []
    }
  }
}
