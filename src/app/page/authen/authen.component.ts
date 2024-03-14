import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthenService } from '../../services/api/authen.service';
import { AuthenGetRes } from '../../model/authen_get_res';
import * as bcrypt from 'bcryptjs';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-authen',
  standalone: true,
  imports: [RouterLink, RouterModule, HeaderComponent],
  templateUrl: './authen.component.html',
  styleUrl: './authen.component.scss'
})
export class AuthenComponent implements OnInit{
  findLogin: AuthenGetRes | undefined;

  constructor (private authService: AuthenService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('uid')) {
      this.router.navigate(['']);
    }
  }

  async Login(email: string, pass: string) {
    if (email && pass) {
      this.findLogin = await this.authService.getUser(email);
      if (this.findLogin) {
        const passMatch = await bcrypt.compare(pass, this.findLogin.password);
        if (passMatch) {
          localStorage.setItem('uid', `${this.findLogin.uid}`);
          this.router.navigate(['']);
        } else {
          console.log("Invalid code.");
        }
      }
    } else {
      console.log("This email doesn't exist.");
    }
  }

  Home() {
    this.router.navigate([""]);
  }
}
