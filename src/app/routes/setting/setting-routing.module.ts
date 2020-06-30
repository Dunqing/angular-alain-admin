import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { DictionaryTypeComponent } from './dictionary/dictionary.component';
import { LogComponent } from './log/log.component';
import { MenuComponent } from './menu/menu.component';
import { OnlineComponent } from './online/online.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'menu',
    canActivate: [ACLGuard],
    data: {
      guard: {
        ability: ['menu_read'],
      },
    },
    component: MenuComponent,
  },
  {
    path: 'user',
    canActivate: [ACLGuard],
    data: {
      guard: {
        ability: ['user_read'],
      },
    },
    component: UserComponent,
  },
  {
    path: 'logging',
    canActivate: [ACLGuard],
    data: {
      guard: {
        ability: ['logging_read'],
      },
    },
    component: LogComponent,
  },
  {
    path: 'role',
    canActivate: [ACLGuard],
    data: {
      guard: {
        ability: ['role_read'],
      },
    },
    component: RoleComponent,
  },
  {
    path: 'dictionary',
    canActivate: [ACLGuard],
    data: {
      guard: {
        ability: ['dictionary_read'],
      },
    },
    component: DictionaryTypeComponent,
  },
  {
    path: 'online',
    canActivate: [ACLGuard],
    data: {
      guard: {
        ability: ['user_online_read'],
      },
    },
    component: OnlineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule {}
