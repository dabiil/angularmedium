import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { rootRouterConfig } from './app.routes'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from '../environments/environment'
import { LoginComponent } from './login/login.component'

import { AuthGuard, AuthService, UserService } from './core'
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { UserModule } from './userModule/user.module'
import { LayoutModule } from './layoutModule/layout.module'

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, {
      useHash: false,
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    UserModule,
    LayoutModule,
  ],
  providers: [AuthService, UserService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
