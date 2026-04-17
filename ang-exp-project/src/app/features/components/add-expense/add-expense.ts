import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../../services/expense-service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0,[ Validators.required, Validators.min(1)]],
    });
  }
  onSubmit(): void {
    if (this.form.invalid) {
      //       form-la required fields fill pannala na stop
      // markAllAsTouched() → error messages kaatta help pannum
      this.form.markAllAsTouched();
      return;
    }
    // Form-la irukkura ella values-um object-aa edukkudhu
    const formData = this.form.getRawValue();

    const newexpense = {
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount),
    };
    this.expenseService.addExpense(newexpense);

    //  Service will:

    //  push into array
    //  updateState()
    //  localStorage save
    // UI auto update

    this.router.navigate(['/expenses']); // REDirect
  }
}
