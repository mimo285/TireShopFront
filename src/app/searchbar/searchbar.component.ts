import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent {
  searchQuery: string = '';

  @Output() searchQueryChange = new EventEmitter<string>();

  onSearch(): void {
    this.searchQueryChange.emit(this.searchQuery);
  } 
  
}
