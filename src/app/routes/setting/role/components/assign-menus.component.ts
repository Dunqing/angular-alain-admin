import { Component, Input } from '@angular/core';
import { SFSchema, SFSelectWidgetSchema, SFTreeSelectWidgetSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AssignMenusService } from './assign-menus.service';

@Component({
  selector: 'app-role-assign-menus',
  template: `
    <nz-spin nzTip="拼命加载中" nzSize="large" [nzSpinning]="http.loading" class="modal-spin">
      <sf #sf mode="edit" [schema]="schema" [formData]="_formData" button="none">
        <div class="modal-footer">
          <button nz-button type="button" (click)="close()">关闭</button>
          <button nz-button type="button" (click)="sf.reset(true)">重置</button>
          <button nz-button type="submit" nzType="primary" (click)="save(sf.value)" [disabled]="!sf.valid" [nzLoading]="http.loading">
            保存
          </button>
        </div>
      </sf>
    </nz-spin>
  `,
  styles: [],
})
export class AssignMenusComponent {
  constructor(public http: _HttpClient, private modal: NzModalRef, private assignMenus: AssignMenusService) {}
  _formData = {
    menuIds: [],
  };
  _role = {};
  @Input()
  set role(role: any) {
    this._role = role;
    console.log(role);
    this._formData.menuIds = this.getMenuIds(role.menus);
    (this.schema.properties.menuIds.ui as any).expandedKeys = this._formData.menuIds;
  }
  get role() {
    return this._role;
  }

  schema: SFSchema = {
    properties: {
      menuIds: {
        type: 'string',
        title: '菜单',
        ui: {
          spanLabel: 2,
          spanControl: 22,
          widget: 'tree-select',
          checkable: true,
          mode: 'tags',
          placeholder: '请选择菜单',
          checkStrictly: true,
          expandedKeys: [],
          asyncData: () => this.assignMenus.getOptions(),
        } as SFTreeSelectWidgetSchema,
        // type: 's'
      },
    },
  };
  getMenuIds(menuList: any[]) {
    const menuIds = [];
    function getId(menus: any[]) {
      if (!menus) {
        return [];
      }
      menus.forEach((menu) => {
        menuIds.push(menu._id);
        getId(menu.children);
      });
      return menuIds;
    }
    getId(menuList);
    return menuIds;
  }

  save(value) {
    // this.
    const data = {
      roleId: this.role._id,
      menuIds: value.menuIds,
    };
    this.assignMenus.assigningMenus(data).subscribe((res) => {
      this.close(res);
    });
    console.log(value);
  }

  close(result?: any) {
    this.modal.destroy(result);
  }
}
