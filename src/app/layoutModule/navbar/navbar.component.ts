import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core'
import { UserService, AuthService, IUser } from '../../core'
import { Router } from '@angular/router'
import { fromEvent } from 'rxjs'
import { map, scan, throttleTime } from 'rxjs/operators'

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: IUser
  isHided = false

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.chRef.markForCheck()
    })
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(50),
        map(() => window.scrollY),
        scan((prevValue, newValue) => {
          if (newValue > prevValue) {
            this.isHided = true
          } else {
            this.isHided = false
          }
          return newValue
        }, 0)
      )
      .subscribe()
  }

  async navigate(path: any[], e: any) {
    e.preventDefault()
    await this.ngZone.run(() => this.router.navigate(path))
  }

  async logIn() {
    try {
      await this.authService.doGoogleLogin()
    } catch (error) {
      console.log(error)
    }
  }

  async logOut() {
    try {
      await this.authService.doLogout()
    } catch (error) {
      console.log(error)
    }
  }
}
