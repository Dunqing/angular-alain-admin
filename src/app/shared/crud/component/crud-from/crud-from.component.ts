import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-crud-from',
  templateUrl: './crud-from.component.html',
})
export class CrudFromComponent implements OnInit, AfterViewInit {
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 100,
  //     grid: { span: 12 },
  //   },
  //   $no: {
  //     widget: 'text',
  //   },
  //   $href: {
  //     widget: 'string',
  //   },
  //   $description: {
  //     widget: 'textarea',
  //     grid: { span: 24 },
  //   },
  // };

  constructor(private modal: NzModalRef, public http: _HttpClient) {}
  @Input() schema: SFSchema;
  @Input() ui: SFUISchema = {};
  @Input() mode;
  _formData = {};
  @Input() value: object;
  @Input() event: (value: any, close: any) => void;
  @ViewChild(SFComponent) sf: SFComponent;
  ngOnInit(): void {
    const propKeys = Object.keys(this.schema.properties);
    propKeys.forEach((key) => (this._formData[key] = this.value[key]));
  }
  ngAfterViewInit(): void {}

  save(value: any) {
    console.log(value, this.event, 'save');
    if (this.event) {
      this.event(value, this.close.bind(this));
    }
  }

  close() {
    this.modal.destroy();
  }
}
