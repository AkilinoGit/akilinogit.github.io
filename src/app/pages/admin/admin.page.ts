import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  logOut(){
    this.authService.logout;
    window.location.href = `/home`;
  }

}
