import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { rootRouterConfig } from './app.routes'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { environment } from '../environments/environment'
import { LoginComponent } from './login/login.component'

import { AuthGuard, AuthService, UserService, PostService } from './core'
import { ReactiveFormsModule } from '@angular/forms'
import { MarkdownModule } from 'ngx-markdown'
import { AppComponent } from './app.component'
import { UserModule } from './userModule/user.module'
import { LayoutModule } from './layoutModule/layout.module'
import { PostModule } from './postModule/post.module'

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, {
      useHash: false,
      enableTracing: true,
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    UserModule,
    LayoutModule,
    PostModule,
    MarkdownModule.forRoot(),
  ],
  providers: [AuthService, UserService, AuthGuard, PostService],
  bootstrap: [AppComponent],
})
export class AppModule {}
