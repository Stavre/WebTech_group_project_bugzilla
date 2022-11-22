import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-add-project-member',
  templateUrl: './add-project-member.component.html',
  styleUrls: ['./add-project-member.component.scss'],
})
export class AddProjectMemberComponent implements OnInit {
  users: any = [];
  selectedUsers: any = [];
  projectId;
  constructor(private db: DbService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.db.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  selectUsers(event){
    this.selectedUsers = [];
    this.selectedUsers = event;
  }

  addNewUsers(){
    /*this.selectedUsers.forEach(user => {
      console.log('add user');
      this.db.addUserToProject(user.id, this.projectId).subscribe(data => console.log(data));
    });*/
    return this.modalCtrl.dismiss(this.selectedUsers,'confirm');
  }

}
