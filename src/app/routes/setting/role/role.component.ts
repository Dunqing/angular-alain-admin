import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { CrudComponent } from '../../../shared/crud/crud.component';

@Component({
  selector: 'app-user',
  templateUrl: './role.component.html',
  styles: [],
})
export class RoleComponent implements AfterViewInit {
  constructor(private el: ElementRef) {
    console.log(this, 'UserComponent的this');
  }
  @ViewChild('crud') crud: CrudComponent;

  url = `/role/pagination`;

  event = {
    url: '/role',
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
          url: `/role/${columnData._id}`,
          // method: 'put',
          // data: value,
        };
      },
    },
    del: {
      reData(data: any) {
        console.log(data);
        const roleIds = [];
        if (data instanceof Array) {
          data.forEach((item) => roleIds.push(item._id));
        } else {
          roleIds.push(data._id);
        }
        return {
          roleIds,
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
      title: '角色名',
      index: 'name',
      required: true,
    },
    { title: '说明/描述', index: 'explanation' },
    {
      type: 'date',
      index: 'createdAt',
      title: '创建时间',
      dateFormat: 'yyyy年MM月dd日 HH:mm:ss',
      fromHidden: true,
    },
    {
      type: 'date',
      index: 'updatedAt',
      title: '更新时间',
      dateFormat: 'yyyy年MM月dd日 HH:mm:ss',
      fromHidden: true,
    },
  ];

  crudChange(res) {
    console.log(res, 'crudChange');
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
}
