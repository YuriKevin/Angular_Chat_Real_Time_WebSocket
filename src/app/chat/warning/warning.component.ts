import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent {
  show: boolean = false;
  warning!: string;
  loading!: boolean;
  options!: boolean;
  ok!:boolean;
  write!:boolean;
  text!:string;

  @Output() confirmAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() textOutput: EventEmitter<string> = new EventEmitter<string>();

  updateValues(warning: string, loading: boolean, options: boolean, ok:boolean, write:boolean): void {
    this.show = true;
    this.warning = warning;
    this.loading = loading;
    this.options = options;
    this.ok = ok;
    this.write = write;
  }

  confirm() {
    this.confirmAction.emit(true);
    this.close();
  }

  cancel() {
    this.confirmAction.emit(false);
    this.close();
  }

  close(){
    this.show = false;
  }

  writeEmit() {
    this.textOutput.emit(this.text);
    this.text = '';
    this.close();
    this.updateValues('Carregando alteração.', true, false, false, false);
  }
  
}
