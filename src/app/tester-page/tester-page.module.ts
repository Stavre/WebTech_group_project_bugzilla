import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TesterPagePageRoutingModule } from './tester-page-routing.module';

import { TesterPagePage } from './tester-page.page';
import { CreateBugComponent } from '../create-bug/create-bug.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TesterPagePageRoutingModule,
  ],
  declarations: [TesterPagePage, CreateBugComponent]
})
export class TesterPagePageModule {}
