import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.page.html',
  styleUrls: ['./create-project.page.scss'],
})
export class CreateProjectPage implements OnInit {

  connectedUser: any;
  users;
  filteredUsers;
  userList = [];
  myForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    repository: new FormControl('', [Validators.required]),
    team: new FormArray([])
  });

  constructor(private db: DbService,
              private router: Router,
              private alertCtrl: AlertController) {
    this.db.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = data;
      this.connectedUser = this.db.getConnectedUserId();
      this.users.splice(this.users.findIndex(user => user.id === this.connectedUser.id), 1);
    });

   }

  ngOnInit() {
  }

  async onPost(){
    if(this.myForm.valid){
      this.userList.push(this.connectedUser);
      this.db.addProject(this.myForm.getRawValue(), this.userList.map(user => user.id)).subscribe(data => console.log(data));
      this.router.navigateByUrl('/project-page');
    }
    else{
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Please fill all fields',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  setUsers(users){
    console.log('event');
    console.log(users);
    this.userList = [];
    this.userList = users;
    console.log(this.userList);

  }

  onSelectUser(userToAdd){
    console.log(userToAdd);
    console.log(this.userList.indexOf(userToAdd));
    if (this.userList.indexOf(userToAdd) === -1){
      this.userList.push(userToAdd);
    }
    else{
      this.userList.splice(this.userList.indexOf(userToAdd), 1);
      console.log(this.userList);
      //console.log(this.userList.indexOf(userToAdd.id));
    }
    console.log(this.userList);
  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(query) );

  }

}
