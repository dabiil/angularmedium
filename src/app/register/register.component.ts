import { Component, OnInit } from '@angular/core'
import { AuthService } from '../core/auth.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup
  errorMessage = ''
  successMessage = ''

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  async tryGoogleLogin() {
    try {
      await this.authService.doGoogleLogin()
      this.router.navigate(['/user'])
    } catch (error) {
      console.log(error)
    }
  }

  async tryRegister() {
    try {
      await this.authService.doRegister(this.registerForm.value)
      this.errorMessage = ''
      this.successMessage = 'Your account has been created'
    } catch (error) {
      this.errorMessage = error.message
      this.successMessage = ''
    }
  }
}
