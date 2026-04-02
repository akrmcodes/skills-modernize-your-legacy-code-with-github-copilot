# COBOL Application Test Plan

This test plan covers the current business logic and implementation of the COBOL account management application. It is intended to support stakeholder validation now and later conversion into unit and integration tests in a Node.js application.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TP-001 | Display the main menu on application start | Application is compiled and ready to run | 1. Launch the application. 2. Observe the first screen. | The application displays the account management menu with options 1 through 4 and prompts for input. | TBD | Not Run | Verifies the entry point and user-facing menu. |
| TP-002 | View the current balance from the main menu | Application is running and initial balance is available | 1. Start the application. 2. Enter `1`. | The application displays the current balance without changing it. The initial value is `1000.00`. | TBD | Not Run | Confirms read-only balance lookup. |
| TP-003 | Credit an account with a valid amount | Application is running with a known current balance | 1. Start the application. 2. Enter `2`. 3. Enter a credit amount such as `700`. | The application adds the entered amount to the balance and displays the updated balance. For an initial balance of `1000.00`, the new balance becomes `1700.00`. | TBD | Not Run | Confirms credit flow and update path. |
| TP-004 | Debit an account when sufficient funds are available | Application is running with a balance greater than or equal to the debit amount | 1. Start the application. 2. Enter `3`. 3. Enter a debit amount such as `250`. | The application subtracts the amount from the balance and displays the new balance. | TBD | Not Run | Confirms debit success path. |
| TP-005 | Prevent debit when funds are insufficient | Application is running with a balance lower than the debit amount | 1. Start the application. 2. Enter `3`. 3. Enter a debit amount greater than the available balance. | The application displays an insufficient funds message and does not change the balance. | TBD | Not Run | Confirms overdraft protection. |
| TP-006 | Reject invalid menu input | Application is running at the main menu | 1. Start the application. 2. Enter an invalid choice such as `0`, `5`, or a non-supported value. | The application displays an invalid choice message and returns to the menu without changing the balance. | TBD | Not Run | Confirms menu validation. |
| TP-007 | Exit the application from the main menu | Application is running at the main menu | 1. Start the application. 2. Enter `4`. | The application exits the loop and displays the goodbye message. | TBD | Not Run | Confirms graceful termination. |
| TP-008 | Preserve the balance after a view operation | Application has a known current balance | 1. Start the application. 2. Enter `1`. 3. Enter `1` again. | The same balance value is shown both times and no state change occurs. | TBD | Not Run | Verifies that balance lookup does not mutate state. |
| TP-009 | Preserve the balance after a failed debit attempt | Application has a known current balance | 1. Start the application. 2. Enter `3`. 3. Enter a debit amount greater than the balance. 4. Choose `1` to view the balance. | The balance shown after the failed debit is unchanged from the pre-condition value. | TBD | Not Run | Verifies no partial update occurs on rejection. |
| TP-010 | Update persistence after a successful credit or debit | Application has a known current balance | 1. Perform a successful credit or debit. 2. Return to the main menu. 3. View the balance again. | The balance displayed after returning to the menu reflects the previously committed update. | TBD | Not Run | Confirms read-after-write behavior through the data program. |

## Notes For Future Node.js Testing

- `MainProgram` behavior maps cleanly to an input-driven CLI controller test.
- `Operations` behavior maps to business-logic unit tests for view, credit, and debit cases.
- `DataProgram` behavior maps to persistence tests for read and write requests.
- The current implementation initializes the balance in working storage at `1000.00`, so test setup should account for the starting state or stub the storage layer in later Node.js tests.