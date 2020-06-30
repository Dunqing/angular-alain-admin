import { Injectable, ViewChild } from '@angular/core';
import { SFSchemaEnumType } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CrudComponent } from 'src/app/shared/crud/crud.component';
import { getMenus } from 'src/app/shared/utils/menus';

@Injectable({
  providedIn: 'root',
})
export class AssignMenusService {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {}

  getOptions(): Observable<SFSchemaEnumType[]> {
    const url = '/user/menu';
    return this.http.get(url).pipe(
      map((value) => {
        return getMenus(value.data, (data) => ({
          title: data.text,
          key: data._id,
        }));
        // return value.data.map((role) => ({
        // }));
      }),
      catchError(() => of([])),
    );
  }

  assigningMenus(data) {
    const url = '/role/assigningMenus';
    return this.http.patch(url, data).pipe(
      tap((res) => {
        this.messageService.success(res.message);
      }),
    );
  }
}
