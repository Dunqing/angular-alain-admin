import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map, switchMap } from 'rxjs/operators';
import { getMenus } from 'src/app/shared/utils/menus';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {}

  handleMenuData(menuList) {
    return getMenus(menuList, (item) => ({
      title: item.text,
      key: item._id,
    }));
  }

  // 获取父菜单接口
  getAllMenu() {
    const url = '/user/menu';
    return this.http.get(url).pipe(map((res: { data: any[] }) => this.handleMenuData(res.data)));
  }
}
