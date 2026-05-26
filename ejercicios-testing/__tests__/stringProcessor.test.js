const {
  maskEmail,
  reverseWords,
  extractHashtags
} = require('../src/stringProcessor');

describe('stringProcessor', () => {

  describe('maskEmail()', () => {

    it('oculta correctamente el usuario del email', () => {

      expect(maskEmail('sergio@gmail.com'))
        .toBe('s****o@gmail.com');

    });

    it('devuelve el mismo email si el usuario tiene un carácter', () => {

      expect(maskEmail('a@gmail.com'))
        .toBe('a@gmail.com');

    });

    it('lanza error si el email no tiene @', () => {

      expect(() => maskEmail('correo-invalido'))
        .toThrow(Error);

    });

  });


  describe('reverseWords()', () => {

    it('invierte el orden de las palabras', () => {

      expect(reverseWords('hola mundo node'))
        .toBe('node mundo hola');

    });

    it('maneja espacios múltiples', () => {

      expect(reverseWords('  hola    mundo   '))
        .toBe('mundo hola');

    });

    it('devuelve vacío si el texto está vacío', () => {

      expect(reverseWords('')).toBe('');
      expect(reverseWords('     ')).toBe('');

    });

    it('funciona con una sola palabra', () => {

      expect(reverseWords('javascript'))
        .toBe('javascript');

    });

  });


  describe('extractHashtags()', () => {

    it('extrae múltiples hashtags', () => {

      expect(
        extractHashtags('Me gusta #node y #testing')
      ).toEqual(['#node', '#testing']);

    });

    it('devuelve array vacío si no hay hashtags', () => {

      expect(extractHashtags('hola mundo'))
        .toEqual([]);

    });

    it('ignora # solo sin texto', () => {

      expect(extractHashtags('hola #'))
        .toEqual([]);

    });

  });

});