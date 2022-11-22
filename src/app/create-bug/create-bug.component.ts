import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { DbService } from '../db.service';
@Component({
  selector: 'app-create-bug',
  templateUrl: './create-bug.component.html',
  styleUrls: ['./create-bug.component.scss'],
})
export class CreateBugComponent implements OnInit {
  description: string;
  severity: string;
  link: string;
  assignedUser: number = null;
  projectId: string;
  testerId: string;

  /*userId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  description: DataTypes.STRING,
  severity: {
    type: DataTypes.ENUM,
    values: ['low', 'medium', 'high', 'critical']
  },
  link: DataTypes.STRING,
  assignedUser: DataTypes.INTEGER*/

  constructor(private modalCtrl: ModalController,
              private db: DbService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.description && this.severity && this.link){
      this.db.addBug(this.testerId, this.projectId, this.description, this.link, this.severity)
      .subscribe(data => console.log(data));
    }
    return this.modalCtrl.dismiss('success', 'confirm');
  }
}

