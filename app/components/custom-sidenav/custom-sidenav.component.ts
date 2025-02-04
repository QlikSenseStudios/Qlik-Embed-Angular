import { Component, computed, input } from '@angular/core';
import { menuItems } from '../../menu-items';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MenuItemComponent, MatListModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss',
})
export class CustomSidenavComponent {
  collapsed = input<boolean>(false);

  menuItems = menuItems;
}
