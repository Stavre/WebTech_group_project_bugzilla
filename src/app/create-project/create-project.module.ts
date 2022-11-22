import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProjectPageRoutingModule } from './create-project-routing.module';

import { CreateProjectPage } from './create-project.page';
import { UtilitiesModule } from '../utilities/utilities.module';

@NgModule({
    declarations: [CreateProjectPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateProjectPageRoutingModule,
        ReactiveFormsModule,
        UtilitiesModule
    ]
})
export class CreateProjectPageModule {}
