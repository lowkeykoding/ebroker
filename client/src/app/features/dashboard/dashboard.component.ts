import { Component, inject } from '@angular/core';
import {PageHeadingComponent} from '../../shared/components/page-heading/page-heading.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    PageHeadingComponent
  ],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
}
