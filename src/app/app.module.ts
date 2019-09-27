import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { rootRouterConfig } from './app.routes'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from '../environments/environment'
import { LoginComponent } from './login/login.component'
import { UserComponent } from './user/user.component'

import { UserResolver } from './user/user.resolver'
import { AuthGuard, AuthService, UserService } from './core'
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { UsersModule } from './userModule/users.module'
import { LayoutModule } from './layoutModule/layout.module'

@NgModule({
  declarations: [AppComponent, LoginComponent, UserComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    UsersModule,
    LayoutModule,
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
