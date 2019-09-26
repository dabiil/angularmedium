import { Component, OnInit } from '@angular/core'
import { AuthService } from '../core/auth.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  errorMessage = ''

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  async tryGoogleLogin() {
    try {
      await this.authService.doGoogleLogin()
      this.errorMessage = ''
      this.router.navigate(['/user'])
    } catch (error) {
      this.errorMessage = 'Something was wrong'
    }
  }

  async tryLogin() {
    try {
      await this.authService.doLogin(this.loginForm.value)
      this.errorMessage = ''
      this.router.navigate(['/user'])
    } catch (error) {
      this.errorMessage = error.message
    }
  }
}
