import { Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { STChange } from '@delon/abc/st';
import { STChangeRowClick, STColumn } from '@delon/abc/st/table';
import { SFRadioWidgetSchema, SFSchema, SFTreeSelectWidgetSchema } from '@delon/form';
import { ModalHelper } from '@delon/theme';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ModalOptions } from 'ng-zorro-antd/modal/public-api';
import { tap } from 'rxjs/operators';
import { CrudComponent } from 'src/app/shared/crud/crud.component';
import { StartupService } from '../../../core/startup/startup.service';
import { CrudColumn, CrudEventOptions } from '../../../shared/crud/interface/crud.interface';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      ::ng-deep .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      ::ng-deep .vertical-center-modal .ant-modal {
        top: 0;
      }
    `,
  ],
})
export class MenuComponent implements OnInit {
  constructor(
    private menuService: MenuService,
    private modalHelper: ModalHelper,
    private startupService: StartupService,
    @Optional() private modalRef: NzModalRef,
  ) {}

  @ViewChild('crud') crud: CrudComponent;
  _pid: string;
  @Input() // 父级菜单id
  set pid(id: string) {
    console.log(id, 'pid传入');
    if (id) {
      this._pid = id;
      this.url = `/menu/currentUser/merge/${id}`;
      this.formData.pid = id;
      this.columns = this.columns.map((item) => {
        return !item.schema || (item.schema && item.schema.addReadOnly === undefined)
          ? {
              ...item,
              // addReadOnly,
            }
          : {
              ...item,
              schema: {
                ...item.schema,
                addReadOnly: !!id,
              },
            };
      });
    }
  }
  get pid() {
    console.log(this._pid);
    return this._pid;
  }

  url = `/user/menu`;
  usePagination = false;
  formData = {
    pid: null,
  };

  event: CrudEventOptions = {
    url: '/menu',
    addAbility: 'menu_add',
    editAbility: 'menu_edit',
    delAbility: 'menu_del',
    options: {
      successCallback: () => {
        this.crud.load();
        this.startupService.load();
        console.log('成功回调');
      },
      errorCallback: () => {
        console.log('错误回调');
      },
    },
    add: {
      reData({ fromData: data }) {
        if (data.pid === '') {
          data.pid = null;
          // Reflect.deleteProperty(data, 'pid');
        }
        return data;
        // else
      },
    },
    edit: {
      reReq({ columnData }) {
        console.log(columnData);
        return {
          url: `/menu/${columnData._id}`,
        };
      },
      reData({ fromData: data }) {
        if (data.pid === '') {
          data.pid = null;
        }
        console.log(data);
        return data;
        // else
      },
    },
    del: {
      reData({ fromData: data }) {
        console.log(data);
        const menuIds = [];
        if (data instanceof Array) {
          data.forEach((item) => menuIds.push(item._id));
        } else {
          menuIds.push(data._id);
        }
        return {
          menuIds,
        };
      },
    },
  };

  scroll = {
    y: '70vh',
    x: '150vw',
  };

  tableAction: STColumn = {
    width: 230,
    buttons: [
      {
        text: '子菜单',
        // iif: (item) => {
        //   return item.children && item.children.length;
        // },
        icon: 'menu',
        iifBehavior: 'disabled',
        click: (record) => {
          if (this.modalRef) {
            this.modalRef.close();
          }
          this.modalHelper
            .open(
              MenuComponent,
              {
                pid: record._id,
              },
              'xl',
              {
                nzTitle: `${record.text}的子菜单`,
                nzWrapClassName: 'vertical-center-modal',
              },
            )
            .subscribe((res) => {
              console.log(res, 'modal');
              this.crud.load();
            });
        },
        tooltip: 'ST暂不支持tree table所以先简单实现 (没有子菜单时禁用)',
      },
    ],
  };

  columns: CrudColumn[] = [
    { title: '编号', type: 'checkbox', width: 60, fixed: 'left', fromHidden: true },
    { title: '_id', index: '_id', fromHidden: true, show: false },
    {
      title: '父菜单',
      index: 'pid',
      schema: {
        addReadOnly: null,
        default: null,
        ui: {
          widget: 'tree-select',
          spanLabelFixed: 100,
          allowClear: true,
          asyncData: () => this.menuService.getAllMenu(),
          grid: {
            span: 24,
          },
        } as SFTreeSelectWidgetSchema,
      } as SFSchema,
    },
    {
      title: '类型',
      index: 'type',
      type: 'tag',
      tag: {
        0: {
          text: '路由',
        },
        1: {
          text: '外链',
        },
        2: {
          text: '分组',
        },
        3: {
          text: '按钮',
        },
      },
      schema: {
        type: 'string',
        enum: [
          {
            label: '路由',
            value: 0,
          },
          {
            label: '外链',
            value: 1,
          },
          {
            label: '分组',
            value: 2,
          },
          {
            label: '按钮',
            value: 3,
          },
        ],
        ui: {
          spanLabel: 4,
          spanControl: 20,
          widget: 'radio',
          grid: {
            span: 24,
          },
        } as SFRadioWidgetSchema,
        default: 0,
      } as SFSchema,
    },
    {
      title: '菜单名',
      index: 'text',
      required: true,
    },
    {
      title: '路由',
      index: 'link',
      required: true,
      schema: {
        ui: {
          visibleIf: this.visibleIfType(0),
        },
      } as SFSchema,
    },
    {
      title: '外链',
      index: 'externalLink',
      required: true,
      schema: {
        ui: {
          visibleIf: this.visibleIfType(1),
          validator: (value: string) => {
            const result = new RegExp('^https?://').test(value);
            return !result ? [{ keyword: 'required', message: '开头必须包含http://获取https://' }] : [];
          },
        },
      } as SFSchema,
    },
    {
      title: '权限标识符',
      index: 'permissionIdentifier',
      required: true,
      schema: {
        ui: {
          // visibleIf: this.visibleIfType([0, 2]),
          spanLabelFixed: 100,
          // spanControl: 20,
          grid: {
            span: 24,
          },
        },
      },
    },
    {
      title: '图标',
      index: 'icon',
      schema: {
        ui: {
          visibleIf: this.visibleIfType([0, 1]),
        },
      },
    },
    {
      title: '排序',
      index: 'sort',
      default: '-',
      schema: {
        ui: {
          visibleIf: this.visibleIfType([0, 1, 2]),
        },
        type: 'number',
        default: 1,
      } as SFSchema,
    },
    {
      title: '是否隐藏',
      index: 'hide',
      type: 'yn',
      yn: {
        yes: '隐藏',
        no: '显示',
        mode: 'text',
      },
      schema: {
        type: 'boolean',
        ui: {
          visibleIf: this.visibleIfType([0, 1]),
          spanLabel: 8,
          spanControl: 16,
          checkedChildren: '隐藏',
          unCheckedChildren: '显示',
        },
        default: false,
      } as SFSchema,
    },
    {
      title: '是否禁用',
      index: 'disabled',
      type: 'yn',
      yn: {
        yes: '禁用',
        no: '启用',
        mode: 'text',
      },
      schema: {
        type: 'boolean',
        ui: {
          visibleIf: this.visibleIfType([0, 1]),
          spanLabel: 8,
          spanControl: 16,
          checkedChildren: '禁用',
          unCheckedChildren: '启用',
        },
        default: false,
      } as SFSchema,
    },
    {
      title: '是否快捷菜单',
      index: 'shortcut',
      type: 'yn',
      yn: {
        yes: '是',
        no: '否',
        mode: 'text',
      },
      schema: {
        type: 'boolean',
        ui: {
          visibleIf: this.visibleIfType([0, 1]),
          spanLabel: 8,
          spanControl: 16,
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
        default: false,
      } as SFSchema,
    },
    {
      title: '是否快捷菜单根',
      index: 'shortcutRoot',
      type: 'yn',
      yn: {
        yes: '是',
        no: '否',
        mode: 'text',
      },
      schema: {
        type: 'boolean',
        ui: {
          visibleIf: this.visibleIfType([0, 1]),
          spanLabel: 8,
          spanControl: 16,
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
        default: false,
      } as SFSchema,
    },
    {
      title: '是否允许复用',
      index: 'reuse',
      type: 'yn',
      yn: {
        yes: '是',
        no: '否',
        mode: 'text',
      },
      schema: {
        type: 'boolean',
        ui: {
          visibleIf: this.visibleIfType(0),
          spanLabel: 8,
          spanControl: 16,
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
        default: false,
      } as SFSchema,
    },
  ];

  schema = {} as SFSchema;

  visibleIfType(value?: any) {
    return {
      type: (v) => {
        if (Array.isArray(value)) {
          return value.includes(v);
        } else {
          return value === v;
        }
      },
    };
  }

  notGroup() {
    return {
      type: (v) => {
        return v !== 3;
      },
    };
  }

  crudChange(e: STChange) {
    console.log(e, 'crudChange');
  }

  ngOnInit(): void {}
}
