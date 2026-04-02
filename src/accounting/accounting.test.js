const test = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');

const {
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
} = require('./index');

function createInputStream(lines) {
  const input = new PassThrough();

  process.nextTick(() => {
    for (const line of lines) {
      input.write(`${line}\n`);
    }
    input.end();
  });

  return input;
}

test('TP-001: render the main menu on application start', () => {
  const menu = renderMenu();

  assert.match(menu, /Account Management System/);
  assert.match(menu, /1\. View Balance/);
  assert.match(menu, /2\. Credit Account/);
  assert.match(menu, /3\. Debit Account/);
  assert.match(menu, /4\. Exit/);
});

test('TP-002: view the current balance without changing it', () => {
  const state = createAccountState();

  assert.equal(getBalanceMessage(state), `Current balance: ${formatBalance(INITIAL_BALANCE)}`);
  assert.equal(state.balance, INITIAL_BALANCE);
});

test('TP-003: credit an account with a valid amount', () => {
  const state = createAccountState();

  const message = creditAccount(state, 700);

  assert.equal(state.balance, 1700);
  assert.equal(message, 'Amount credited. New balance: 001700.00');
});

test('TP-004: debit an account when sufficient funds are available', () => {
  const state = createAccountState();

  const message = debitAccount(state, 250);

  assert.equal(state.balance, 750);
  assert.equal(message, 'Amount debited. New balance: 000750.00');
});

test('TP-005: prevent debit when funds are insufficient', () => {
  const state = createAccountState();

  const message = debitAccount(state, 2000);

  assert.equal(state.balance, INITIAL_BALANCE);
  assert.equal(message, 'Insufficient funds for this debit.');
});

test('TP-006: reject invalid menu input', () => {
  assert.equal(validateMenuChoice('0'), false);
  assert.equal(validateMenuChoice('5'), false);
  assert.equal(validateMenuChoice('abc'), false);
  assert.equal(validateMenuChoice('1'), true);
});

test('TP-007: exit the application from the main menu', async () => {
  const result = await runAccountingApp({
    input: createInputStream(['4']),
    output: new PassThrough(),
  });

  assert.equal(result.balance, INITIAL_BALANCE);
  assert.ok(result.messages.includes('Exiting the program. Goodbye!'));
});

test('TP-008: preserve the balance after a view operation', async () => {
  const state = createAccountState();

  assert.equal(getBalanceMessage(state), `Current balance: ${formatBalance(INITIAL_BALANCE)}`);
  assert.equal(state.balance, INITIAL_BALANCE);
});

test('TP-009: preserve the balance after a failed debit attempt', () => {
  const state = createAccountState();

  const debitMessage = debitAccount(state, 2000);
  const balanceMessage = getBalanceMessage(state);

  assert.equal(debitMessage, 'Insufficient funds for this debit.');
  assert.equal(balanceMessage, `Current balance: ${formatBalance(INITIAL_BALANCE)}`);
  assert.equal(state.balance, INITIAL_BALANCE);
});

test('TP-010: update persistence after a successful credit or debit', () => {
  const state = createAccountState();

  const creditMessage = creditAccount(state, 700);
  const balanceMessage = getBalanceMessage(state);

  assert.equal(creditMessage, 'Amount credited. New balance: 001700.00');
  assert.equal(balanceMessage, 'Current balance: 001700.00');
  assert.equal(state.balance, 1700);
});

test('normalizeAmount rejects empty or non-positive input', () => {
  assert.equal(normalizeAmount(''), null);
  assert.equal(normalizeAmount('abc'), null);
  assert.equal(normalizeAmount('0'), null);
  assert.equal(normalizeAmount('-10'), null);
  assert.equal(normalizeAmount('700'), 700);
});