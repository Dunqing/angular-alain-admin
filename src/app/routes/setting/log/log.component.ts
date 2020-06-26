import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData, STPage, STRes } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CrudComponent } from '../../../shared/crud/crud.component';
import { LogService } from './log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styles: [],
})
export class LogComponent {
  constructor(private logService: LogService, private messageService: NzMessageService, private modalService: NzModalService) {}
  @ViewChild('crud') crud: CrudComponent;
  url = `/logging/pagination`;

  columns: STColumn[] = [
    {
      title: '_id',
      index: '_id',
      show: false,
    },
    {
      title: '标题',
      index: 'title',
    },
    {
      type: 'badge',
      title: '类型',
      index: 'type',
      badge: {
        0: {
          text: '正常',
          color: 'success',
        },
        1: {
          text: '异常',
          color: 'error',
        },
      },
    },
    {
      title: '访问地址',
      index: 'url',
    },
    {
      title: '访问ip',
      index: 'ip',
    },
    {
      title: '用户信息',
      index: 'userId',
    },
    {
      title: '请求方式',
      index: 'method',
      type: 'tag',
      tag: {
        // * - 预设：geekblue,blue,purple,success,red,volcano,orange,gold,lime,green,cyan
        GET: {
          text: 'GET',
          color: 'success',
        },
        POST: {
          text: 'POST',
          color: 'blue',
        },
        PUT: {
          text: 'PUT',
          color: 'orange',
        },
        DELETE: {
          text: 'DELETE',
          color: 'red',
        },
        PATCH: {
          text: 'PATCH',
          color: 'gold',
        },
      },
    },
    {
      title: 'controller类名',
      index: 'controllerName',
    },
    {
      title: '接口方法名',
      index: 'funcName',
    },
    {
      title: '传递参数',
      index: 'body',
      show: false,
    },
    {
      title: '异常栈',
      index: 'stack',
    },
    {
      type: 'date',
      index: 'createdAt',
      title: '触发时间',
      dateFormat: 'yyyy年MM月dd日 H:mm:ss',
    },
    {
      type: 'date',
      index: 'updatedAt',
      title: '更新时间',
      show: false,
      dateFormat: 'yyyy年MM月dd日 H:mm:ss',
    },
  ];

  deleteAllLog() {
    this.modalService.confirm({
      nzTitle: '确认删除？',
      nzContent: `<b style="color: red;">你确定要删除所有日志吗？请注意，删除日志记录是不会被删除的！</b>`,
      nzOkText: '删除',
      nzOkType: 'danger',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.logService.deleteLogAll().subscribe((res) => {
          this.messageService.success(res.message);
          this.crud.load();
        });
      },
    });
  }
}
