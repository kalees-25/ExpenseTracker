import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-expense.html',
  styleUrls: ['./edit-expense.css'],
})
export class EditExpense implements OnInit {
  constructor(
    private expenseService: ExpenseService,
    // --Used to read current URL data--
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private routerNav: Router,
  ) {}

  // ----------------------------------------------------

  form!: FormGroup; //----DECLARE-----
  expenseId!: number;
  ngOnInit(): void {
    //---------------CREATE FORM USING FORM BUILDER------------
    this.form = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      amount: [null, Validators.required],
    });

    // WHAT IS THE VALUE OF THE ID IN THE URL OF THE CURRENT PAGE AT THIS MOMENT
    // this.expenseId =Number(this.router.snapshot.paramMap.get("id"));

    const id = this.router.snapshot.paramMap.get('id');

    if (!id) {
      this.routerNav.navigate(['/expenses']);
      return;
    }

    this.expenseId = Number(id);

    //----------that ID will be used to get the corresponding expense object-----------
    const expense = this.expenseService.getExpenseById(this.expenseId);

    //------------To check if the data is available-----------
    if (expense) {
      this.form.patchValue(expense);
    } else {
      this.routerNav.navigate(['/expenses']);
    }
  }

  //-----------------SUBMIT-----------------------
  onSubmit(): void {
    if (this.form.invalid) {
      // form-la required fields fill pannala na stop
      // markAllAsTouched() → error messages kaatta help pannum
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.getRawValue();

    const updatedExpense = {
      id: this.expenseId,
      ...formData,
      amount: Number(formData.amount),
    };

    this.expenseService.updateExpense(updatedExpense);

    this.routerNav.navigate(['/expenses']);
  }
}
