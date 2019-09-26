import { Component } from '@angular/core'
import { AuthService } from '../core/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  errorMessage = ''
  successMessage = ''

  constructor(public authService: AuthService, private router: Router) {}

  async tryGoogleLogin() {
    try {
      await this.authService.doGoogleLogin()
      this.router.navigate(['/user'])
    } catch (error) {
      console.log(error)
    }
  }
}
