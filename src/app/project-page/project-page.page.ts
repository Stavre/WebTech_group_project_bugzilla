/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DbService } from '../db.service';
import { Project } from '../project';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddProjectMemberComponent } from '../add-project-member/add-project-member.component';
import { User } from '../user';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.page.html',
  styleUrls: ['./project-page.page.scss'],
})
export class ProjectPagePage implements OnInit, OnChanges {

  @Input() userId: any;
  @Input() projectId: any;
  @Input() bugs;
  @Input() filteredBugs: any;
  @Input() user: any;
  @Input() projects: Project[] = [];
  @Input() members;
  @Input() hasBug;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  low: boolean = false;
  medium: boolean = false;
  high: boolean = false;
  critical: boolean = false;
  fixed: boolean = false;
  unfixed: boolean = false;
  assigned: boolean = false;
  unassigned: boolean = false;

  filterBy = new Map<string, boolean>([
    ['low', this.low],
    ['medium', this.medium],
    ['high', this.high],
    ['critical', this.critical],
    ['fixed', this.fixed],
    ['unfixed', this.unfixed],
    ['assigned', this.assigned],
    ['unassigned', this.unassigned]
]);

  constructor(private db: DbService,
              private route: ActivatedRoute,
              private modalCtrl: ModalController) {

    this.userId = this.db.getConnectedUserId();
    this.setup();
   }

  setup(){
    this.db.getUser(this.userId.id).subscribe(data =>
    {
      this.user = data;
      this.db.getUserProjects(this.userId.id).subscribe(reply => {
        this.projects = reply.userProjects;
        this.members = reply.usersProjects;
        console.log(reply);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.filter();
  }

  ngOnInit() {
  }

  filter(){
    this.filterBy = new Map<string, boolean>([
      ['low', this.low],
      ['medium', this.medium],
      ['high', this.high],
      ['critical', this.critical],
      ['fixed', this.fixed],
      ['unfixed', this.unfixed],
      ['assigned', this.assigned],
      ['unassigned', this.unassigned]
  ]);
    console.log(this.filterBy);
    // eslint-disable-next-line prefer-const

    this.filteredBugs = this.bugs.filter(element => {
      console.log('element', element);
      const t = [];
      ['low', 'medium', 'high', 'critical', 'fixed', 'unfixed', 'assigned', 'unassigned'].forEach(status => {
        console.log('status', status, this.filterBy.get(status));
        if (this.filterBy.get(status) === true){
          t.push(status);
        }
      });
      console.log('t', t);
      console.log(element.severity, element.assigned, element.fixed);
      if (t.includes(element.severity)){
        return true;
      }
      if (t.includes(element.assigned)){
        return true;
      }
      if (t.includes(element.fixed)){
        return true;
      }
      return false;
    });

  }

  getMembers(projectId: string){
    const m = this.members.filter(member => member.projectId === projectId);
    const n = m.map(member => ({id: member.userId, name: member.UserName, email: member.email, photo: member.photo}));
    //const n = m.map(member => (User(id: member.userId, name: member.UserName, email: member.email, photo: member.photo));
    return n;
  }
  deleteUserFromProject(projectId: string, userId: string){
    console.log('delete user');
    console.log(projectId);
    console.log(userId);
    this.db.deleteUserFromProject(projectId, userId).subscribe(data => console.log(data));
    this.setup();
  }
  deleteProject(projectId: string){
    this.db.deleteProject(projectId).subscribe(data => console.log(data));
    this.setup();
  }

  getBugs(projectId: string){
    this.db.getProjectBugs(projectId).subscribe(data => {
      console.log('bugs');
      console.log(data);
      this.bugs = data;
      this.filteredBugs = this.bugs;
    });

    this.db.hasUserBug(projectId, this.userId.id).subscribe(data =>
      {
        this.hasBug = data;
        console.log('hasBug', data);
      });
  }

  assignBug(projectId: string, bugId: string){
    this.db.assignBug(projectId, bugId, this.userId.id).subscribe(data => {
      console.log(data);
      this.setup();
    });
  }

  solveBug(projectId: string, bugId: string){
    this.db.solveBug(projectId, bugId).subscribe(data => {
      console.log(data);
      this.setup();
    });
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
        this.db.addUserToProject(user.id, projectId).subscribe(reply => {
          console.log('added');
          console.log(reply);
          this.setup();
        });

      });
    }
  }

}
