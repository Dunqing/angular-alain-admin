import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {}

  deleteLogAll() {
    const url = '/logging/all';
    return this.http.delete(url).pipe(
      catchError((err: any) => {
        console.log('删除所有日志失败', err);
        this.messageService.error(err.error || err.errMessage);
        return throwError(err);
      }),
    );
  }
}
