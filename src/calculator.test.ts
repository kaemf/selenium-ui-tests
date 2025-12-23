import { Calculator, isPrime, factorial } from './calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
    });

    test('should add positive and negative numbers', () => {
      expect(calculator.add(10, -5)).toBe(5);
    });

    test('should return the same number when adding zero', () => {
      expect(calculator.add(42, 0)).toBe(42);
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers', () => {
      expect(calculator.subtract(10, 3)).toBe(7);
    });

    test('should subtract negative numbers', () => {
      expect(calculator.subtract(-5, -3)).toBe(-2);
    });

    test('should handle subtraction resulting in negative', () => {
      expect(calculator.subtract(3, 10)).toBe(-7);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(calculator.multiply(4, 5)).toBe(20);
    });

    test('should multiply by zero', () => {
      expect(calculator.multiply(42, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    test('should multiply positive and negative', () => {
      expect(calculator.multiply(5, -3)).toBe(-15);
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    test('should divide negative numbers', () => {
      expect(calculator.divide(-10, -2)).toBe(5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero is not allowed');
    });

    test('should handle decimal results', () => {
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333, 2);
    });
  });

  describe('percentage', () => {
    test('should calculate percentage correctly', () => {
      expect(calculator.percentage(200, 10)).toBe(20);
    });

    test('should handle zero percentage', () => {
      expect(calculator.percentage(100, 0)).toBe(0);
    });

    test('should handle 100 percent', () => {
      expect(calculator.percentage(50, 100)).toBe(50);
    });
  });

  describe('power', () => {
    test('should calculate power correctly', () => {
      expect(calculator.power(2, 3)).toBe(8);
    });

    test('should handle power of zero', () => {
      expect(calculator.power(5, 0)).toBe(1);
    });

    test('should handle negative exponent', () => {
      expect(calculator.power(2, -2)).toBe(0.25);
    });
  });
});

describe('isPrime', () => {
  test('should return false for numbers less than 2', () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(-5)).toBe(false);
  });

  test('should return true for prime numbers', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(11)).toBe(true);
    expect(isPrime(13)).toBe(true);
  });

  test('should return false for composite numbers', () => {
    expect(isPrime(4)).toBe(false);
    expect(isPrime(6)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPrime(15)).toBe(false);
  });

  test('should handle larger prime numbers', () => {
    expect(isPrime(97)).toBe(true);
    expect(isPrime(101)).toBe(true);
  });
});

describe('factorial', () => {
  test('should calculate factorial for positive numbers', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(6)).toBe(720);
  });

  test('should throw error for negative numbers', () => {
    expect(() => factorial(-1)).toThrow('Factorial is not defined for negative numbers');
  });

  test('should handle edge cases', () => {
    expect(factorial(10)).toBe(3628800);
  });
});

