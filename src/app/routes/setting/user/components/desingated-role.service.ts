import { Injectable, ViewChild } from '@angular/core';
import { SFSchemaEnumType } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CrudComponent } from 'src/app/shared/crud/crud.component';

@Injectable({
  providedIn: 'root',
})
export class DesignatedRoleService {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {}

  getOptions(): Observable<SFSchemaEnumType[]> {
    const url = '/role/list';
    return this.http.get(url).pipe(
      map((value) => {
        return value.data.map((role) => ({
          label: role.name,
          value: role._id,
        }));
      }),
      catchError(() => of([])),
    );
  }

  assigningRole(data) {
    const url = '/role/assigningRoles';
    return this.http.patch(url, data).pipe(
      tap((res) => {
        this.messageService.success(res.message);
      }),
    );
  }
}
