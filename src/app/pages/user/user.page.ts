import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
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
      private authService: AuthService) {
      this.window = document.defaultView;
      }

  ngOnInit() {


  }

  logOut(){
    this.authService.logout;
    window.location.href = `/home`;
  }

}
