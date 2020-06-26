import { AfterViewInit, ChangeDetectorRef, Directive, Host, Injectable, Input, OnInit, Optional, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CrudTemplateRef {
  constructor() {}
  private titles: { [key: string]: TemplateRef<void> } = {};
  private rows: { [key: string]: TemplateRef<void> } = {};

  public get titleKeys() {
    return Object.keys(this.titles);
  }

  public get rowKeys() {
    return Object.keys(this.rows);
  }

  addTitle(path: string, ref: TemplateRef<void>) {
    return (this.titles[path] = ref);
  }

  addRow(path: string, ref: TemplateRef<void>) {
    return (this.rows[path] = ref);
  }

  getTitle(path: string) {
    return this.titles[path];
  }

  getRow(path: string) {
    return this.rows[path];
  }
}

@Directive({ selector: '[crud-row]' })
export class CrudRowDirective implements OnInit {
  @Input('crud-row')
  set row(id: string) {
    this.source.addRow(id, this.ref);
  }

  constructor(private ref: TemplateRef<void>, private source: CrudTemplateRef) {}

  ngOnInit(): void {
    // console.log(this.id, this.ref);
    // this.source.addRow(this.id, this.ref);
  }
}

@Directive({ selector: '[crud-title]' })
export class CrudTitleDirective implements OnInit {
  @Input('crud-title')
  set row(id: any) {
    this.source.addTitle(id, this.ref);
    this.cdr.markForCheck();
  }

  constructor(@Optional() private cdr: ChangeDetectorRef, private ref: TemplateRef<void>, private source: CrudTemplateRef) {}

  ngOnInit(): void {}
}
