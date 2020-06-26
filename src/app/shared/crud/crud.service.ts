import { Injectable, Input } from '@angular/core';
import { STColumn, STData } from '@delon/abc/st';
import { SFSchema, SFUISchemaItem } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { catchError, debounceTime, delay, retry, tap } from 'rxjs/operators';
import { CrudFromComponent } from './component/crud-from/crud-from.component';
import { CrudTemplateRef } from './crud.directive';

@Injectable()
export class CrudService {
  columns: STColumn[];
  constructor(
    private crudTemplateRef: CrudTemplateRef,
    private modelHelper: ModalHelper,
    private http: _HttpClient,
    private modalService: NzModalService,
  ) {}

  baseUrl: any;
  _data: any; // 临时data 比如保存打开编辑框时
  _event: any; // set get event
  schema: SFSchema = {
    properties: {},
    ui: {
      grid: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 12,
        xl: 12,
      },
      '*': {
        spanLabel: 4,
        spanControl: 20,
      },
    },
    required: [],
  };

  get tableActionIif() {
    return this.event && (this.event.add || this.event.edit || this.baseUrl);
  }

  get addIif() {
    return this.event.add || this.baseUrl;
  }

  get editIif() {
    return this.event.edit || this.baseUrl;
  }

  get delIif() {
    return this.event.del || this.baseUrl;
  }

  set event(event) {
    this._event = event;
    if (!event) {
      return;
    }

    this.baseUrl = event.url;
  }
  get event() {
    return this._event;
  }

  tableAction: STColumn = {
    title: '操作',
    fixed: 'right',
    width: 150,
    fromHidden: false,
    iif: () => {
      return this.tableActionIif;
    },
    buttons: [
      {
        text: '编辑',
        icon: 'edit',
        iif: () => {
          return this.event.edit !== false && this.editIif;
        },
        click: (cdr) => {
          this._data = cdr;
          this.openModelForm('edit', cdr);
        },
      },
      {
        text: '删除',
        icon: 'delete',
        iif: () => {
          return this.event.del !== false && this.delIif;
        },
        click: (args) => {
          console.log('删除时传来的参数', args);
          const confirm = this.event.del.confirm !== false;
          if (!confirm) {
            this.handleDelete(args);
            return;
          }
          this.modalService.confirm({
            nzTitle: '确认删除？',
            nzContent: `<b style="color: red;">删除后无法恢复！请确认</b>`,
            nzOkText: '删除',
            nzOkType: 'danger',
            nzCancelText: '取消',
            nzOnOk: () => {
              this.handleDelete(args);
            },
            nzOnCancel: () => console.log('Cancel'),
          });
        },
      },
    ],
  };

  defaultSchemaUi: SFUISchemaItem = {
    placeholder: '',
  };

  getReqOptions(options, defaultMethod, args) {
    const req = {
      url: options.url || this.baseUrl,
      method: options.method || defaultMethod,
      data: options.reData ? options.reData(args) : args,
      // reReq 传过去的数据为 打开模态框时的data 和 保存数据传过来的data
      ...(options.reReq ? options.reReq({ columnData: this._data, fromData: args }) : {}),
    };
    return req;
  }

  handleAdd(args: any, loading: () => void) {
    // 没有为默认对象
    const _add = this.event.add || {};
    const useCustomHttp = _add instanceof Function ? true : false;
    console.log('add', _add, useCustomHttp);
    if (useCustomHttp) {
      // _data 点击编辑时的该行数据
      _add(this._data, args, loading);
      return;
    }
    // 默认请求方式
    const method = 'post';
    const req = this.getReqOptions(_add, method, args);
    const options = { ...this.event.options, ..._add.options };
    console.log('add', _add, req, this);
    console.log('add', req, options);
    this.customHttp(req, {
      ...options,
      loading,
    });
    return;
  }

  handleEdit(args: any, loading: () => void) {
    // 没有为默认对象
    const _edit = this.event.edit || {};
    const useCustomHttp = _edit instanceof Function ? true : false;
    if (useCustomHttp) {
      // _data 点击编辑时的该行数据
      _edit(this._data, args, loading);
      return;
    }

    // 默认请求方式
    const method = 'put';
    const req = this.getReqOptions(_edit, method, args);
    const options = { ...this.event.options, ..._edit.options };
    this.customHttp(req, {
      ...options,
      loading,
    });
    return;
  }

  handleDelete(args: any) {
    // 没有为默认对象
    const _del = this.event.del || {};
    const useCustomHttp = _del instanceof Function ? true : false;
    if (useCustomHttp) {
      _del(args);
      return;
    }

    // 默认请求方式
    const method = 'delete';
    const req = this.getReqOptions(_del, method, args);
    const options = { ...this.event.options, ..._del.options };
    this.customHttp(req, options);
    return;
  }

  customHttp(req, options: any = {}) {
    this.http
      .request(req.method, req.url, {
        body: req.method === 'get' ? {} : req.data,
        params: req.method === 'get' ? req.data : {},
      })
      .pipe(
        delay(300),
        tap(() => {
          // 成功则帮忙执行
          if (options.loading) {
            options.loading();
          }
        }),
        catchError(
          options.errorCallback ||
            ((err: any) => {
              this.errorCallback(err, options);
            }),
        ),
      )
      .subscribe(
        options.successCallback ||
          ((res: any) => {
            this.successCallback(res, options);
          }),
      );
  }

  errorCallback(error: any, options?: any) {
    if (options && options.loading instanceof Function) {
      options.loading();
    }
    console.log(error, arguments, '看看错误回调');
  }

  successCallback(res: any, options?: any) {
    if (options && options.loading instanceof Function) {
      options.loading();
    }
    console.log(res, arguments, '看看成功回调');
  }

  columnsInit(columns: STColumn[]) {
    const newColumns = [];
    columns.forEach((column) => {
      newColumns.push({
        ...column,
        __render: this.crudTemplateRef.getRow(column.render),
        __renderTitle: this.crudTemplateRef.getTitle(column.renderTitle),
      });
    });
    console.log(newColumns);
    return newColumns;
  }

  getPropertiesName(column: STColumn) {
    if (column.index) {
      // 可能为数组 则最后一个肯定为key
      return column.index instanceof Array ? column.index[column.index.length - 1] : column.index;
    } else if (column.render) {
      return column.render;
    } else {
      return;
    }
  }

  getSchema(mode: string = 'add') {
    const schema = JSON.parse(JSON.stringify(this.schema));
    this.columns.forEach((column: STColumn) => {
      if (column.fromHidden) {
        return;
      }
      if (mode === 'add' && column.fromAddHidden === true) {
        return;
      } else if (mode === 'edit' && column.fromEditHidden === true) {
        return;
      }

      const key = this.getPropertiesName(column);
      const title = (column.title as any)?.text || column.title || column.renderTitle;
      this.defaultSchemaUi.placeholder = '请输入 ' + title;
      // 提供给form表单插值
      if (column.required) {
        schema.required.push(key);
      }
      schema.properties[key] = {
        title, // 默认 title
        type: 'string', // 默认 type
        ui: this.defaultSchemaUi,
        ...column.schema, // 可覆盖上面
      };

      // schema -> ui 默认值
      const schemaUi: any = schema.properties[key].ui;
      schema.properties[key].ui = { ...this.defaultSchemaUi, ...schemaUi };
    });
    return {
      schema,
    };
  }

  /**
   * model -> edit 和 add 模式
   * args -> 表单默认数据
   */
  openModelForm(mode: string, args?: any) {
    const { schema } = this.getSchema(mode);
    const event: any = mode === 'edit' ? this.handleEdit : this.handleAdd;
    this.modelHelper
      .static(CrudFromComponent, { schema, value: args, mode, event: event.bind(this) }, 'lg', {
        // nzTitle: '新增表单',
        nzKeyboard: false,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  changeColumns(columns: STColumn[]) {
    const newColumns: STColumn[] = [];
    const transferData: TransferItem[] = [];
    columns.forEach((column) => {
      transferData.push({
        key: column.index || column.render,
        title: (column.title as any)?.text || column.title || column.renderTitle,
        direction: column.show === false ? 'left' : 'right',
      });
      newColumns.push({
        ...column,
        // __render: this.crudTemplateRef.getRow(column.render),
        // __renderTitle: this.crudTemplateRef.getTitle(column.renderTitle),
        iif: (...args) => {
          const stData: STData = args[0];
          return column.iif ? stData.show !== false && column.iif(...args) : stData.show !== false;
        },
      });
    });
    newColumns.push(this.tableAction);
    this.columns = columns;
    return {
      columns: newColumns,
      transferData,
    };
  }
}
