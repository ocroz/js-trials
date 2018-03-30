import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'log-html',
  template: '',
  styles: ['']
})
export class LogHtmlComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit() {
    console.log(this.data)
  }
}
