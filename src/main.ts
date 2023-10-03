import 'zone.js/dist/zone';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StorageUtils } from './storage-manager';
import { mock } from './mock';

const initApp = {
  presupuesto: '',
  name: '',
  amount: '',
  sumatoria: 0,
  queda: 0,
  gastos: [] as Gasto[],
};

export class Gasto {
  constructor(public name = '', public amount = '', public countIt = true) {}
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <article>
  
  <br>

  <button (click)="loadMock()"> Cargar mock </button> 

  <br>
  <br>

    <label>
      Presupuesto 
      &nbsp;
        <input [(ngModel)]="app.presupuesto" (input)="save()" (ngModelChange)="calculate()">
      &nbsp;
      
      <span style="margin-right: 40px; background-color: #88ff00c2">
        Queda: {{app.queda}} 
      </span>

      <span style="background-color: #fb00006b">
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
      <input id="name" [(ngModel)]="app.name" (input)="save()">
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
        <table class="paleBlueRows">
          <thead>
            <tr>
            <th style="width:60px; text-align: center">Activo</th>
            <th>Gasto</th>
            <th>Importe</th>
            <th style="width:60px; text-align: center">Borrar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let gasto of app.gastos; let idx = index">
            <td  style="text-align: center">
              <input type="checkbox" 
              [(ngModel)]="gasto.countIt"
              (ngModelChange)="calculate()"></td>
            <td>{{gasto.name}}</td>
            <td>{{gasto.amount}}</td>
            <td  style="text-align: center"><button (click)="deleteWaste(idx)"> X </button></td>
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
    gastos: Gasto[];
  }>();

  constructor() {
    const init = this.storage.session.getKey('gastos');
    if (init) {
      this.app = init;
    } else {
      this.save();
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
      this.app.gastos.push(new Gasto(this.app.name, this.app.amount));
      this.calculate();
    }
    const timer = setTimeout(() => {
      document.getElementById('name')?.focus();
      clearTimeout(timer);
    });
    console.log(this.app);
  }

  deleteWaste(idx: number) {
    this.app.gastos.splice(idx, 1);
    this.calculate();
  }

  calculate() {
    this.app.amount = '';
    this.app.name = '';
    this.app.sumatoria = this.app.gastos.reduce(
      (acc: any, el: any) => (el.countIt ? acc + +el.amount : acc),
      0
    );
    this.app.queda = +this.app.presupuesto - this.app.sumatoria;

    this.save();
  }

  save() {
    this.storage.session.setKey('gastos', this.app);
  }

  loadMock() {
    this.app = mock;
    this.calculate();
  }
}

bootstrapApplication(App);
