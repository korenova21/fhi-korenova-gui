import {Component, inject} from '@angular/core';
import {PageTitle} from '../../components/page-title/page-title';
import {Card} from '../../components/card/card';
import {Table} from '../../components/table/table';
import {Loader} from '../../components/loader/loader';
import {toSignal} from '@angular/core/rxjs-interop';
import {Column} from '../../models/column.model';
import {PackagesService} from '../../services/packages.service';
import {Package} from '../../models/package.model';

@Component({
  selector: 'app-packages',
  imports: [
    PageTitle,
    Card,
    Loader,
    Table
  ],
  templateUrl: './packages.html',
})
export default class Packages {
  private packagesService = inject(PackagesService)

  packages = toSignal(this.packagesService.getPackages());

  columns: Column<Package>[] = [
    {name: '#', value: row => row.code},
    {name: 'Name', value: row => row.name},
    {name: 'Weight', value: row => row.weight},
  ];
}
