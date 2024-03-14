import { Router } from '@angular/router';
import { CharacterService } from './../../services/api/character.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { URLGetRes } from '../../model/url_get_res';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  fileSelect: File | null = null;
  fileCon: any;
  fileUrl: string = '';

  constructor(private characterService: CharacterService, private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('uid')) {
      this.router.navigate(['']);
    }
  }

  async onFileSelected(event: any) {
    this.fileSelect = event.target.files![0];
    const formData = new FormData();
    formData.append('img', this.fileSelect!);
    const url = await this.characterService.GetUrl(formData);
    this.fileUrl = url.filename;
  }

  async upload(chaname: string) {
    if (this.fileUrl && chaname) {
      const body = {
        character: chaname,
        imgUrl: this.fileUrl,
        uid: parseInt(localStorage.getItem('uid')!)
      }
      await this.characterService.UploadCharacter(body);
      this.router.navigate(['/Profile']);
    }
  }
}
