import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../Services/rest-api.service';
import { DataService } from '../Services/data.service';
import { Router, Data } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = ' ';
  password = ' ';

  btnDisabled = false;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  ngOnInit(): void {}

  validate() {
    if (this.email) {
      if (this.password) {
        return true;
      } else {
        this.data.error('Password not entered');
      }
    } else {
      this.data.error('Email not entered');
    }
  }

  async login() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/login',
          {
            email: this.email,
            password: this.password,
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          this.router.navigate(['/']);
          this.data.success('Login successful');
        } else {
          this.data.error('Login failed');
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }

    this.btnDisabled = false;
  }
}
