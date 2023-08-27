import { Gasto } from './main';

export const mock = {
  presupuesto: '2200',
  name: '',
  amount: '',
  sumatoria: 1900,
  queda: 300,
  gastos: [
    {
      name: 'mama',
      amount: '200',
      countIt: true,
    } as Gasto,
    {
      name: 'hacienda',
      amount: '150',
      countIt: true,
    } as Gasto,
    {
      name: 'cara',
      amount: '150',
      countIt: true,
    } as Gasto,
    {
      name: 'piso',
      amount: '700',
      countIt: true,
    } as Gasto,
    {
      name: 'muela',
      amount: '400',
      countIt: true,
    } as Gasto,
    {
      name: 'gastos',
      amount: '300',
      countIt: true,
    } as Gasto,
  ],
};
