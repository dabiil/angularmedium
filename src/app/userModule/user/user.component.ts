import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FSUser, UserService, AuthService } from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss'],
})
export class UserComponent {
  currentUser: FSUser
  userId = ''
  selectedUser: FSUser = null
  isCurrentUser = false
  hovered = false
  descriptionError = false
  descriptionInput = ''

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute, // private location: Location, // private fb: FormBuilder
    private router: Router
  ) {
    combineLatest([
      this.userService.currentUser,
      this.route.params,
      this.route.data,
      this.userService.selectedUser,
    ]).subscribe(
      async ([user, { userId }, { isCurrentUser }, selectedUser]) => {
        if (!isCurrentUser && user && user.id === userId) {
          this.router.navigate(['/users/me'])
          return
        }

        if (!isCurrentUser && this.userId !== userId) {
          this.selectedUser = await this.userService.getUserById(userId)
        } else {
          this.selectedUser = isCurrentUser ? user : selectedUser
        }

        this.isCurrentUser = isCurrentUser
        this.currentUser = user
        this.userId = userId
      }
    )
  }
  onHover(value: boolean) {
    this.hovered = value
  }

  onChangeDescription(e: any) {
    const { value }: { value: string } = e.target
    if (value.length >= 100) {
      this.descriptionError = true
    } else {
      this.descriptionError = false
    }

    const trimmed = value.replace(/\s+/g, ' ').trim()
    this.descriptionInput = trimmed
  }
  onPress(e: any, element: HTMLElement) {
    if (e.code === 'Enter' && element.style.height !== '10em') {
      const reg = element.style.height.match(/(\d+)em/)
      element.style.height = `${+reg[1] + 1}em`
    }
  }
  get isButtonDisabled() {
    return this.descriptionError
  }
}
