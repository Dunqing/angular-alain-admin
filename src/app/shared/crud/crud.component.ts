import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { STChange, STColumn, STComponent, STData, STPage, STReq, STRes } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { CrudTopButtonTemplateRef } from './crud-top-button.directive';
import { CrudTemplateRef } from './crud.directive';
import { CrudService } from './crud.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  providers: [CrudService, CrudTemplateRef, CrudTopButtonTemplateRef],
  styles: [
    `
      nz-select {
        width: 120px;
      }

      nz-icon {
        font-size: 24px;
      }
    `,
  ],
})
export class CrudComponent implements AfterViewInit, OnInit, OnChanges {
  constructor(
    private crudService: CrudService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private crudTopButton: CrudTopButtonTemplateRef,
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef,
  ) {}
  _columns: STColumn[];
  _checkbox: any[]; // checkbox点击数据暂存
  _radio: any; // radio点击数据暂存
  _stChangeType: string; // 暂存 radio 和 checkbox
  @Output('change') crudChange = new EventEmitter();
  @Input()
  set columns(columns) {
    this._columns = columns;
  }
  get columns() {
    return this._columns;
  }
  @ViewChild('st') st: STComponent;
  @Input() data: STData;
  @Input() usePagination = true;
  _event = null;
  @Input()
  set event(event: any) {
    this._event = event;
    this.crudService.event = event;
  }

  get event() {
    return this._event;
  }

  get topButtonsContext() {
    return {
      radio: this._radio,
      checkbox: this._checkbox,
      changeType: this._stChangeType,
    };
  }

  get topButtons() {
    return this.crudTopButton.topButtons;
  }

  get tableActionIif() {
    return this.crudService.tableActionIif && (this.event.topEdit !== false || this.event.topDel !== false || this.event.topAdd !== false);
  }

  get editIif() {
    return this.event.topEdit !== false && this.crudService.editIif;
  }

  get delIif() {
    return this.event.topDel !== false && this.crudService.delIif;
  }

  get addIif() {
    return this.event.topAdd !== false && this.crudService.addIif;
  }

  total = 0;
  page: STPage = {
    front: false,
    show: true,
    showSize: true,
    showQuickJumper: true,
    placement: 'center',
  };
  scroll = {
    x: '100vw',
    y: '70vh',
  };
  req: STReq = {
    reName: {
      pi: 'page',
      ps: 'limit',
    },
  };

  res: STRes = {
    process: (data: STData[], rowData?: any) => {
      console.log(data);
      this.total = this.usePagination ? rowData.data.pagination.total : 0;
      return this.usePagination ? rowData.data.data : rowData.data;
    },
  };

  visible = false;
  transferDataSource: TransferItem[] = [];

  ngOnChanges({ columns }: SimpleChanges): void {
    if (columns.currentValue) {
      const data = this.crudService.changeColumns(columns.currentValue);
      // console.log(data);
      this.columns = data.columns;
      this.transferDataSource = data.transferData;
    }
  }

  stChange(res: STChange) {
    this.crudChange.emit(res);
    switch (res.type) {
      case 'radio':
        this._stChangeType = res.type;
        this._radio = res.radio;
        return;
      case 'checkbox':
        this._stChangeType = res.type;
        this._checkbox = res.checkbox;
        return;
    }
    // console.log(ret, 'change事件');
  }

  check(args) {
    if (args) {
      this.viewContainer.createEmbeddedView(args);
      console.log(args, 'check');
    }
  }

  topEditBtn(mode: string) {
    if (this._stChangeType === 'radio') {
      if (!this._radio) {
        this.messageService.error('你还没选择数据！请先选好');
        return;
      }
      this.crudService._data = this._radio;
    } else if (this._stChangeType === 'checkbox') {
      const checkboxData = this._checkbox;
      if (checkboxData.length !== 1) {
        this.messageService.error(checkboxData.length > 1 ? '编辑只能选择一个数据' : '请先选择一个数据');
        return;
      }
      this.crudService._data = this._checkbox;
    } else {
      this.messageService.error('还未选择数据请先选择');
      return;
    }
    this.crudService.openModelForm(mode, this.crudService._data[0]);
  }

  topDelBtn() {
    if (!this._stChangeType) {
      this.messageService.error('还未选择数据请先选择');
      return;
    }
    if ((this._stChangeType === 'checkbox' && !this._checkbox.length) || (this._stChangeType === 'radio' && !this._radio)) {
      this.messageService.error('你还未选择要删除的数据, 请先选好');
      return;
    }
    this.modalService.confirm({
      nzTitle: '确认删除？',
      nzContent: `<b style="color: red;">你是否确定要删除勾选的全部数据？</b>`,
      nzOkText: '删除',
      nzOkType: 'danger',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.crudService.handleDelete(this['_' + this._stChangeType]);
      },
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  // 打开crud模态框
  topAddBtn(mode: string) {
    this.crudService.openModelForm(mode);
  }

  ngOnInit(): void {
    this.columns = this.crudService.columnsInit(this.columns);
  }

  open() {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  load(...args) {
    this._checkbox = [];
    this._radio = {};
    this._stChangeType = '';
    this.st.load(...args);
  }

  transferChange(event) {
    const keys = event.list.map((item) => item.key);
    this.columns = this.columns.map((column) => {
      if (keys.includes(column.index) || keys.includes(column.render)) {
        return {
          ...column,
          show: column.show === false ? true : false,
        };
      } else {
        return column;
      }
    });
  }

  ngAfterViewInit(): void {}
}
