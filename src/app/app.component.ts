import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Dijktars } from 'src/assets/algorithms/Dijktars';
import { Maze } from 'src/assets/algorithms/Maze';
import { Grid } from 'src/assets/helper/Grid';
import { BFS } from '../assets/algorithms/BFS';
import { DFS } from '../assets/algorithms/DFS';
import { BiDirectional } from 'src/assets/algorithms/BiDirectional';
import { Astar } from 'src/assets/algorithms/Astart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title: string = 'PathFindingVisualizer';
  page: number  = 1;

  disAble: boolean = false;

  window_width: any = window.innerWidth;
  selectedAlgo: string = 'Algorithm';
  source: string = 'keyboard_arrow_right';

  algo: boolean = false;
  maze: boolean = false;
  dragged: any;

  isWeight: boolean = false;
  isWall: boolean = true;

  get isWeg(): any {
    return this.isWeight;
  }

  row: number = 28;
  col: number = 70;

  start!: string;
  end!: string;
  boom!: string;
 
  boomAdded: boolean = false; 

  ngOnInit(): void {
    this.start = '[12,12]';
    this.end = '[12,58]';
    this.boom= '[12,35]';

    if(this.window_width <= 1440 && this.window_width > 1025) {
      this.row = 32;
      this.col = 56;

      this.start = '[15,5]';
      this.end = '[15,51]';
      this.boom = '[15,28]';
    }

    if(this.window_width <= 1025 && this.window_width > 695) {
      this.row = 35;
      this.col = 35;

      this.start = '[20,5]';
      this.end = '[20,30]';
      this.boom = '[20,17]';
    }

    if(this.window_width <= 695) {
      this.row = 34;
      this.col = 20;

      this.start = '[10,5]';
      this.end = '[10,15]';
      this.boom = '[10,10]';
    }
  }

  graph: {[key: string]:string[]} = {};

  toggleAlgo(): void {
    if(!this.disAble) {
      this.algo = !this.algo;
    }
    
    this.maze = false;
  }

  toggleMaze(): void {
    if(!this.disAble) {
      this.maze = !this.maze;
    }
    
    this.algo = false;
  }

  addBoom(): void {
    if(this.boomAdded) {
      this.boomAdded = false;
      document.getElementById('boom')?.remove();
    } else {
      var node = document.getElementById(this.boom)!.firstChild;

      var img = document.createElement('span');
      img.className = 'material-symbols-outlined';
      img.classList.add('icon');
      img.innerHTML = 'circle';
      img.draggable = true;
      img.id = 'boom';

      img.addEventListener("dragstart",(event) => {
        if(this.disAble){
          return;
        }
        this.isWall = false;
        this.dragged = event!.target!;
      });

      img.addEventListener("drag",(event)=> {
        if(this.disAble){
          return;
        }
      });
    
      node?.appendChild(img);
      this.boomAdded = true;
    }
  }

  async visualize() {
    switch(this.selectedAlgo) {
      case 'Breath First Search':
        this.disAble = true;
        if(this.boomAdded)
          await new BFS().search_boom(this.graph,this.start,this.end,this.boom);
        else
          await new BFS().search(this.graph,this.start, this.end);

        this.disAble = false;
        break;

      case 'Depth First Search':
        this.disAble = true;
        if(this.boomAdded)
          await new DFS().search_boom(this.graph,this.start,this.end,this.boom);
        else
          await new DFS().search(this.graph,this.start, this.end);
          this.disAble = false
        break;

      case 'Dijktras':
        this.disAble=true
        if(this.boomAdded)
          await new Dijktars().search_boom(this.graph,this.start,this.end,this.boom);
        else
          await new Dijktars().search(this.graph,this.start, this.end);
        
        this.disAble=false;
        break;

      case 'Bidirectional':
        this.disAble=true
        if(this.boomAdded)
          await new BiDirectional().search_boom(this.graph,this.start,this.end,this.boom);
        else
          await new BiDirectional().search(this.graph,this.start, this.end);
        
        this.disAble=false;
        break

      case 'Astar':
          this.disAble=true
          if(this.boomAdded)
            await new Astar().search_bomb(this.graph, new Grid().mapHurestic(this.end, this.row, this.col),this.start,this.end,this.boom);
          else
            await new Astar().search(this.graph, new Grid().mapHurestic(this.end, this.row, this.col),this.start, this.end);
          
          this.disAble=false;
          break;
    }
  }

  ngAfterViewInit(): void {
      this.graph = new Grid().mapGrid(this.row,this.col);
      var startNode = document.getElementById(this.start)!.firstChild;
      var targetNode = document.getElementById(this.end)!.firstChild;

      document.getElementById(this.start)!.firstElementChild!.innerHTML = '';
      document.getElementById(this.end)!.firstElementChild!.innerHTML = '';

      var img = document.createElement('span');
      img.className = 'material-symbols-outlined'
      img.classList.add('icon');
      img.innerHTML = 'emergency';
      img.draggable = true
      img.id = 'start';

      img.addEventListener("dragstart",(event) => {
        if(this.disAble){
          return;
        }
        this.isWall = false;
        this.dragged = event!.target!;
      });

      img.addEventListener("drag",(event)=> {
        if(this.disAble){
          return;
        }
      });

      document.getElementById(this.start)!.setAttribute('weight','0');

      startNode!.appendChild(img)

      var img = document.createElement('span');
      img.className = 'material-symbols-outlined'
      img.innerHTML = 'nest_heat_link_e';
      img.classList.add('icon');
      img.draggable = true

      img.addEventListener("dragstart",(event) => {
        if(this.disAble){
          return;
        }
        this.isWall = false;
        this.dragged = event!.target!;
      });


      img.addEventListener("drag",(event)=> {
        if(this.disAble){
          return;
        }
      });
      
      img.id = 'goal';
      targetNode!.appendChild(img);
  }

  allaowImageDrop(event: any): any {
    if(this.disAble){
      return;
    }
    event.preventDefault();
  }

  imageDrop(event: any): any {
    if(this.disAble){
      return;
    }
    event.preventDefault();
    
    var data = this.dragged;
    event.target.appendChild(data);
    data.style.display = 'block';
    this.isWall = true;
    
    if(data.id == 'start') {
        this.start = event.target.parentElement.id;
    }

    if(data.id == 'goal') {
        this.end = event.target.parentElement.id;;
    }

    if(data.id == 'boom') {
      this.boom = event.target.parentElement.id;;
    }
  }

  clearBoard(): void {
    this.clearPath();
    this.clearWall();
    document.getElementById(this.start)!.firstElementChild!.innerHTML = '';
    document.getElementById(this.end)!.firstElementChild!.innerHTML = '';
    if(this.boomAdded) {
      this.boomAdded = false;
      document.getElementById('boom')?.remove();
    }
    this.ngOnInit();
    this.ngAfterViewInit();
  }

  clearWall(): void {
    var ele = document.getElementsByClassName('node-con');
    for(var i=0; i<ele.length; i++) {
      ele[i].firstElementChild?.classList.remove('wall');
      if(ele[i].id != this.start && ele[i].id != this.end && ele[i].id != this.boom){
        ele[i].firstElementChild?.firstElementChild?.remove();
      }
    }
  }

  clearPath(): void {
    var ele = document.getElementsByClassName('node-con');
    for(var i=0; i<ele.length; i++){
      ele[i].firstElementChild?.classList.remove('path');
      ele[i].firstElementChild?.classList.remove('visited');
      ele[i].firstElementChild?.classList.remove('boom-visited');
    }
  }

  generateWallMaze(): void {
    this.clearWall();
    new Maze().randomMaze(this.row, this.col, this.boom);
  }

  generateWeightMaze(): void {
    this.clearWall();
    if(this.isWeight)
      new Maze().randomWeight(this.row, this.col);
  }

  next(): void {
    this.page += 1;
    if(this.page > 7){
      document.getElementById('popup')?.remove();
    }
  }

  previous(): void {
    if(this.page  >= 1){
      this.page -= 1;
    }
  }

  skip(): void {
    document.getElementById('popup')?.remove();
  }
}



