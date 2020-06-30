import { Component, Input, ViewChild } from '@angular/core';
import { STColumn } from '@delon/abc/st/table';
import { ModalOptions } from 'ng-zorro-antd/modal/public-api';
import { of } from 'rxjs';
import { CrudComponent } from 'src/app/shared/crud/crud.component';
import { CrudEventOptions } from '../../../../../shared/crud/interface/crud.interface';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
})
export class DictionaryComponent {
  @ViewChild('crud') crud: CrudComponent;

  @Input()
  dictionaryType = {
    _id: '',
    name: '',
  };

  get formData() {
    return {
      typeId: this.dictionaryType._id,
    };
  }

  _url = '/dictionary/type/';
  usePagination = false;

  get url() {
    return this._url + this.dictionaryType.name;
  }

  get selectOption() {
    return [
      {
        label: this.dictionaryType.name,
        value: this.dictionaryType._id,
      },
    ];
  }

  event: CrudEventOptions = {
    url: `/dictionary`,
    addAbility: 'dictionary_add',
    editAbility: 'dictionary_edit',
    delAbility: 'dictionary_del',
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
      reReq: ({ columnData }) => {
        console.log(columnData);
        return {
          url: `${this.event.url}/${columnData.name}`,
        };
      },
    },
    del: {
      reData: ({ fromData }) => {
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

  columns: STColumn[] = [
    { title: '编号', type: 'checkbox', width: 60, fixed: 'left', fromHidden: true },
    { title: '_id', index: '_id', fromHidden: true, show: false },
    {
      title: '字典类型名',
      render: 'typeId',
      schema: {
        title: '字典类型id',
        readOnly: true,
        ui: {
          widget: 'select',
          spanLabelFixed: 100,
          grid: {
            span: 24,
            spanLabelFixed: 100,
          },
          asyncData: () => of(this.selectOption),
        },
      },
      required: true,
    },
    {
      title: '标签',
      index: 'label',
      required: true,
    },
    {
      title: '值',
      index: 'value',
      required: true,
    },
    {
      title: '描述',
      index: 'description',
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
