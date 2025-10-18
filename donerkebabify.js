/* doner-kebab-html-encoder.js
   Encodes every tag name and text content into Doner-Kebab Morse.
   Dot -> kebab
   Dash -> doner
   Space -> space
   Numbers and special characters unchanged.
*/

(function() {
  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
    F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
    P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.."
  };

  const DOT = "kebab";
  const DASH = "doner";

  function toDonerKebabMorse(text) {
    return text.split("").map(ch => {
      if (ch === " ") return " ";
      const upper = ch.toUpperCase();
      if (MORSE[upper]) {
        return MORSE[upper].split("").map(s => s === "." ? DOT : DASH).join("");
      }
      return ch; // keep special chars/numbers
    }).join("");
  }

  function convertHTMLToDonerKebab(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return toDonerKebabMorse(node.textContent);
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = toDonerKebabMorse(node.tagName.toLowerCase());
        let inner = "";
        node.childNodes.forEach(child => {
          inner += processNode(child);
        });
        return `<doner${tagName}>${inner}</doner${tagName}>`;
      }
      return "";
    }

    let result = "<donerkebabcode>";
    doc.body.childNodes.forEach(n => {
      result += processNode(n);
    });
    result += "</donerkebabcode>";
    return result;
  }

  // Expose function globally
  window.donerKebabEncode = convertHTMLToDonerKebab;

  // Example: if you want to test
  // console.log(donerKebabEncode('<h1>Hello</h1><p>This is HTML!</p>'));
})();
