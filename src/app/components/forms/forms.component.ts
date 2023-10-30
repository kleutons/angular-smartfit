import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterUnitsService } from 'src/app/services/filter-units.service';
import { GetUnitsService } from 'src/app/services/get-units.service';
import { Location } from 'src/app/types/location.interface';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {
  @Output() submitEvent = new EventEmitter();

  results: Location[] = [];
  filteredResults: Location[] = [];
  formGroup!: FormGroup;

  constructor( 
    private formBuilder:FormBuilder,
    private unitService: GetUnitsService,
    private filterUnitService: FilterUnitsService
    ){}
  
  ngOnInit():void {
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true
    })
    this.unitService.getAllUnits().subscribe( data => {
      this.results = data;
      this.filteredResults = data;
    })
  }

  onSubmit(): void {
    let {showClosed, hour } = this.formGroup.value;
    this.filteredResults = this.filterUnitService.filter(this.results, showClosed, hour);
    this.unitService.setFilteredUnit(this.filteredResults);
    
    this.submitEvent.emit();
  }
  onClean(): void {
    this.formGroup.reset();
  }
}
