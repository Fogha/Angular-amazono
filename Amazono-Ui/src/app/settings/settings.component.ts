import { Component, OnInit } from '@angular/core';
import { DataService } from '../Services/data.service';
import { RestApiService } from '../Services/rest-api.service';
import { Router, Data } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      if (!this.data.user) {
        await this.data.getProfile();
      }
      this.currentSettings = Object.assign({
        newPwd: ' ',
        pwdConfirm: ' ',
      });
    } catch (err) {
      this.data.error(err);
    }
  }

  validate(settings) {
    if (settings['name']) {
      if (settings['email']) {
        if (settings['newPwd']) {
          if (!settings['confirmPwd']) {
            return true;
          } else {
            if (settings['pwdConfirm']) {
              if (settings['newPwd'] === settings['confirmPwd']) {
                return true;
              } else {
                this.data.error('Passwords do not match');
              }
            } else {
              this.data.error('Please confirm password');
            }
          }
        } else {
          this.data.error('Please enter new password');
        }
      } else {
        this.data.error('Please enter email');
      }
    } else {
      this.data.error('Please enter your name');
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/profile',
          {
            name: this.currentSettings['name'],
            email: this.currentSettings['email'],
            password: this.currentSettings['newPwd'],
            isSeller: this.currentSettings['isSeller'],
          }
        );
        if (data['success']) {
          this.router.navigate(['/profile']);
          this.data.getProfile();
          this.data.success('Profile information updated successfully');
        } else {
          this.data.error(data['message']);
        }
      }
    } catch (err) {
      this.data.error(err);
    }
    this.btnDisabled = false;
  }
}
