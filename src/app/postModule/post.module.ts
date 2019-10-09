import { NgModule } from '@angular/core'
// import { UsersComponent } from './users'
import { PostComponent } from './post'
import { Location, CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '../core'
import { PostPreviewComponent } from './postPreview'
import { MarkdownModule } from 'ngx-markdown'
import { PostsComponent } from './posts'

const routes: Routes = [
  // {
  //   path: 'me',
  //   component: UserComponent,
  //   canActivate: [AuthGuard],
  //   data: {
  //     isCurrentUser: true,
  //   },
  // },
  {
    path: 'posts',
    component: PostsComponent,
    pathMatch: 'full',
  },
  {
    path: 'posts/newPost',
    component: PostComponent,
    pathMatch: 'full',
    data: {
      isNewPost: true,
    },
  },
  {
    path: 'posts/:postId',
    component: PostComponent,
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forChild(),
  ],
  declarations: [PostComponent, PostPreviewComponent, PostsComponent],
  providers: [],
  exports: [PostPreviewComponent],
})
export class PostModule {}
