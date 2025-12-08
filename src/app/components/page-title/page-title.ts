import {Component, input} from '@angular/core';

@Component({
  selector: 'app-page-title',
  imports: [],
  templateUrl: './page-title.html',
})
export class PageTitle {

  title = input.required<string>();
}
