/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../db.service';
import { AddMember } from '../add-member';
import { AddMemberService } from '../add-member.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  ngOnInit(): void {
  }

  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    photo: new FormControl('', [Validators.required])
  });

  constructor(private db: DbService,
              private router: Router) { }

  onPost(){
    if(this.myForm.valid){
      console.log(this.myForm.getRawValue());

      const user: AddMember = this.myForm.getRawValue();
      this.db.addUser(user).subscribe(data => {
        console.log(data);
        this.myForm.reset();
        this.db.onLogIn();
        this.db.setUserId(data);
        this.router.navigateByUrl('/project-page');

      });

    }
  }


}
