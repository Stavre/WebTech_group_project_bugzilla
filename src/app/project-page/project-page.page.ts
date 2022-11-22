import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { Project } from '../project';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddProjectMemberComponent } from '../add-project-member/add-project-member.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.page.html',
  styleUrls: ['./project-page.page.scss'],
})
export class ProjectPagePage implements OnInit {

  userId: any;
  user: any;
  projects: Project[] = [];
  members;
  constructor(private db: DbService,
              private route: ActivatedRoute,
              private modalCtrl: ModalController) {
    //this.projects = dataService.getProjects().slice(0, 15);

    this.userId = this.db.getConnectedUserId();
    if(this.userId){
      this.db.getUser(this.userId.id).subscribe(data =>
        {
          this.user = data;
          this.db.getUserProjects(this.userId.id).subscribe(reply => {
            this.projects = reply.userProjects;
            this.members = reply.usersProjects;
            console.log(reply);
          });

        }
        );
    }
   }

  ngOnInit() {
  }

  getMembers(projectId: string){
    const m = this.members.filter(member => member.projectId === projectId);
    const n = m.map(member => ({id: member.userId, name: member.UserName, email: member.email, photo: member.photo}));
    return n;
  }
  deleteUserFromProject(projectId: string, userId: string){
    console.log('delete user');
    console.log(projectId);
    console.log(userId);
    this.db.deleteUserFromProject(projectId, userId).subscribe(data => console.log(data));
  }
  deleteProject(projectId: string){

    this.db.deleteProject(projectId).subscribe(data => console.log(data));
  }
  async addMember(projectId: string){
    const modal = await this.modalCtrl.create({
      component: AddProjectMemberComponent,
      componentProps: {
        // eslint-disable-next-line object-shorthand
        projectId: projectId,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, I have been added`);
      data.forEach(user => {
        console.log(user.id);
        console.log(projectId);
        this.db.addUserToProject(user.id, projectId).subscribe(reply => {
          console.log('added');
          console.log(reply);
        });

      });
    }
  }

}
