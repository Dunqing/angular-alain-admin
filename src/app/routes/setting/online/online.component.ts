import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { STColumn, STComponent, STWidthMode } from '@delon/abc/st';
import { SFSchema, SFUploadWidgetSchema } from '@delon/form';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CrudColumn } from 'src/app/shared/crud/interface/crud.interface';
import { CrudComponent } from '../../../shared/crud/crud.component';
import { OnlineService } from './online.service';

@Component({
  selector: 'app-online-user',
  templateUrl: './online.component.html',
  styles: [``],
})
export class OnlineComponent implements AfterViewInit {
  constructor(private onlineService: OnlineService) {
    console.log(this, 'UserComponent的this');
  }
  @ViewChild('crud') crud: CrudComponent;

  url = `/user/online`;

  tableAction: STColumn = {
    width: 100,
    buttons: [
      {
        text: '踢出',
        // iif: (item) => {
        //   return item.children && item.children.length;
        // },
        acl: {
          ability: ['user_online_out'],
        },
        type: 'del',
        pop: '确认要踢出吗？',
        icon: 'logout',
        iifBehavior: 'disabled',
        click: (record) => {
          this.onlineService
            .outUser({
              tokens: [record.token],
            })
            .subscribe(() => this.crud.load());
        },
        // tooltip: 'ST暂不支持tree table所以先简单实现 (没有子菜单时禁用)',
      },
    ],
  };

  columns: CrudColumn[] = [
    { title: '编号', type: 'checkbox', width: 60, fixed: 'left' },
    { title: '_id', index: '_id', fromHidden: true, show: false },
    {
      title: '昵称',
      index: 'nickname',
    },
    {
      title: 'token',
      index: 'token',
      widthMode: {
        type: 'strict',
        strictBehavior: 'truncate',
      } as STWidthMode,
    },
    {
      title: '手机号',
      index: 'phoneNumber',
    },
    {
      title: '头像',
      type: 'img',
      width: 80,
      index: 'avatar',
    },
    { title: '上次登录ip', index: 'lastLoginIp' },
    { title: '上次登录时间', index: 'lastLoginTime' },
  ];

  outOnlineUser({ checkbox }) {
    const tokens = checkbox.map((user) => user.token);
    this.onlineService
      .outUser({
        tokens,
      })
      .subscribe(() => this.crud.load());
  }

  crudChange(res) {
    console.log(res, 'crudChange');
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
}
