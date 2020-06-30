import { STColumn } from '@delon/abc/st/table';
import { SFSchema } from '@delon/form';
import { _HttpHeaders } from '@delon/theme/src/services/http/http.client';

export interface RootEventOptions {
  /**
   * @description 成功请求时的回调 一般用于数据重新请求
   * @memberof RootEventOptions
   */
  successCallback?: (res?: any, options?: any) => void;
  /**
   * @description 失败请求时的回调 一般用于数据重新请求
   * @memberof RootEventOptions
   */
  errorCallback?: (err?: any, options?: any) => void;
}

export interface ReturnObjectType {
  [key: string]: any;
  [key: number]: any;
}

export interface RequestOptions {
  /**
   * @description 表格行数据
   * @type {*}
   * @memberof RequestOptions
   */
  columnData: any;
  /**
   * @description 表单提交数据
   * @type {any}
   * @memberof RequestOptions
   */
  fromData: any;
}

export interface ReqFuncReturn {
  /**
   * @description: http请求时传入数据
   * @type {any}
   */

  data?: any;
  /**
   * @description: 按钮事件请求的url
   * @type {any}
   */

  url?: string;

  /**
   * @description:
   * @type {any}
   */
  method?: any;

  /**
   * @description http的headers
   * @type {_HttpHeaders}
   */
  headers?: _HttpHeaders;
}

export interface EventOptions {
  /**
   * @description 该按钮的事件url
   * @type {string}
   * @memberof EventOptions
   */
  url?: string;
  /**
   * @description: 该按钮处理req请求
   * @return: ReqFuncReturn
   */
  reReq?: (data: RequestOptions) => ReqFuncReturn;
  /**
   * @description 专门只处理 data 返回一个新 data
   * @memberof EventOptions
   */
  reData?: (data: RequestOptions) => ReturnObjectType;
}

// export interface ButtonEvent {
// }

/**
 * @description: 该button默认指定function类型时
 * @params data 表单返回的数据
 * @params callback 表单传递的方法，可用来关闭modal模态框
 */
export type ButtonEvent = (data?: any, callback?: () => void) => void;

export interface CrudEventOptions {
  /**
   * @description 所有事件使用该url 除非被内部url覆盖
   * @type {string}
   * @memberof CrudEventOptions
   */
  url?: string;
  /**
   * @description add 按钮的 acl 权限点 ability
   * @type {string}
   * @memberof CrudEventOptions
   */
  addAbility?: string;
  /**
   * @descriptionedit 按钮的 acl 权限点 ability
   * @type {string}
   * @memberof CrudEventOptions
   */
  editAbility?: string;
  /**
   * @description del 按钮的 acl 权限点 ability
   * @type {string}
   * @memberof CrudEventOptions
   */
  delAbility?: string;

  /**
   * @description 展示表格上方的增加按钮
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  topAdd?: boolean;
  /**
   * @description 展示表格上方的编辑按钮
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  topEdit?: boolean;
  /**
   * @description 展示表格上方的删除按钮
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  topDel?: boolean;
  /**
   * @description add edit del 通用回调事件
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  options?: RootEventOptions;
  /**
   * @description add新增按钮
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  add?: EventOptions | ButtonEvent;
  /**
   * @description edit编辑按钮
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  edit?: EventOptions | ButtonEvent;
  /**
   * @description del删除按钮
   * @type {boolean}
   * @memberof CrudEventOptions
   */
  del?: EventOptions | ButtonEvent;
}

export interface CrudColumnSchema extends SFSchema {
  addReadonly?: boolean | null;
  editReadonly?: boolean | null;
}

export interface CrudColumn extends STColumn {
  /**
   * @description 表格隐藏，可在表格右上角第一个按钮上显示回来
   // tslint:disable-next-line: no-redundant-jsdoc
   * @type {boolean}
   * @memberof CrudColumn
   */
  show?: boolean;

  /**
   * @description 表单是否隐藏
   * @type {boolean}
   * @memberof CrudColumn
   */
  fromHidden?: boolean;
  /**
   * @description 编辑表单是否隐藏
   * @type {boolean}
   * @memberof CrudColumn
   */
  fromEditHidden?: boolean;
  /**
   * @description 新增表单是否隐藏
   * @type {boolean}
   * @memberof CrudColumn
   */
  fromAddHidden?: boolean;
  /**
   * @description 表单必填项
   * @type {boolean}
   * @memberof CrudColumn
   */
  required?: boolean;
  schema?: CrudColumnSchema;
}
