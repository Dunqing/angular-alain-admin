import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { CrudModule } from '../../shared/crud/crud.module';
import { SettingEditComponent } from './edit/edit.component';
import { LogComponent } from './log/log.component';
import { MenuComponent } from './menu/menu.component';
import { RoleComponent } from './role/role.component';
import { SettingRoutingModule } from './setting-routing.module';
import { DesignatedRoleComponent } from './user/components/designated-role.component';
import { UserComponent } from './user/user.component';

const COMPONENTS = [MenuComponent, UserComponent, RoleComponent, LogComponent, DesignatedRoleComponent];
const COMPONENTS_NOROUNT = [SettingEditComponent];

@NgModule({
  imports: [SettingRoutingModule, CrudModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class SettingModule {}
