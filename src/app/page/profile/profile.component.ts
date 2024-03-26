import { CharacterService } from './../../services/api/character.service';
import { AuthenService } from './../../services/api/authen.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthenGetRes } from '../../model/authen_get_res';
import { CommonModule } from '@angular/common';
import { CharacterGetRes } from '../../model/character_get_res';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: AuthenGetRes | undefined;
  character: CharacterGetRes[] = [];
  fileSelect: File | null = null;
  uid!: number;

  constructor(private authenService: AuthenService, private characterService: CharacterService, private router: Router) { }

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
      if (this.profile?.image === null) {
        await this.authenService.UpdateImg(formData);
      } else {
        this.deleteImage(this.profile?.image);
        await this.authenService.UpdateImg(formData);
      }
    }
    location.reload();
  }

  updatename(name: string) {
    if (name) {
      const body = {
        newname: name,
        uid: parseInt(localStorage.getItem('uid')!)
      }

      this.authenService.UpdateName(body);

      Swal.fire({
        title: "Update Successful.",
        icon: "success",
        confirmButtonColor: "#434343",
      }).then(() => {
        location.reload();
      });

    } else {
      Swal.fire({
        title: "Not found name to change.",
        text: "Please enter the name you want to change.",
        icon: "info",
        confirmButtonColor: "#434343",
      }).then(() => {
        location.reload();
      });
    }
  }

  info(cid: number) {
    this.router.navigate(['/Info'], { queryParams: { cid: cid } });
  }

  deleteImage(filename: any) {
    const body = {
      url: filename
    };
    console.log(filename);

    this.authenService.deleteImgProfile(body);
  }
}
