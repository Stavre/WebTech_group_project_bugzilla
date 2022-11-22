import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectListComponent } from '../select-list/select-list.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SelectListComponent],
  imports: [
    FormsModule,
    IonicModule,
    CommonModule
  ],
  exports: [SelectListComponent, CommonModule]
})
export class UtilitiesModule { }
