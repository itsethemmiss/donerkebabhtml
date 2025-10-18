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

  // Converts a tag name into Doner-Kebab Morse
  function toDonerKebab(tagName) {
    return tagName.split("").map(ch => {
      const up = ch.toUpperCase();
      if (MORSE[up]) {
        return MORSE[up].split("").map(s => s === "." ? DOT : DASH).join("");
      }
      return ch;
    }).join("");
  }

  // Standard HTML tags to auto-map
  const htmlTags = [
    "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button",
    "canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div",
    "dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head",
    "header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark",
    "meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress",
    "q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary",
    "sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"
  ];

  // Build mapping: Doner-Kebab tag -> real tag
  const tagMap = {};
  htmlTags.forEach(tag => {
    tagMap[toDonerKebab(tag)] = tag;
  });

  function convertNode(node) {
    if (node.nodeType === Node.TEXT_NODE) return; // leave text alone

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      // If it's a mapped Doner-Kebab tag, replace with real tag
      if (tagMap[tagName]) {
        const realTag = tagMap[tagName];
        const newEl = document.createElement(realTag);

        // Copy attributes
        for (let attr of node.attributes) {
          newEl.setAttribute(attr.name, attr.value);
        }

        // Move children
        while (node.firstChild) {
          newEl.appendChild(node.firstChild);
        }

        node.parentNode.replaceChild(newEl, node);
        node = newEl; // continue processing children on new element
      }

      // Recurse on children
      Array.from(node.children).forEach(child => convertNode(child));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector("donerkebabcode");
    if (!wrapper) return;

    Array.from(wrapper.children).forEach(child => convertNode(child));
  });
})();
