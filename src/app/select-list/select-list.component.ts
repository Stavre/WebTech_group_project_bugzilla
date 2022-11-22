import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss'],
})
export class SelectListComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() keys: any;
  @Output() valueChange = new EventEmitter<[]>();
  results: any;
  searchResults: any;
  selectedItems: any = [];


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.setup();
  }

  ngOnInit() {
    this.setup();

  }

  setup(){
    this.results = this.data;
    //this.keys = Object.keys(this.data[0]);
  }

  objToString(obj){
    let str = '';
    this.keys.forEach(key => str = str + obj[key] + ' ');
    return str;
  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    console.log(query);
    this.searchResults = this.data.filter(row => this.objToString(row).includes(query) );
    console.log(this.searchResults[0]);
    console.log(this.keys);
  }

  onSelectRow(row){
    console.log(row);
    if (this.selectedItems.indexOf(row) === -1){
      this.selectedItems.push(row);
    }
    else{
      this.selectedItems.splice(this.selectedItems.indexOf(row), 1);
      //console.log(this.userList.indexOf(userToAdd.id));
    }
    this.valueChange.emit(this.selectedItems);
  }

}
