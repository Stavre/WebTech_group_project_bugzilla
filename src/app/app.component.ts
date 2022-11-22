import { Component } from '@angular/core';
import { DbService } from './db.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  connectedUser: any;
  public appPages = [
    { title: 'Projects', url: '/project-page' },
    { title: 'Tester', url: '/tester-page' },
    { title: 'Create project', url: '/create-project' }
  ];
  constructor(private db: DbService) {
    this.connectedUser = this.db.getConnectedUserId();
  }
}
