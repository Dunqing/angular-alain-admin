import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, Menu, MenuService, SettingsService, TitleService } from '@delon/theme';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  handleMenus(menuList: any[]) {
    function handle(menus, index: number) {
      return menus.map((item) => {
        let children = [];
        if (item.children && item.children.length) {
          if (item.children[0].type !== 3) {
            children = JSON.parse(JSON.stringify(item.children));
          }
        }
        Reflect.deleteProperty(item, 'children');
        let icon = {};
        if (index > 1) {
          Reflect.deleteProperty(item, 'icon');
        } else {
          icon = { icon: { type: 'icon', value: item.icon } };
          Reflect.deleteProperty(item, 'icon');
        }
        // console.log(meta?.title, children);
        return {
          ...item,
          ...icon,
          group: item.type === 2,
          // icon: item.type === 0 ? { type: 'icon', value: item.icon } : undefined,
          children: children.length ? handle(children, index + 1) : undefined,
        };
      });
    }
    return handle(menuList, 0);
  }

  private viaHttp(resolve: any, reject: any) {
    const menus: Menu[] = [
      {
        text: 'Main',
        group: true,
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: 'appstore',
          },
          {
            text: '系统设置',
            link: '/setting',
            icon: { type: 'icon', value: 'appstore' },
            children: [
              {
                text: '菜单管理',
                link: '/setting/menu',
              },
              {
                text: '用户管理',
                link: '/setting/user',
              },
              {
                text: '角色管理',
                link: '/setting/role',
              },
              {
                text: '日志管理',
                link: '/setting/log',
              },
            ],
          },
          {
            text: '用户管理',
            link: '/setting/user',
            icon: { type: 'icon', value: 'rocket' },
            shortcutRoot: true,
          },
          {
            text: '菜单管理',
            link: '/setting/menu',
            icon: { type: 'icon', value: 'rocket' },
            shortcutRoot: true,
          },
          {
            text: '日志管理',
            link: '/setting/log',
            icon: { type: 'icon', value: 'rocket' },
          },
        ],
      },
    ];

    zip(
      // this.httpClient.get('assets/tmp/app-data.json')
      this.httpClient.post('/user/info', {}),
      this.httpClient.get('/user/menu'),
    )
      .pipe(
        catchError((res) => {
          console.warn(`StartupService.load: Network request failed`, res);
          resolve(null);
          return [];
        }),
      )
      .subscribe(
        ([userInfo, userMenu]) => {
          // Application data
          // const res: any = appData;
          console.log(userInfo, userMenu);
          // Application information: including site name, description, year
          this.settingService.setApp({
            name: 'Angular admin',
            description: 'rbac权限模型通用型后台',
          });
          // User information: including name, avatar, email address
          this.settingService.setUser({
            ...userInfo.data,
            name: userInfo.data.nickname,
          });
          // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
          // this.aclService.setFull(true);
          this.aclService.set({ ability: userInfo.data.permissionIdentifierList }); // Menu data, https://ng-alain.com/theme/menu
          this.aclService.attachAbility([undefined, null]);
          console.log(this.aclService.data, 'aclSe;rvice');
          // this.menuService.add(menus);
          // this.menuService.add(userMenu.data);
          this.menuService.add(this.handleMenus(userMenu.data));
          // Can be set page suffix title, https://ng-alain.com/theme/title
          this.titleService.suffix = 'Admin';
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`,
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789',
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    this.settingService.setUser(user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: 'Main',
        group: true,
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: { type: 'icon', value: 'appstore' },
          },
          {
            text: 'Quick Menu',
            icon: { type: 'icon', value: 'rocket' },
            shortcutRoot: true,
          },
        ],
      },
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaHttp(resolve, reject);
    });
  }
}
