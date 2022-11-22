import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(private db: DbService,
              private alertCtrl: AlertController,
              private router: Router) { }

  ngOnInit() {
  }

  newUser(){
    this.router.navigateByUrl('create-account');
  }

  login(){
    this.db.auth(this.email, this.password).subscribe(async reply =>
      {
        console.log();
        if(reply.message === 'Loged in'){
          //this.router.navigateByUrl('project-page');
          this.db.onLogIn();
          this.db.setUserId(reply.user);
          this.router.navigateByUrl('/project-page');
        }
        else{
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: reply.message,
            buttons: ['OK']
          });
          await alert.present();
        }

      });
  }

}
