import { Component } from '@angular/core';
import {APP_NAME} from '../../consts/app.consts';
import {MenuItem} from '../../models/menu-item.model';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly APP_NAME = APP_NAME;

  menuItems: MenuItem[] = [
    { label: 'Persons', routerLink: 'persons' },
    { label: 'Packages', routerLink: 'packages' }
  ];
}
