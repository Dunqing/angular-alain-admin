import { ChangeDetectorRef } from '@angular/core';
import { Directive, Injectable, OnInit, Optional, TemplateRef } from '@angular/core';

@Injectable()
export class CrudTopButtonTemplateRef {
  private buttons: TemplateRef<void>[] = [];
  get topButtons() {
    return this.buttons;
  }

  addButton(btn: any) {
    this.buttons.push(btn);
  }
}

@Directive({ selector: '[crud-top-button]' })
export class CrudTopButtonDirective implements OnInit {
  // @Input('') id: string;

  constructor(@Optional() private tRef: TemplateRef<void>, private crudTopButton: CrudTopButtonTemplateRef) {}

  ngOnInit(): void {
    this.crudTopButton.addButton(this.tRef);
  }
}
