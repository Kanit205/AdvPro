import { CharacterService } from './../../services/api/character.service';
import { AuthenService } from './../../services/api/authen.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthenGetRes } from '../../model/authen_get_res';
import { CommonModule } from '@angular/common';
import { CharacterGetRes } from '../../model/character_get_res';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  profile: AuthenGetRes | undefined;
  character: CharacterGetRes[] = [];
  fileSelect: File | null = null;
  uid!: number;

  constructor(private authenService: AuthenService, private characterService: CharacterService,private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('uid')) {
      this.setup();
    } else {
      this.router.navigate(['']);
    }
  }

  async setup() {
    this.profile = await this.authenService.getUserID(parseInt(localStorage.getItem('uid')!));
    this.character = await this.characterService.getCharacterByuid(parseInt(localStorage.getItem('uid')!));
  }

  async onFileSelected(event: any) {
    this.fileSelect = event.target.files![0];
    const formData = new FormData();
    formData.append('img', this.fileSelect!);
    formData.append('uid', localStorage.getItem('uid')!);
    if (confirm('Are you sure you want to update the image?')) {
      await this.authenService.UpdateImg(formData);
    }
    location.reload();
  }

  async updatename(name: string) {
    if (name) {

    }
  }

  info (cid: number) {
    this.router.navigate(['/Info'], { queryParams: { cid: cid } });
  }
}
