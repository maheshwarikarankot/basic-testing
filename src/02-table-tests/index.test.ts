import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Subtract, expected: 0 },
    { a: 3, b: 2, action: Action.Multiply, expected: 6 },
    { a: 4, b: 2, action: Action.Divide, expected: 2 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
    { a: 2, b: 3, action: 'invalid', expected: null },
    { a: 'invalid', b: 'invalid', action: Action.Add, expected: null },
    { a: NaN, b: 3, action: Action.Add, expected: NaN },
]; 

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should calculate $a $action $b', ({ a, b, action, expected }) => {
    const result = simpleCalculator({ a, b, action });

    if (Number.isNaN(expected)) {
      expect(result).toBeNaN();
    } else {
      expect(result).toBe(expected);
    } 
  });
  
});
