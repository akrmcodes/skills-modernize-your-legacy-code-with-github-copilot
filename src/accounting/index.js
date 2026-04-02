const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const INITIAL_BALANCE = 1000.0;

function createAccountState(initialBalance = INITIAL_BALANCE) {
  return {
    balance: initialBalance,
  };
}

function formatBalance(value) {
  return value.toFixed(2).padStart(9, '0');
}

function renderMenu() {
  return [
    '--------------------------------',
    'Account Management System',
    '1. View Balance',
    '2. Credit Account',
    '3. Debit Account',
    '4. Exit',
    '--------------------------------',
  ].join('\n');
}

function getBalanceMessage(state) {
  return `Current balance: ${formatBalance(state.balance)}`;
}

function normalizeAmount(rawValue) {
  const amount = Number(String(rawValue).trim());

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function creditAccount(state, amount) {
  state.balance += amount;
  return `Amount credited. New balance: ${formatBalance(state.balance)}`;
}

function debitAccount(state, amount) {
  if (state.balance >= amount) {
    state.balance -= amount;
    return `Amount debited. New balance: ${formatBalance(state.balance)}`;
  }

  return 'Insufficient funds for this debit.';
}

function validateMenuChoice(choice) {
  return ['1', '2', '3', '4'].includes(choice);
}

async function promptChoice(rl) {
  try {
    const input = await rl.question('Enter your choice (1-4): ');
    return input.trim();
  } catch (error) {
    if (error && (error.code === 'ERR_USE_AFTER_CLOSE' || error.code === 'ERR_STREAM_DESTROYED')) {
      return null;
    }

    throw error;
  }
}

async function promptAmount(rl, label) {
  try {
    const rawValue = await rl.question(label);
    return normalizeAmount(rawValue);
  } catch (error) {
    if (error && (error.code === 'ERR_USE_AFTER_CLOSE' || error.code === 'ERR_STREAM_DESTROYED')) {
      return null;
    }

    throw error;
  }
}

async function handleCredit(rl, state) {
  const amount = await promptAmount(rl, 'Enter credit amount: ');

  if (amount === null) {
    return 'Invalid amount. Please enter a positive number.';
  }

  return creditAccount(state, amount);
}

async function handleDebit(rl, state) {
  const amount = await promptAmount(rl, 'Enter debit amount: ');

  if (amount === null) {
    return 'Invalid amount. Please enter a positive number.';
  }

  return debitAccount(state, amount);
}

async function runAccountingApp({ input = stdin, output = stdout } = {}) {
  const rl = readline.createInterface({ input, output });
  const state = createAccountState();
  let continueFlag = true;
  const messages = [];

  try {
    while (continueFlag) {
      const menu = renderMenu();
      console.log(menu);
      messages.push(menu);

      const choice = await promptChoice(rl);

      if (choice === null) {
        break;
      }

      if (!validateMenuChoice(choice)) {
        const invalidChoiceMessage = 'Invalid choice, please select 1-4.';
        console.log(invalidChoiceMessage);
        messages.push(invalidChoiceMessage);
        continue;
      }

      switch (choice) {
        case '1': {
          const message = getBalanceMessage(state);
          console.log(message);
          messages.push(message);
          break;
        }
        case '2': {
          const message = await handleCredit(rl, state);
          console.log(message);
          messages.push(message);
          break;
        }
        case '3': {
          const message = await handleDebit(rl, state);
          console.log(message);
          messages.push(message);
          break;
        }
        case '4':
          continueFlag = false;
          break;
        default:
          break;
      }
    }

    const goodbyeMessage = 'Exiting the program. Goodbye!';
    console.log(goodbyeMessage);
    messages.push(goodbyeMessage);
  } finally {
    rl.close();
  }

  return {
    balance: state.balance,
    messages,
  };
}

if (require.main === module) {
  runAccountingApp().catch((error) => {
    console.error('Unexpected application error:', error);
    process.exitCode = 1;
  });
}

module.exports = {
  INITIAL_BALANCE,
  createAccountState,
  formatBalance,
  renderMenu,
  getBalanceMessage,
  normalizeAmount,
  creditAccount,
  debitAccount,
  validateMenuChoice,
  runAccountingApp,
};
