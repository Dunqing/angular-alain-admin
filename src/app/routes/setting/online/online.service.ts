import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OnlineService {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {}

  outUser(data) {
    const url = '/user/out';
    return this.http.post(url, data).pipe(
      tap((res) => {
        this.messageService.success(res.message);
      }),
      catchError((err: any) => {
        console.log('踢出用户失败', err);
        this.messageService.error(err.error || err.errMessage);
        return throwError(err);
      }),
    );
  }
}
