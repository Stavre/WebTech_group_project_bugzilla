/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddMember } from './add-member';
import { Project } from './project';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  domain = 'https://serious-holly-sand.glitch.me';

  userId: string;
  logedIn = false;
  constructor(private http: HttpClient) { }

  addUser(user: AddMember){
    return this.http.post<any>(this.domain + '/api/addUser', user);
  }

  setUserId(id: any) {
    this.userId = id;
  }

  getConnectedUserId(){
    return this.userId;
  }

  onLogIn(){
    this.logedIn = true;
  }

  isLogedIn(){
    const r = this.logedIn;
    return r;
  }
  getUser(id: string){
    console.log('service getUser');
    console.log(id);
    return this.http.post<User>(this.domain + '/api/user', {id});
  }

  getUserProjects(id: string){
    console.log('service getUserProjects');
    console.log(id);
    return this.http.post<any>(this.domain + '/api/userProjects', {id});
  }

  getProjectsTester(id: string){
    return this.http.post<any>(this.domain + '/api/tester', {id});
  }

  addProject(project: Project, team: number[]){
    // eslint-disable-next-line object-shorthand
    return this.http.post<any>(this.domain + '/api/addProject', {details: project, team: team});
  }

  addTester(userId: string, projectId: string){
    return this.http.post(this.domain + '/api/addTester', {userId, projectId});
  }

  addBug(userId: string, projectId: string, title: string, description: string, link: string, severity: string){
    // eslint-disable-next-line max-len
    return this.http.post(this.domain + '/api/addBug', {userId, projectId, title, description, severity,  fixed: 'unfixed', assigned: 'unassigned', link, assignedUser: -1});
  }

  hasUserBug(projectId: string, userId: string){
    return this.http.get(this.domain + '/api/bugs/' + projectId +'/' + userId);
  }

  assignBug(projectId: string, bugId: string, userId: string) {
    return this.http.post<any>(this.domain + '/api/bugs', {projectId, bugId, userId});
  }

  solveBug(projectId: string, bugId: string) {
    return this.http.post<any>(this.domain + '/api/bugs/solve', {projectId, bugId});
  }

  getProjectBugs(projectId: string){
    return this.http.get(this.domain + '/api/bugs/' + projectId);
  }

  getProject(id: string){
    return this.http.post<Project>(this.domain + '/api/project', {id});
  }

  getProjects(){
    return this.http.get<Project[]>(this.domain + '/api/projects');
  }

  auth(email: string, password: string){
    return this.http.post<any>(this.domain + '/api/auth', {email: email, password: password});
  }

  getUsers(){
    return this.http.get<User[]>(this.domain + '/api/users');
  }

  addUserToProject(userId: string, projectId: string){
    return this.http.post<any>(this.domain + '/api/addUserToProject', {userId, projectId});
  }

  deleteProject(projectId: string){
    return this.http.delete(this.domain + '/api/project/'+projectId);
  }

  deleteUserFromProject(projectId: string, userId: string){
    return this.http.delete(this.domain + '/api/userProjects/' + projectId + '/' + userId);

  }

  /*getClassStructure(className: string){
    this.http.get(this.domain + '/api/latestCreatedClass')
    .subscribe(data => this.classStructure.next(data));
  }*/
}
