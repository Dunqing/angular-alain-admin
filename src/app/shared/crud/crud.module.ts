import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CrudFromComponent } from './component/crud-from/crud-from.component';
import { CrudTopButtonDirective } from './crud-top-button.directive';
import { CrudComponent } from './crud.component';
import { CrudRowDirective, CrudTitleDirective } from './crud.directive';

const COMPONENTS = [CrudComponent, CrudFromComponent];
const DIRECTIVES = [CrudTitleDirective, CrudRowDirective, CrudTopButtonDirective];

@NgModule({
  imports: [SharedModule],
  declarations: [...COMPONENTS, ...DIRECTIVES],
  exports: [...COMPONENTS, ...DIRECTIVES, SharedModule],
})
export class CrudModule {
  constructor() {}
}
