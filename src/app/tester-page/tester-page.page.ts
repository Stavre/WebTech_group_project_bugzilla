import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateBugComponent } from '../create-bug/create-bug.component';
import { DbService } from '../db.service';
import { Project } from '../project';

@Component({
  selector: 'app-tester-page',
  templateUrl: './tester-page.page.html',
  styleUrls: ['./tester-page.page.scss'],
})
export class TesterPagePage implements OnInit {
  projects: any = [];
  users: any = [];
  results;
  testers;
  connectedUser: any;
  constructor(private db: DbService,
              private modalCtrl: ModalController) {
    this.db.getProjects().subscribe(data => {
      this.projects = data;
      this.results = data;
      console.log(data);

    });

    this.db.getUsers().subscribe(data => {
      this.users = data;
    });

    this.connectedUser = this.db.getConnectedUserId();

    this.db.getProjectsTester(this.connectedUser.id).subscribe(data => {
      this.testers = data;
      console.log(data);
    });
  }

  ngOnInit() {

  }

  onRegisterTester(projectId: string){
    this.db.addTester(this.connectedUser.id, projectId).subscribe(data => console.log(data));
  }

  async onRegisterBug(projectId: string){
    console.log('bug registered ' + projectId);
    const modal = await this.modalCtrl.create({
      component: CreateBugComponent,
      componentProps: {
        // eslint-disable-next-line object-shorthand
        projectId: projectId,
        testerId: this.connectedUser.id
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }

  isRegistered(projectIdd: string){
    if (this.testers.findIndex(project => project.projectId === projectIdd) === -1){
        console.log('not registered');
        return false;
      }
      console.log('registered');

      return true;

  }




  handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    this.results = this.projects.filter(d => d.name.toLowerCase().includes(query) );
  }

}
