import { random } from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const mockedRandom = random as jest.MockedFunction<typeof random>;

describe('BankAccount', () => {
  let account: ReturnType<typeof getBankAccount>;
  const balance = 100;

  beforeEach(() => {
    account = getBankAccount(balance);
  });

  afterEach(() => {
    mockedRandom.mockReset();
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const wihtdrawAmount = balance + 20;
    expect(() => account.withdraw(wihtdrawAmount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const toAccount = getBankAccount(20);
    const transferAmount = balance + 40;

    expect(() => account.transfer(transferAmount, toAccount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const transferAmount = 50;
    expect(() => account.transfer(transferAmount, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const depositAmount = 50;
    const expectedBalance = balance + depositAmount;
    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(expectedBalance);
  });

  test('should withdraw money', () => {
    const withdrawAmount = 40;
    const expectedBalance = balance - withdrawAmount;
    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(expectedBalance);
  });

  test('should transfer money', () => {
    const toAccount = getBankAccount(20);
    const transferAmount = 30;
    const expectedBalance = balance - transferAmount;
    const expectedToAccountBalance = 20 + transferAmount;

    account.transfer(transferAmount, toAccount);

    expect(account.getBalance()).toBe(expectedBalance);
    expect(toAccount.getBalance()).toBe(expectedToAccountBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const mockedBalance = 42;
    mockedRandom
      .mockReturnValueOnce(mockedBalance)
      .mockReturnValueOnce(1);

    const result = await account.fetchBalance();

    expect(result).toBe(mockedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
  jest.spyOn(account, 'fetchBalance')
      .mockResolvedValue(77);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(77);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance')
      .mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
