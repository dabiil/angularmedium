import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router'
import { UserService } from '../core/user.service'
import { FirebaseUserModel } from '../core/user.model'

@Injectable()
export class UserResolver implements Resolve<FirebaseUserModel> {
  constructor(public userService: UserService, private router: Router) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<FirebaseUserModel> {
    const userModel = new FirebaseUserModel()

    try {
      const {
        displayName,
        providerData,
        photoURL,
      } = await this.userService.getCurrentUser()
      const { providerId } = providerData[0]

      userModel.image =
        providerId === 'password'
          ? 'https://via.placeholder.com/400x300'
          : photoURL
      userModel.name = displayName
      userModel.provider = providerId
      return userModel
    } catch (error) {
      this.router.navigate(['/login'])
      return error
    }
  }
}
