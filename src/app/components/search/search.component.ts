import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input()
  searchModel!: string;

  @Output()
  searchModelChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  updateFilteredSearchModel(searchText: string) {
    this.searchModelChange.emit(searchText.trim());
  }

  clearFilter() {
    this.searchModel = '';
    this.searchModelChange.emit(this.searchModel);
  }
}
