import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { UserService } from '../core/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      await this.userService.getCurrentUser()
      this.router.navigate(['/user'])
      return true
    } catch (error) {
      return false
    }
  }
}
