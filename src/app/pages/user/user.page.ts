import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/auth-service.service';
import { TxServiceService } from 'src/app/tx-service.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  window: any;

  constructor(@Inject(DOCUMENT) private document: Document,
      private authService: AuthServiceService) {
      this.window = document.defaultView;
      }

  ngOnInit() {


  }

  logOut(){
    this.authService.deleteLogin;
    window.location.href = `/home`;
  }

}
