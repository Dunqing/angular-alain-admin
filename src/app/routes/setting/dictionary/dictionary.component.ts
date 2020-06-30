import { Component, ViewChild } from '@angular/core';
import { STColumn } from '@delon/abc/st/table';
import { ModalHelper } from '@delon/theme';
import { ModalOptions } from 'ng-zorro-antd/modal/public-api';
import { CrudComponent } from 'src/app/shared/crud/crud.component';
import { CrudColumn } from 'src/app/shared/crud/interface/crud.interface';
import { CrudEventOptions } from '../../../shared/crud/interface/crud.interface';
import { DictionaryComponent } from './component/dictionary/dictionary.component';

@Component({
  selector: 'app-dictionary-type',
  templateUrl: './dictionary.component.html',
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
export class DictionaryTypeComponent {
  constructor(private modalHelper: ModalHelper) {}
  @ViewChild('crud') crud: CrudComponent;
  url = '/dictionary/type/pagination';

  event: CrudEventOptions = {
    url: `/dictionary/type`,
    addAbility: 'dictionary_type_add',
    editAbility: 'dictionary_type_edit',
    delAbility: 'dictionary_type_del',
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
          url: `/dictionary/type/${columnData._id}`,
          // method: 'put',
          // data: value,
        };
      },
    },
    del: {
      reData({ fromData }) {
        console.log(fromData);
        const dictionaryTypeIds = [];
        if (fromData instanceof Array) {
          fromData.forEach((item) => dictionaryTypeIds.push(item._id));
        } else {
          dictionaryTypeIds.push(fromData._id);
        }
        return {
          dictionaryTypeIds,
        };
      },
    },
  };

  columns: CrudColumn[] = [
    { title: '编号', type: 'checkbox', width: 60, fixed: 'left', fromHidden: true },
    { title: '_id', index: '_id', fromHidden: true, show: false },
    {
      title: '字典类型名',
      index: 'name',
      type: 'link',
      click: (record) => {
        this.modalHelper
          .open(
            DictionaryComponent,
            {
              dictionaryType: record,
            },
            'xl',
            {
              nzTitle: `${record.name}的字典`,
              nzWrapClassName: 'vertival-center-modal',
            },
          )
          .subscribe();
      },
      schema: {
        ui: {
          spanLabelFixed: 100,
          grid: {
            span: 24,
          },
        },
      },
      required: true,
    },
    {
      title: '说明/描述',
      index: 'description',
      schema: {
        ui: {
          spanLabelFixed: 100,
          grid: {
            span: 24,
          },
        },
      },
    },
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
}
