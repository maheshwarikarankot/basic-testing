import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 3, action: Action.Add });
    expect(result).toBe(5);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 10, b: 4, action: Action.Subtract });
    expect(result).toBe(6);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 6, b: 7, action: Action.Multiply });
    expect(result).toBe(42);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 20, b: 5, action: Action.Divide });
    expect(result).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 5, action: Action.Exponentiate });
    expect(result).toBe(32);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 2, b: 3, action: '%' });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({ a: '2', b: 3, action: Action.Add });
    expect(result).toBeNull();
  });
});
