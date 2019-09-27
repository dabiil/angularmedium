import { NgModule } from '@angular/core'
import { NavbarComponent } from './navbar'

import { Location, CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent],
  providers: [],
  exports: [NavbarComponent],
})
export class LayoutModule {}
