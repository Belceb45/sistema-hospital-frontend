
  export function validarCurp(curp: string): boolean {

    const re: RegExp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
    const validado: RegExpMatchArray | null = curp.match(re);

    if (!validado) {
      return false;
    }
    function digitoVerificador(curp17: string): number {
      const diccionario: string = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
      let lngSuma: number = 0.0;
      let lngDigito: number = 0.0;
      //17 caracteres CURP
      for (let index = 0; index < 17; index++)
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(index)) * (18 - index);

      lngDigito = 10 - (lngSuma % 10);
      return lngDigito === 10 ? 0 : lngDigito;

    }
    //comparacion estricta de tipos !==
    if (parseInt(validado[2], 10) !== digitoVerificador(validado[1]))
      return false;
    return true;
  }

  export function validarRFC(rfc: string, aceptarGenerico: boolean = true): string | false {
  rfc = rfc.toUpperCase().replace(/\s+/g, '');

  const re = /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([0-9A-Z])$/;
  const match = rfc.match(re);

  if (!match) return false;

  const [_, rfcBase, anio, mes, dia, homoclave, digitoVerificador] = match;
  const rfcSinDigito = rfcBase + anio + mes + dia + homoclave;
  const len = rfcSinDigito.length;

  // DICCIONARIO CORRECTO
  const diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZÑ";

  const indice = len + 1;
  let suma = len === 12 ? 0 : 481;

  for (let i = 0; i < len; i++) {
    suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
  }

  let digitoEsperado: number | string = 11 - (suma % 11);
  if (digitoEsperado === 11) digitoEsperado = 0;
  else if (digitoEsperado === 10) digitoEsperado = "A";

  const rfcCompleto = rfcSinDigito + digitoVerificador;

  if ((digitoVerificador !== digitoEsperado.toString()) &&
    (!aceptarGenerico || rfcCompleto !== "XAXX010101000")) return false;

  if (!aceptarGenerico && rfcCompleto === "XEXX010101000") return false;

  return rfc;
}
