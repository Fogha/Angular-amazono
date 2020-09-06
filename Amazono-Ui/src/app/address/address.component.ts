import { Component, OnInit } from '@angular/core';
import { DataService } from '../Services/data.service';
import { RestApiService } from '../Services/rest-api.service';
import { Router, Data } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  btnDisabled = false;
  currentAddress: any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/accounts/address'
      );

      if (
        JSON.stringify(data['address']) === '{}' &&
        this.data.message === ' '
      ) {
        this.data.warning(
          'You have not entered your shipping address information'
        );
      }

      this.currentAddress = data['address'];
    } catch (err) {
      this.data.error(err);
    }
  }

  async updateAddress() {
    this.btnDisabled = true;
    try {
      const res = await this.rest.post(
        'http://localhost:3030/api/accounts/address',
        this.currentAddress
      );
      if (res['success']) {
        this.router.navigate(['/profile']);
        this.data.getProfile();
        this.data.success('Profile information updated successfully');
      } else {
        this.data.error(res['message']);
      }
    } catch (err) {
      this.data.error(err);
    }
    this.btnDisabled = false;
  }
}
