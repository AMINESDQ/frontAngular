export interface AccountDetails {
  accountID: string
  balance: number
  currrentPage: number
  totalPages: number
  pageSize: number
  bankOperationDtos: AccountOperation[]
}
export interface AccountOperation {
  id: number
  dateOperation: string
  amount: number
  typpeOperation: string
  description: string
}
