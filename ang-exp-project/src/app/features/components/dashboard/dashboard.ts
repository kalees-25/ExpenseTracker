import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../../services/expense-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  allExpenses: Expense[] = [];
  totalExpense: number = 0;
  categoryTotals: Record<string, number> = {};
  recentExpenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.expense$.subscribe((data) => {
      this.allExpenses = data;
      this.calculateDashboard();
    });
  }

  calculateDashboard(): void {
    this.totalExpense = this.allExpenses.reduce((total: number, exp: Expense) => {
      return total + Number(exp.amount || 0);
    }, 0);

    this.categoryTotals = this.allExpenses.reduce(
      (acc, exp) => {
        const category = exp.category || 'undefined'; //acc[category] = On that category current total
        acc[category] = (acc[category] || 0) + Number(exp.amount);
        return acc;
      },
      // ----start with empty object {}-----
      {} as Record<string, number>,
    ); // It Is  string key, number value  object

    //----------RECENT EXPENSES-------------
    this.recentExpenses = [...this.allExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) //  getTime->date →  convert into milliseconds
      .slice(0, 5);
  }
}
