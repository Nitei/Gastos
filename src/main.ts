import 'zone.js/dist/zone';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StorageUtils } from './storage-manager';

const initApp = {
  presupuesto: '',
  name: '',
  amount: '',
  sumatoria: 0,
  queda: 0,
  gastos: [] as { name: string; amount: string }[],
};

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <article>
  
  <br>

    <label>
      Presupuesto 
      &nbsp;
        <input [(ngModel)]="app.presupuesto" (input)="save()" (ngModelChange)="calculate()">
      &nbsp;
      
      <span style="margin-right: 40px;">
        Queda: {{app.queda}} 
      </span>

      <span>
        Gastos: {{app.sumatoria}}
      </span>
      
      
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      
      <button (click)="clean()"> Limpiar </button> 
      
      </label>
      
      <br>
      <br>
      <hr>
      
      <label>
      Nombre 
      &nbsp;
      <input [(ngModel)]="app.name" (input)="save()">
      &nbsp;
      Importe 
      &nbsp;
        <input [(ngModel)]="app.amount" (input)="save()">
      &nbsp;
      <button (click)="addWaste()" [disabled]="!app.name || !app.amount">
        Agregar gasto
      </button>
      </label>
      
      <br>
      <hr>
      
      <br>
      
      <div>
        <table class="minimalistBlack">
          <thead>
            <tr>
              <th  style="width:60px; text-align: center">Borrar</th>
              <th>Gasto</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let gasto of app.gastos; let idx = index">
              <td  style="text-align: center"><button (click)="deleteWaste(idx)"> X </button></td>
              <td>{{gasto.name}}</td>
              <td>{{gasto.amount}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      </article>
      
  `,
})
export class App {
  app = { ...initApp };

  storage = new StorageUtils<{
    presupuesto: string;
    gastos: { name: string; amount: string }[];
  }>();

  constructor() {
    const init = this.storage.session.getKey('gastos');
    if (init) {
      this.app = init;
    } else {
      this.save()
    }
  }

  @HostListener('keyup.enter') onEnter() {
    this.addWaste();
  }

  clean() {
    this.app = { ...initApp };
    this.storage.session.setKey('gastos', this.app);
  }

  addWaste() {
    if (this.app.amount && this.app.name) {
      this.app.gastos.push({ name: this.app.name, amount: this.app.amount });
      this.calculate();
    }
  }

  deleteWaste(idx: number) {
    this.app.gastos.splice(idx, 1);
    this.calculate();
  }

  calculate() {
    this.app.amount = '';
    this.app.name = '';
    this.app.sumatoria = this.app.gastos.reduce(
      (acc: any, el: any) => acc + +el.amount,
      0
    );
    this.app.queda = +this.app.presupuesto - this.app.sumatoria;

    this.save()
  }

  save() {
    this.storage.session.setKey('gastos', this.app);
  }
}

bootstrapApplication(App);
