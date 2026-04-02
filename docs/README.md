# Modernize your legacy code with GitHub Copilot

<img src="https://octodex.github.com/images/Professortocat_v2.png" align="right" height="200px" />

Hey akrmcodes!

Mona here. I'm done preparing your exercise. Hope you enjoy! 💚

Remember, it's self-paced so feel free to take a break! ☕️

[![](https://img.shields.io/badge/Go%20to%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/akrmcodes/skills-modernize-your-legacy-code-with-github-copilot/issues/1)

---

&copy; 2025 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

## COBOL Application Overview

This exercise contains a small COBOL account-management app. The current implementation models a balance that can be viewed, credited, or debited. If you treat the balance as a student account, the same flow applies to student deposits, spending, and balance checks.

### File Responsibilities

`src/cobol/main.cob`
`MainProgram` is the entry point. It displays the menu, collects the user's choice, and dispatches to the operations program.

`src/cobol/operations.cob`
`Operations` holds the action logic. It handles view, credit, and debit requests, prompts for amounts when needed, and coordinates with the data program to read or update the balance.

`src/cobol/data.cob`
`DataProgram` acts as the persistence layer. It stores the balance in working storage and responds to `READ` and `WRITE` requests from `Operations`.

### Key Program Flow

1. The user starts the application in `MainProgram`.
2. `MainProgram` shows the menu and accepts a choice from 1 to 4.
3. Option 1 routes to `Operations` to read and display the current balance.
4. Option 2 routes to `Operations`, which accepts a credit amount, reads the current balance, adds the amount, and writes the updated value back.
5. Option 3 routes to `Operations`, which accepts a debit amount, reads the current balance, and subtracts the amount only when sufficient funds are available.
6. Option 4 exits the application.

### Business Rules For Student Accounts

- The starting balance is `1000.00`.
- Viewing the balance does not change the account.
- Credit operations increase the balance by the entered amount.
- Debit operations decrease the balance only if the account has enough funds.
- If funds are insufficient, the debit is rejected and the balance remains unchanged.
- Invalid menu selections are rejected and the menu is shown again.
- Exiting the app stops the menu loop and ends the session.

## App Data Flow

```mermaid
sequenceDiagram
	actor User
	participant Main as MainProgram
	participant Ops as Operations
	participant Data as DataProgram
	participant Storage as Stored Balance

	User->>Main: Start app
	loop Until Exit selected
		Main->>User: Show menu
		User->>Main: Choose 1, 2, 3, or 4

		alt View Balance
			Main->>Ops: CALL Operations("TOTAL")
			Ops->>Data: CALL DataProgram("READ", balance)
			Data->>Storage: Load current balance
			Storage-->>Data: Balance value
			Data-->>Ops: balance
			Ops-->>Main: Display current balance
		else Credit Account
			Main->>Ops: CALL Operations("CREDIT")
			Ops->>User: Prompt for credit amount
			User->>Ops: Enter amount
			Ops->>Data: CALL DataProgram("READ", balance)
			Data->>Storage: Load current balance
			Storage-->>Data: Balance value
			Data-->>Ops: balance
			Ops->>Ops: Add amount to balance
			Ops->>Data: CALL DataProgram("WRITE", new balance)
			Data->>Storage: Save updated balance
			Ops-->>Main: Display new balance
		else Debit Account
			Main->>Ops: CALL Operations("DEBIT")
			Ops->>User: Prompt for debit amount
			User->>Ops: Enter amount
			Ops->>Data: CALL DataProgram("READ", balance)
			Data->>Storage: Load current balance
			Storage-->>Data: Balance value
			Data-->>Ops: balance
			alt Sufficient funds
				Ops->>Ops: Subtract amount from balance
				Ops->>Data: CALL DataProgram("WRITE", new balance)
				Data->>Storage: Save updated balance
				Ops-->>Main: Display new balance
			else Insufficient funds
				Ops-->>Main: Display error message
			end
		else Exit
			Main->>Main: Set continue flag to NO
		end
	end
	Main-->>User: Goodbye message
```

