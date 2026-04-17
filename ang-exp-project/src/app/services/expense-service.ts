import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor() {}
  // We parse first because we are loading old data, not creating new one. & because we need object to push into
  private expenses: Expense[] = JSON.parse(localStorage.getItem('expenses') ?? '[]');
  // ?? = Nullish Coalescing Operator ->If LEFT side is null or undefined → use RIGHT side”

  //  private means:

  // service.expenses nu direct access panna koodathu
  //  but getExpenses() moolama indirect ah data vangalam

  //  --------State management---------------
  // -----BehaviorSubject ->who subscribe to it will get the data------------
  private expensesSubject = new BehaviorSubject<Expense[]>([...this.expenses]);
  // ([...this.expenses]) ->orginal array  current value to  take copy and set the initial value

  // This is read-only view , Observable for component
  //  ---witho this line new data will not reflect in components -> UI update will not reflect
  expense$ = this.expensesSubject.asObservable();

  // --------------------ADD-EXPENSEE----------------------------
  addExpense(expense: Expense): void {
    const newExpense = {
      ...expense,
      id: Date.now(),
    };
    this.expenses.push(newExpense);
    this.updateState(); //   TO NOTIFY THE APP ON DATA CHANGE WITHOUT UPDATE (ONLY INSIDE THE SERVICES NOBODY ELSE KNOWN)
  }

  // DELETE EXPENSE
  // Remove that id item and update the list
  deleteExpense(id: number): void {
    this.expenses = this.expenses.filter((exp) => exp.id !== id);
    this.updateState();
  }

  // UI UPDATESTATE: Sends new data to all subscribers ,trigger UI Automatically
  //  Update the local storage with the current expenses list
  private updateState(): void {
    // Set the expenses list in local storage
    localStorage.setItem('expenses', JSON.stringify(this.expenses));

    /**
     * Notify all subscribers of the expensesSubject with the current expenses list
     */
    this.expensesSubject.next([...this.expenses]);
  }

  // EDIT EXPENSE
  updateExpense(updated: Expense): void {
    // map() -> To Check Every Item One-By-One
    this.expenses = this.expenses.map((exp) => (exp.id === updated.id ? updated : exp)); // ? updated : exp -> If match:updated new replace item , If didn't match ->to keep the old item place
    this.updateState();
  }

  // ----------------GET-EXPENSE-BY-ID--------------------------------

  getExpenseById(id: number): Expense | undefined {
    return this.expenses.find((exp) => exp.id === id); // find() ->To Check Every Item One-By-One
  }
}
