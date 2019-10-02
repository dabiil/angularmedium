import { Component } from '@angular/core'
import { AuthService } from '../core/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss'],
})
export class LoginComponent {
  errorMessage = ''

  constructor(public authService: AuthService, private router: Router) {}

  async tryGoogleLogin() {
    try {
      await this.authService.doGoogleLogin()
      this.errorMessage = ''
    } catch (error) {
      this.errorMessage = 'Something was wrong'
    }
  }
}
