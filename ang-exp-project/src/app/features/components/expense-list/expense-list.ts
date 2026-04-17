import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../../services/expense-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css',]
})
export class ExpenseList implements OnInit{
  // Expenses list continuous update  stream” ,expense$ -> Observable<Expense[]> -> naming convention of observable stream


  //  FILTER , SEARCH ,RESET

filteredExpenses: Expense[] =[];
allExpenses:Expense[] = [];

searchText:string = "";
selectedCategory:string = "";



// Angular DI
 constructor(private expenseService :ExpenseService,
  // Used to go to another page
 private router:Router)
 {}
  ngOnInit(): void {
  //  -----I am connecting the data stream from the service to the component
  this.expenseService.expense$.subscribe(data =>{
    this.allExpenses = data;
    this.applyFilters();
    console.log("FILTERED EXPENSES" , this.filteredExpenses);
  });
  }



applyFilters(){
this.filteredExpenses = this.allExpenses.filter(exp=>{
const matchCategory = 
//No category selected -> True
!this.selectedCategory || exp.category === this.selectedCategory ; 

const matchsearch= 
!this.searchText || exp.description.toLowerCase().includes(this.searchText.toLowerCase());
 
return matchCategory && matchsearch //&&-> COMBINE THE TWO CONDITIONS
});
}


// ----------------FILTER-------------------------
filter(category:string){
  this.selectedCategory = category;
   this.applyFilters();
}


// -----------------SEARCH-----------------------
search(text:string){
  this.searchText = text;
  this.applyFilters();
}

//------------------RESET----------------------
resetFilters(){
  this.searchText="";
  this.selectedCategory="";
  this.applyFilters();

}


// -----------------DELETE-------------------------
delete(id:number){
  this.expenseService.deleteExpense(id);
}


// -----------------EDIT----------------------
edit(id:number){
  this.router.navigate(["/edit" , id])
}

}


