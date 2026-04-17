import { ChildrenOutletContexts, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './features/components/dashboard/dashboard';
import { ExpenseList } from './features/components/expense-list/expense-list';
import { AddExpense } from './features/components/add-expense/add-expense';
import { EditExpense } from './features/components/edit-expense/edit-expense';

// IT IS ROUTING CONFIG OR TO TELL ANGULAR [ URL->WHICH COMPONENT]
export const routes: Routes = [
   
    // PATH -> BROWSER URL
 //  PATH:"" ->ROOT URL 
  {
    path:"" , component:Layout,

    children: [
      //  REDIRECT =>Default page set panna
      {path:"" , redirectTo:"dashboard" , pathMatch:"full"},
      {path:"dashboard" , component: Dashboard},
      {path:"expenses" , component: ExpenseList},
      {path:"add" , component: AddExpense},
      {path:"edit/:id", component: EditExpense}
    ]
   }  
];
