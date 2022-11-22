import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectPagePageRoutingModule } from './project-page-routing.module';

import { ProjectPagePage } from './project-page.page';
import { AddProjectMemberComponent } from '../add-project-member/add-project-member.component';
import { UtilitiesModule } from '../utilities/utilities.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectPagePageRoutingModule,
    UtilitiesModule
  ],
  declarations: [ProjectPagePage, AddProjectMemberComponent]
})
export class ProjectPagePageModule {}
