/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddMember } from './add-member';
import { Member } from './member';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  userId: string;
  logedIn = false;
  constructor(private http: HttpClient) { }

  addUser(user: AddMember){
    return this.http.post<any>('http://localhost:3000/api/addUser', user);
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
    return this.http.post<any>('http://localhost:3000/api/user', {id});
  }

  getUserProjects(id: string){
    console.log('service getUserProjects');
    console.log(id);
    return this.http.post<any>('http://localhost:3000/api/userProjects', {id});
  }

  getProjectsTester(id: string){
    return this.http.post<any>('http://localhost:3000/api/tester', {id});
  }

  addProject(project: Project, team: number[]){
    // eslint-disable-next-line object-shorthand
    return this.http.post<any>('http://localhost:3000/api/addProject', {details: project, team: team});
  }

  addTester(userId: string, projectId: string){
    return this.http.post('http://localhost:3000/api/addTester', {userId, projectId});
  }

  addBug(testerId: string, projectId: string, description: string, link: string, severity: string){
    return this.http.post('http://localhost:3000/api/addBug', {testerId, projectId, description, link, severity});
  }

  getProject(id: string){
    return this.http.post<any>('http://localhost:3000/api/project', {id});
  }

  getProjects(){
    return this.http.get('http://localhost:3000/api/projects');
  }

  auth(email: string, password: string){
    return this.http.post<any>('http://localhost:3000/api/auth', {email: email, password: password});
  }

  getUsers(){
    return this.http.get<Member>('http://localhost:3000/api/users');
  }

  addUserToProject(userId: string, projectId: string){
    return this.http.post<any>('http://localhost:3000/api/addUserToProject', {userId, projectId});
  }

  deleteProject(projectId: string){
    return this.http.delete('http://localhost:3000/api/project/'+projectId);
  }

  deleteUserFromProject(projectId: string, userId: string){
    return this.http.delete('http://localhost:3000/api/userProjects/' + projectId + '/' + userId);

  }

  /*getClassStructure(className: string){
    this.http.get('http://localhost:3000/api/latestCreatedClass')
    .subscribe(data => this.classStructure.next(data));
  }*/
}
