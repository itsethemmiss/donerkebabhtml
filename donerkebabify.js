/* donerkebabify.js
   Robust Doner-Kebab converter inside <donerkebabcode>.
   - Encoded tag names (Doner-Kebab Morse) -> real HTML elements
   - Inline and external <script> will execute reliably (module/async/defer preserved)
   - <style> tags apply
   - <source> (encoded) is supported for audio/video/img and will be converted
   - Preserves attributes (src, type, async, defer, controls, etc.)
   - Leaves unknown/custom tags untouched but still descends into them
   - Exposes window.donerkebabify.run() and debug flag
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

  // Standard HTML tag list (common set)
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
      return ch;
    }).join('');
  }

  // build reverse map (encodedName -> real tag)
  const dkToReal = Object.create(null);
  HTML_TAGS.forEach(tag => {
    dkToReal[ encodeToDonerKebab(tag) ] = tag;
  });

  // debug flag
  let DEBUG = false;
  function log(...args) { if (DEBUG) console.log('[donerkebabify]', ...args); }

  // copy attributes safely
  function copyAttributes(fromEl, toEl) {
    Array.from(fromEl.attributes || []).forEach(attr => {
      try { toEl.setAttribute(attr.name, attr.value); } catch (e) { /* ignore */ }
    });
  }

  // Create and insert a style element that will apply immediately
  function createStyleFrom(el) {
    const styleEl = document.createElement('style');
    copyAttributes(el, styleEl);
    // preserve text exactly
    styleEl.textContent = el.textContent || '';
    return styleEl;
  }

  // Create and insert a script element that will execute reliably
  function createScriptFrom(el) {
    const newScript = document.createElement('script');
    copyAttributes(el, newScript);

    const hasSrc = el.hasAttribute('src');
    const type = newScript.getAttribute('type') || '';
    // For inline scripts: set textContent
    if (!hasSrc) {
      // module inline will execute when appended
      newScript.textContent = el.textContent || '';
    }
    return { newScript, hasSrc, type };
  }

  // Create a source element from encoded element
  function createSourceFrom(el) {
    const srcEl = document.createElement('source');
    copyAttributes(el, srcEl);
    return srcEl;
  }

  // Generic element creation
  function createElementFrom(el, realTag) {
    const newEl = document.createElement(realTag);
    copyAttributes(el, newEl);

    // move children (they may be encoded and will be converted later)
    while (el.firstChild) {
      newEl.appendChild(el.firstChild);
    }
    return newEl;
  }

  // Replace one DK node with a real element, keeping order and ensuring scripts/styles run/apply.
  function replaceDKElement(el, realTag) {
    if (!realTag) return el;

    // STYLE
    if (realTag === 'style') {
      const styleNode = createStyleFrom(el);
      el.parentNode.replaceChild(styleNode, el);
      log('style replaced');
      return styleNode;
    }

    // SCRIPT
    if (realTag === 'script') {
      const { newScript, hasSrc } = createScriptFrom(el);
      // Insert the script in-place to preserve order and execution timing
      el.parentNode.insertBefore(newScript, el);
      el.parentNode.removeChild(el);
      log('script inserted', hasSrc ? ('src=' + newScript.getAttribute('src')) : 'inline');
      return newScript;
    }

    // SOURCE
    if (realTag === 'source') {
      // Create real <source> and replace
      const srcNode = createSourceFrom(el);
      el.parentNode.replaceChild(srcNode, el);
      log('source replaced (for media)');
      return srcNode;
    }

    // Generic element (audio/video/img/div/p/etc)
    const newEl = createElementFrom(el, realTag);
    el.parentNode.replaceChild(newEl, el);
    log('generic replaced', el.tagName, '=>', realTag);
    return newEl;
  }

  // Convert children of root. This function tries to preserve authoring order:
  // it iterates over childNodes (not only elements) to keep placement accurate.
  function convertChildren(root) {
    // We will iterate using a manual index over a live children list to preserve order when inserting/removing.
    let i = 0;
    while (i < root.childNodes.length) {
      const node = root.childNodes[i];

      // If element node, check for DK encoding
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node.tagName || '').toLowerCase();

        // If wrapper encountered, recurse inside but DO NOT replace wrapper
        if (tag === 'donerkebabcode') {
          // move into wrapper's children
          convertChildren(node);
          i++; // move to next sibling
          continue;
        }

        // If this element is a Doner-Kebab encoded form of a standard tag, replace it
        if (dkToReal[tag]) {
          const realTag = dkToReal[tag];

          // Replace now, preserving index: replacement will occupy the same index
          const replaced = replaceDKElement(node, realTag);

          // After replacement, recurse into the replaced element so nested DK tags convert.
          convertChildren(replaced);

          // don't increment i because childNodes length may have changed but we want to continue after replaced
          i++; 
          continue;
        } else {
          // Not a recognized DK tag (custom tag). Recurse into it (its children may contain DK tags)
          convertChildren(node);
          i++;
          continue;
        }
      } else {
        // Not an element (text/comment). Just skip
        i++;
        continue;
      }
    }
  }

  // Top-level runner
  function runDonerKebabify() {
    const wrappers = document.querySelectorAll('donerkebabcode');
    if (!wrappers || wrappers.length === 0) {
      log('No <donerkebabcode> wrappers found.');
      return;
    }

    // Process wrappers in document order
    wrappers.forEach(wrapper => {
      convertChildren(wrapper);
    });

    log('donerkebabify: conversion complete');
  }

  // Auto-run on DOMContentLoaded
  function autoRun() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runDonerKebabify, { once: true });
    } else {
      runDonerKebabify();
    }
  }

  // Expose API
  window.donerkebabify = {
    run: runDonerKebabify,
    encodeToDonerKebab,
    map: dkToReal,
    set debug(v) { DEBUG = !!v; },
    get debug() { return DEBUG; }
  };

  autoRun();

})();
