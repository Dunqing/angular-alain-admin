import { NgModule } from '@angular/core';
import { CrudModule } from '../../shared/crud/crud.module';
import { DictionaryComponent } from './dictionary/component/dictionary/dictionary.component';
import { DictionaryTypeComponent } from './dictionary/dictionary.component';
import { LogComponent } from './log/log.component';
import { MenuComponent } from './menu/menu.component';
import { OnlineComponent } from './online/online.component';
import { AssignMenusComponent } from './role/components/assign-menus.component';
import { RoleComponent } from './role/role.component';
import { SettingRoutingModule } from './setting-routing.module';
import { DesignatedRoleComponent } from './user/components/designated-role.component';
import { UserComponent } from './user/user.component';

const COMPONENTS = [
  MenuComponent,
  UserComponent,
  RoleComponent,
  LogComponent,
  OnlineComponent,
  DictionaryTypeComponent,
  DictionaryComponent,
];
const COMPONENTS_NOROUNT = [DesignatedRoleComponent, AssignMenusComponent];

@NgModule({
  imports: [SettingRoutingModule, CrudModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class SettingModule {}
