import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { UserService } from './user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      if (this.userService.forceGetCurrentUser()) {
        this.router.navigate(['/'])
        return false
      }
    } catch {
    } finally {
      return true
    }
  }
}
