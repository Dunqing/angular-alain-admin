import { Component, Input } from '@angular/core';
import { SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DesignatedRoleService } from './desingated-role.service';

@Component({
  selector: 'app-user-designated-role',
  template: `
    <!-- <div class="modal-header">
      <div class="modal-title">指定角色</div>
    </div> -->
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
export class DesignatedRoleComponent {
  constructor(public http: _HttpClient, private modal: NzModalRef, private drs: DesignatedRoleService) {}
  _formData = {
    roleIds: [],
  };
  _user = {};
  @Input()
  set user(user: any) {
    this._user = user;
    console.log(user);
    this._formData.roleIds = user.roles.map((role) => role._id);
    console.log(this._formData);
  }
  get user() {
    return this._user;
  }
  schema: SFSchema = {
    properties: {
      roleIds: {
        type: 'string',
        title: '角色',
        ui: {
          spanLabel: 2,
          spanControl: 22,
          widget: 'select',
          mode: 'tags',
          placeholder: '请选择角色',
          asyncData: () => this.drs.getOptions(),
        } as SFSelectWidgetSchema,
        // type: 's'
      },
    },
  };

  save(value) {
    // this.
    const data = {
      userId: this.user._id,
      roleIds: value.roleIds,
    };
    this.drs.assigningRole(data).subscribe((res) => {
      this.close(res);
    });
    console.log(value);
  }

  close(result?: any) {
    this.modal.destroy(result);
  }
}
