import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema, SFUploadWidgetSchema } from '@delon/form';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { CrudComponent } from '../../../shared/crud/crud.component';
import { DesignatedRoleComponent } from './components/designated-role.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
})
export class UserComponent implements AfterViewInit {
  constructor(private el: ElementRef, private modal: ModalHelper, private messageService: NzMessageService) {
    console.log(this, 'UserComponent的this');
  }
  @ViewChild('crud') crud: CrudComponent;

  url = `/user/pagination`;

  event = {
    url: '/user',
    options: {
      successCallback: () => {
        this.crud.load();
        console.log('成功回调');
      },
      errorCallback: () => {
        console.log('错误回调');
      },
    },
    edit: {
      reReq({ columnData }) {
        console.log(columnData);
        return {
          url: `/user/${columnData._id}`,
          // method: 'put',
          // data: value,
        };
      },
    },
    del: {
      reData(data: any) {
        console.log(data);
        const userIds = [];
        if (data instanceof Array) {
          data.forEach((item) => userIds.push(item._id));
        } else {
          userIds.push(data._id);
        }
        return {
          userIds,
        };
      },
      confirmOptions: {} as ModalOptions,
    },
  };

  columns: STColumn[] = [
    { title: '编号', type: 'checkbox', width: 60, fixed: 'left', fromHidden: true },
    { title: '_id', index: '_id', fromHidden: true, show: false },
    { title: '创建者id', index: 'creatorId', fromHidden: true, show: false },
    {
      title: '昵称',
      index: 'nickname',
      required: true,
    },
    { title: '用户名', index: 'username', required: true },
    {
      title: '密码',
      index: 'password',
      iif: () => false,
      required: true,
      fromEditHidden: true,
      schema: {
        maxLength: 11,
        minLength: 6,
        ui: {
          type: 'password',
        },
      } as SFSchema,
    },
    {
      title: '手机号',
      index: 'phoneNumber',
      schema: {
        type: 'string',
        format: 'mobile',
      } as SFSchema,
    },
    {
      // title: '角色',
      renderTitle: 'roles',
      // index: 'roles',
      render: 'roles',
      fromHidden: true,
      // format: (item) => {},
    },
    {
      title: '头像',
      type: 'img',
      width: 80,
      index: 'avatar',
      schema: {
        ui: {
          // showUploadList: false,
          widget: 'upload',
          action: '/upload',
          resReName: 'data.url',
          urlReName: 'data.url',
          listType: 'picture-card',
          limitFileCount: 1,
          fileType: 'image/png,image/jpeg,image/gif,image/bmp',
        } as SFUploadWidgetSchema,
      } as SFSchema,
    },
    { title: '上次登录ip', index: 'lastLoginIp', fromHidden: true },
    { title: '上次登录时间', index: 'lastLoginTime', fromHidden: true },
    {
      title: '状态',
      type: 'yn',
      index: 'status',
      yn: {
        yes: '启用',
        no: '禁用',
      },
      schema: {
        type: 'string',
        enum: [
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ],
        ui: {
          widget: 'radio',
        },
        default: true,
      } as SFSchema,
    },
  ];

  designatedRole(args) {
    console.log(args);
    if (args.changeType !== 'checkbox' || args.checkbox.length !== 1) {
      this.messageService.error('还未选择数据请先选择, (只能单独修改用户角色，只勾选一个)');
      return;
    }
    this.modal
      .open(
        DesignatedRoleComponent,
        {
          user: args.checkbox[0],
        },
        'md',
        {
          nzTitle: '指派角色',
        },
      )
      .subscribe((res) => {
        if (res) {
          this.crud.load();
        }
        console.log(res, 'modal');
      });
  }

  crudChange(res) {
    console.log(res, 'crudChange');
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
}
