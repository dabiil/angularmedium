import { Component, OnInit } from '@angular/core'
import { UserService } from '../core/user.service'
import { AuthService } from '../core/auth.service'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FirebaseUserModel } from '../core/user.model'

@Component({
  selector: 'app-page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss'],
})
export class UserComponent implements OnInit {
  user: FirebaseUserModel = new FirebaseUserModel()
  profileForm: FormGroup

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.data.subscribe((routeData) => {
      const data = routeData.data
      if (data) {
        this.user = data
        this.profileForm = this.fb.group({
          name: [this.user.name, Validators.required],
        })
      }
    })
  }

  async save(value: { name: string }) {
    try {
      await this.userService.updateCurrentUser(value)
    } catch (error) {
      console.log(error)
    }
  }

  async logout() {
    try {
      await this.authService.doLogout()
      this.location.back()
    } catch (error) {
      console.log('Logout error', error)
    }
  }
}
