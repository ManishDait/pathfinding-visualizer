import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMouseActivites]'
})
export class MouseActivitesDirective {

  @Input() isWeight:any;
  @Input() isWall:any;

  constructor(private element:ElementRef, private renderer: Renderer2) { 
    this.renderer.setStyle(this.element.nativeElement,'cursor','pointer')
  }

  @HostListener('mouseover',['$event'])createWall(event: MouseEvent){
    var ele = this.element.nativeElement.firstChild;
    if(this.isWall && event.altKey){
      if(!ele.hasChildNodes()){
        ele.classList.add('wall');
      }
    }

    
  }

  @HostListener('click') createWeight(){

    var ele = this.element.nativeElement.firstChild;
    if(ele.classList.contains('wall')){
      ele.classList.remove('wall');
      return;
    }

    if(ele.hasChildNodes()){
      if(ele.firstChild.id != 'start' && ele.firstChild.id != 'goal' && ele.firstChild.id != 'boom'){
        this.element.nativeElement.setAttribute('weight','1');
        ele.removeChild(ele.firstChild);
      }
      return;
    }

    if(this.isWeight){
      var img = document.createElement('span');
      img.className = 'material-symbols-outlined'
      img.classList.add('icon')
      img.innerHTML = 'weight'
      img.classList.add('fill')
      this.element.nativeElement.setAttribute('weight','15');
      ele.appendChild(img);
      console.log(this.isWeight)
    }

  }

}

