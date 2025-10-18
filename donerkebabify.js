/* donerkebabify.js
   Robust Doner-Kebab converter inside <donerkebabcode>.
   - Encoded tag names (Doner-Kebab Morse) -> real HTML elements
   - Inline and external <script> will execute reliably
   - <style> tags apply
   - Preserves attributes (src, type, async, defer, etc.)
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

  // Standard HTML tag list
  const HTML_TAGS = [
    "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button",
    "canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div",
    "dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head",
    "header","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark",
    "meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress",
    "q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary",
    "sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"
  ];

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

  function log(...args) {
    if (DEBUG) console.log('[donerkebabify]', ...args);
  }

  function copyAttributes(fromEl, toEl) {
    Array.from(fromEl.attributes || []).forEach(attr => {
      try { toEl.setAttribute(attr.name, attr.value); } catch (e) { /* ignore */ }
    });
  }

  // Replace DK encoded element with a real element. Handles special cases for script/style.
  function replaceDKElement(el, realTag) {
    if (!realTag) return el;

    // Handle <style> -> create a style element and replace in-place
    if (realTag === 'style') {
      const styleEl = document.createElement('style');
      copyAttributes(el, styleEl);
      // Use textContent for CSS
      styleEl.textContent = el.textContent || '';
      el.parentNode.replaceChild(styleEl, el);
      log('Replaced style at', styleEl);
      return styleEl;
    }

    // Handle <script> specially so it executes
    if (realTag === 'script') {
      // Create a fresh script element
      const newScript = document.createElement('script');
      // Copy attributes (src, type, async, defer, nomodule, etc.)
      copyAttributes(el, newScript);

      // Decide inline vs external
      const hasSrc = el.hasAttribute('src');

      if (hasSrc) {
        // External script: set src (copied above) and append to same parent at the same position
        // To preserve execution order we will insert the script where the original was.
        // Using replaceChild with a created script should start loading/executing.
        // But some browsers delay execution until appended; replaceChild is fine.
        // Ensure removal of original happens after insertion below.
        // Because we copied attributes already, we can use replaceChild directly.
        // For reliability, we'll insert newScript then remove old element.
        el.parentNode.insertBefore(newScript, el);
        el.parentNode.removeChild(el);
        log('Inserted external script with src', newScript.getAttribute('src'));
        return newScript;
      } else {
        // Inline script: set textContent then insert to cause execution.
        const inlineCode = el.textContent || '';
        // If type is module, keep type attribute — module inline execution also works when appended.
        newScript.textContent = inlineCode;
        // Insert in place of original to preserve order
        el.parentNode.insertBefore(newScript, el);
        el.parentNode.removeChild(el);
        log('Inserted inline script (executed)');
        return newScript;
      }
    }

    // Generic element replacement:
    const newEl = document.createElement(realTag);
    copyAttributes(el, newEl);

    // Move children (works for iframe fallback children too)
    while (el.firstChild) {
      newEl.appendChild(el.firstChild);
    }

    el.parentNode.replaceChild(newEl, el);
    log('Replaced', el.tagName, '=>', realTag);
    return newEl;
  }

  // Recursively convert children of a root element.
  function convertChildren(root) {
    // Make an array copy since we may replace nodes during iteration.
    const nodes = Array.from(root.children);
    for (const child of nodes) {
      const tag = (child.tagName || '').toLowerCase();

      // Skip wrapper tag itself and just recurse into it
      if (tag === 'donerkebabcode') {
        convertChildren(child);
        continue;
      }

      // If this tag matches an encoded standard tag, replace it with the real one
      if (dkToReal[tag]) {
        const realTag = dkToReal[tag];
        const replaced = replaceDKElement(child, realTag);
        // Recurse into the replaced element (so nested encoded tags inside run)
        convertChildren(replaced);
      } else {
        // Not recognized: treat as a custom tag, but recurse inside it in case nested encoded tags exist
        convertChildren(child);
      }
    }
  }

  // Top-level run
  function runDonerKebabify() {
    const wrappers = document.querySelectorAll('donerkebabcode');
    if (!wrappers || wrappers.length === 0) {
      log('No <donerkebabcode> wrappers found.');
      return;
    }

    wrappers.forEach(wrapper => {
      // Convert children of wrapper in document order
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
