import { CharacterService } from './../../services/api/character.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { CharacterGetRes, graphData } from '../../model/character_get_res';
import { CommonModule } from '@angular/common';
import * as Chart from 'chart.js/auto';
import Charts from 'chart.js/auto';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.scss'
})
export class CharacterInfoComponent implements OnInit {
  character: CharacterGetRes | undefined;
  cid: any;
  graphData: graphData | undefined;

  potGraph: Chart.ChartData = {
    labels: [],
    datasets: [],
  }

  constructor(private characterService: CharacterService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.setup();
    this.graph();
  }

  async setup() {
    this.cid = this.activatedRoute.snapshot.queryParamMap.get('cid');
    console.log(this.cid);
    this.character = await this.characterService.getCharacterBycid(this.cid);
    console.log(this.character);
  }

  async graph() {
    try {
        // เรียกใช้งาน characterService.Graph() เพื่อดึงข้อมูลกราฟ
        this.graphData = await this.characterService.Graph(this.cid) as graphData;

        // แสดงข้อมูลที่ได้รับใน console.log เพื่อตรวจสอบ
        console.log(this.graphData.graphData);

        // กำหนดข้อมูลสำหรับกราฟ
        const data = {
            labels: this.graphData.graphData.map(data => data.history_date).slice(0, 10),
            datasets: [{
                label: "graph",
                data: this.graphData.graphData.map(data => data.history_point),
                borderColor: 'rgb(75, 192, 192)',
                // backgroundColor: 'rgb(255, 255, 255)'
            }]
        };

        // กำหนดคอนฟิกเพื่อสร้างกราฟ
        const config: Chart.ChartConfiguration = {
            type: 'line',
            data: data
        };

        // เลือก element ที่มี id เป็น myChart และสร้างกราฟด้วย Chart.js
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;
        if (ctx) {
            new Charts(ctx, config);
        }
    } catch (error) {
        // จัดการข้อผิดพลาดที่เกิดขึ้น
        console.error(error);
    }
}

}
