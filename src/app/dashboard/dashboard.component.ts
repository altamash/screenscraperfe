import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ScraperService } from '../scraper.service';
import { Record } from '../shared/record';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['jurisdiction', 'fileNumber', 'saleTime', 'propertyAddress', 'city', 'zip', 'originalLoanAmount'];
  dataSource = ELEMENT_DATA;

  records: Record[] = [];
  zip: string = '';
  jurisdiction: string = '';
  miles: string = '';
  filterForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      zip: '',
      jurisdiction: '',
      miles: ''
    });
    this.getRecords(this.zip, this.jurisdiction, this.miles);
  }

  onSubmit(): void {
    if (this.filterForm.invalid) {
      return;
    }
    // this.zip = this.filterForm.get('zip').value;
    this.getRecords(this.filterForm.value.zip, this.filterForm.value.jurisdiction, this.filterForm.value.miles);
  }

  constructor(public scraperService: ScraperService, private formBuilder: FormBuilder) {}

  getRecords(zip: string, jurisdiction: string, miles: string) {
    this.scraperService
        .GerRecords(zip, jurisdiction, miles)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: Record[]) => {
          this.records = data;
        })
  }

}
