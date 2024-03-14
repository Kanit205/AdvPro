import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../../services/api/authen.service';
import { AuthenGetRes } from '../../model/authen_get_res';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  findLogin!: AuthenGetRes;
  status: number = 0;

  constructor(private router: Router, private authenService: AuthenService) { }

  ngOnInit() {
    this.load();
  }

  async load(){
    const id = localStorage.getItem('uid');
    if (id) {
      this.findLogin = await this.authenService.getUserID(parseInt(id));
      this.status = 1;
    } else {
      this.status = 0;
    }
  }

  login() {
    this.router.navigate(['/Authen']);
  }

  logout() {
    localStorage.removeItem('uid');
    this.router.navigate(['/Authen']);
  }

  Home() {
    this.router.navigate(['']);
  }

  Profile() {
    this.router.navigate(['/Profile']);
  }

  upload() {
    this.router.navigate(['/upload']);
  }

  rank() {
    this.router.navigate(['/Ranking']);
  }

}
