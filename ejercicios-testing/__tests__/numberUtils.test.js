const { factorial, isPrime, clamp } = require('../src/numberUtils');

describe('numberUtils', () => {

  describe('factorial()', () => {

    it('calcula correctamente el factorial de un número', () => {

      expect(factorial(5)).toBe(120);

    });

    it('devuelve 1 cuando n es 0', () => {

      expect(factorial(0)).toBe(1);

    });

    it('lanza error si el número es negativo', () => {

      expect(() => factorial(-2)).toThrow(RangeError);

    });

    it('lanza TypeError si recibe decimal', () => {

      expect(() => factorial(3.5)).toThrow(TypeError);

    });

  });


  describe('isPrime()', () => {

    it('devuelve true para un número primo', () => {

      expect(isPrime(13)).toBe(true);

    });

    it('devuelve false para un número no primo', () => {

      expect(isPrime(10)).toBe(false);

    });

    it('devuelve false para 0 y 1', () => {

      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);

    });

    it('devuelve false para números negativos', () => {

      expect(isPrime(-7)).toBe(false);

    });

  });


  describe('clamp()', () => {

    it('devuelve el mismo valor si está dentro del rango', () => {

      expect(clamp(5, 1, 10)).toBe(5);

    });

    it('devuelve min si el valor es menor', () => {

      expect(clamp(-3, 1, 10)).toBe(1);

    });

    it('devuelve max si el valor es mayor', () => {

      expect(clamp(50, 1, 10)).toBe(10);

    });

    it('funciona cuando min y max son iguales', () => {

      expect(clamp(7, 7, 7)).toBe(7);

    });

    it('lanza error si min es mayor que max', () => {

      expect(() => clamp(5, 10, 1)).toThrow(RangeError);

    });

  });

});