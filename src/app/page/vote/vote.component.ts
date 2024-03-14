import { VoteService } from './../../services/api/vote.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CharacterGetRes } from '../../model/character_get_res';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteComponent {
  Charac2 :CharacterGetRes[] = [];

  constructor(private voteService: VoteService) { }

  ngOnInit() {
    this.setup();
  }

  async setup() {
    this.Charac2 = await this.voteService.get2Charac();
  }

  vote(vote: number) {
    const voteHardler = async () => {
      let win, lose;
      if (vote === 0) {
        win = this.Charac2[0].cid;
        lose = this.Charac2[1].cid;
      } else if (vote === 1) {
        win = this.Charac2[1].cid;
        lose = this.Charac2[0].cid;
      }
      console.log("win:" + win + "lose:" + lose);

      const body = {
        win: win,
        lose: lose,
        uid: parseInt(localStorage.getItem('uid')!)
      };
      this.voteService.pointSet(body);
      this.setup();
    }
    voteHardler();
  }
}
