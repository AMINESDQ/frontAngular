import {Component, OnInit} from '@angular/core';
import {async, catchError, Observable, throwError} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {AuthService} from "../services/auth.service";
import {AccountDetails} from "../models/account";
import {AsyncPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    DatePipe,
    AsyncPipe,
    NgIf,
    DecimalPipe,
    NgForOf
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accountFormGroup!:FormGroup;
  operationFormGroup!:FormGroup;
  currentPage:number = 0;
  pageSize:number = 5;
  account$!:Observable<AccountDetails>;
  public errorMessage :string="";
  constructor(private fb:FormBuilder ,private accountService:AccountsService , public authService:AuthService) {
  }
  ngOnInit() {
    this.accountFormGroup = this.fb.group({
      accountId:this.fb.control('')
    })
    this.operationFormGroup = this.fb.group({
      operationType:this.fb.control(''),
      amount:this.fb.control(0),
      accountDestination:this.fb.control(null)

    })
  }

  handleSearchAccount() {
    let accountId = this.accountFormGroup.value.accountId;
    this.account$=this.accountService.getAccounts(accountId,this.currentPage,this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }


  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType: string = this.operationFormGroup.value.operationType;
    let amount: number = this.operationFormGroup.value.amount;
    let accountDestination: string = this.operationFormGroup.value.accountDestination;
    console.log('Operation Type:', operationType); // Add this line

    if (operationType == "DEBIT") {
      this.accountService.debit(accountId, amount).subscribe({
        next: (res) => {
          alert("Debit operation successful");
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType == "CREDIT") {
      this.accountService.credit(accountId, amount).subscribe({
        next: (res) => {
          alert("Credit operation successful");
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType == "TRANSFER") {
      this.accountService.transfer(accountId, accountDestination, amount).subscribe({
        next: (res) => {
          alert("Transfer operation successful");
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }


  protected readonly async = async;
}
