
 /* donerkebabify.js
   Convert Doner-Kebab Morse tag names inside <donerkebabcode> 
   into real DOM elements. Supports standard HTML tags, inline/external
   <script> (executes), <style>, iframe, and leaves unknown custom tags alone.
*/

(function () {
  'use strict';

  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".",
    F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", O: "---",
    P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.."
  };
  const DOT = "kebab";
  const DASH = "doner";

  // Standard HTML tags list (common set)
  const HTML_TAGS = [
    "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button",
    "canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div",
    "dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head",
    "header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark",
    "meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress",
    "q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary",
    "sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"
  ];

  // encode a tag name into Doner-Kebab Morse form (no separators)
  function encodeToDonerKebab(tagName) {
    return tagName.split('').map(ch => {
      const up = ch.toUpperCase();
      if (MORSE[up]) {
        return MORSE[up].split('').map(t => t === '.' ? DOT : DASH).join('');
      }
      // numbers/special stay as-is in tag name (rare)
      return ch;
    }).join('');
  }

  // Build reverse map: dkEncoded -> realTag
  const dkToReal = Object.create(null);
  HTML_TAGS.forEach(tag => {
    dkToReal[ encodeToDonerKebab(tag) ] = tag;
  });

  // Utility: copy attributes from one element to another
  function copyAttributes(from, to) {
    Array.from(from.attributes || []).forEach(attr => {
      // Avoid copying attributes like 'id' if you wish; currently we copy all
      try { to.setAttribute(attr.name, attr.value); } catch (e) {}
    });
  }

  // Replace a DK element node with a real element according to dkToReal mapping.
  // Special handling for script/style so they execute/apply.
  function replaceDKElement(el, realTag) {
    if (!realTag) return el;

    if (realTag === 'script') {
      // Create a new script element that will execute.
      const newScript = document.createElement('script');
      // copy attributes (src, type, async, defer, etc.)
      copyAttributes(el, newScript);

      // If it's an external script (has src), we just append it and it will load/execute.
      // For inline script, use textContent to ensure it executes.
      const inline = el.innerHTML;
      if (inline && (!el.hasAttribute('src'))) {
        // Preserve original whitespace exactly as textContent
        newScript.text = inline;
      }
      el.parentNode.replaceChild(newScript, el);
      return newScript;
    }

    if (realTag === 'style') {
      const newStyle = document.createElement('style');
      copyAttributes(el, newStyle);
      // inner text becomes CSS rules
      newStyle.textContent = el.textContent || '';
      el.parentNode.replaceChild(newStyle, el);
      return newStyle;
    }

    // Generic elements (including iframe, img, input, etc.)
    const newEl = document.createElement(realTag);
    copyAttributes(el, newEl);

    // Move children over (text nodes and element nodes). For some replaced elements
    // like <img> or <input> there won't be children; that's fine.
    while (el.firstChild) {
      newEl.appendChild(el.firstChild);
    }

    el.parentNode.replaceChild(newEl, el);
    return newEl;
  }

  // Walk and convert children of a parent element (non-destructive traversal)
  function convertChildren(root) {
    // Use a static array copy to avoid issues while replacing nodes
    const children = Array.from(root.children);
    for (const child of children) {
      // tagName of custom dk tags will be lowercase already (DOM)
      const tag = (child.tagName || '').toLowerCase();

      // Skip the wrapper itself if it accidentally appears here
      if (tag === 'donerkebabcode') {
        // Recurse inside its children instead of replacing the wrapper
        convertChildren(child);
        continue;
      }

      // If tag matches a Doner-Kebab encoded form in our map, replace it
      if (dkToReal[tag]) {
        const realTag = dkToReal[tag];
        const replaced = replaceDKElement(child, realTag);
        // Continue recursion inside the new element (it may contain nested DK tags)
        convertChildren(replaced);
      } else {
        // Tag is not a DK-encoded standard tag -> leave it as a custom tag.
        // But still descend so nested things can be converted.
        convertChildren(child);
      }
    }
  }

  // Main runner: find <donerkebabcode> wrappers and convert their interior
  function runDonerKebabify() {
    const wrappers = document.querySelectorAll('donerkebabcode');
    if (!wrappers || wrappers.length === 0) return;

    wrappers.forEach(wrapper => {
      // Convert children recursively
      convertChildren(wrapper);
    });
  }

  // Run once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDonerKebabify, { once: true });
  } else {
    runDonerKebabify();
  }

  // Expose small API if someone wants to re-run or inspect
  window.donerkebabify = {
    encodeToDonerKebab,
    dkToRealMap: dkToReal,
    run: runDonerKebabify
  };

})();

  
