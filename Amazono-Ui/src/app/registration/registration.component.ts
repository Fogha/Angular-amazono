import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../Services/rest-api.service';
import { DataService } from '../Services/data.service';
import { Router, Data } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  name = ' ';
  email = ' ';
  password = ' ';
  confirmPassword = ' ';
  isSeller = false;

  btnDisabled = false;

  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService
  ) {}

  ngOnInit(): void {}

  validate() {
    if (this.name) {
      if (this.email) {
        if (this.password) {
          if (this.password === this.confirmPassword) {
            return true;
          } else {
            this.data.error('Passwords do not match');
          }
        } else {
          this.data.error('password not entered');
        }
      } else {
        this.data.error('email not entered');
      }
    } else {
      this.data.error('name not entered');
    }
  }

  async register() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/signup',
          {
            name: this.name,
            email: this.email,
            password: this.password,
            isSeller: this.isSeller,
          }
        );
        if (data['success']) {
          localStorage.setItem('token', data['token']);
          this.router.navigate(['/']);
          this.data.success('Registration successful');
        } else {
          this.data.error('Registration failed');
        }
      }
    } catch (err) {
      this.data.error(err['message']);
    }

    this.btnDisabled = false;
  }
}
