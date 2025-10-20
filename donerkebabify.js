/* donerkebabify.js
   Doner-Kebab Morse converter inside <donerkebabcode>.
   - Encoded tag names (Doner-Kebab Morse) -> real HTML elements
   - Preserves all attributes including class (Tailwind support)
   - Inline and external <script> will execute reliably
   - <style> tags apply
   - Leaves unknown/custom tags untouched but descends into them
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

  const dkToReal = Object.create(null);
  HTML_TAGS.forEach(tag => {
    dkToReal[encodeToDonerKebab(tag)] = tag;
  });

  let DEBUG = false;
  function log(...args){ if(DEBUG) console.log('[donerkebabify]', ...args); }

  function copyAttributes(fromEl, toEl) {
    Array.from(fromEl.attributes || []).forEach(attr => {
      try { toEl.setAttribute(attr.name, attr.value); } catch(e){ }
    });
  }

  function replaceDKElement(el, realTag) {
    if(!realTag) return el;

    if(realTag === 'style') {
      const styleEl = document.createElement('style');
      copyAttributes(el, styleEl);
      styleEl.textContent = el.textContent || '';
      el.parentNode.replaceChild(styleEl, el);
      log('Replaced style:', styleEl);
      return styleEl;
    }

    if(realTag === 'script') {
      const newScript = document.createElement('script');
      copyAttributes(el, newScript);

      if(el.hasAttribute('src')) {
        el.parentNode.insertBefore(newScript, el);
        el.parentNode.removeChild(el);
        log('Inserted external script:', newScript.getAttribute('src'));
        return newScript;
      } else {
        newScript.textContent = el.textContent || '';
        el.parentNode.insertBefore(newScript, el);
        el.parentNode.removeChild(el);
        log('Inserted inline script executed');
        return newScript;
      }
    }

    // Generic element (keeps all attributes, including class for Tailwind)
    const newEl = document.createElement(realTag);
    copyAttributes(el, newEl);

    while(el.firstChild) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
    log('Replaced', el.tagName, '=>', realTag);
    return newEl;
  }

  function convertChildren(root){
    const nodes = Array.from(root.children);
    for(const child of nodes){
      const tag = (child.tagName || '').toLowerCase();
      if(tag === 'donerkebabcode') {
        convertChildren(child);
        continue;
      }

      if(dkToReal[tag]) {
        const realTag = dkToReal[tag];
        const replaced = replaceDKElement(child, realTag);
        convertChildren(replaced);
      } else {
        convertChildren(child);
      }
    }
  }

  function runDonerKebabify() {
    const wrappers = document.querySelectorAll('donerkebabcode');
    if(!wrappers || wrappers.length===0){ log('No <donerkebabcode> wrappers found.'); return; }
    wrappers.forEach(wrapper => { convertChildren(wrapper); });
    log('donerkebabify: conversion complete');
  }

  function autoRun() {
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded', runDonerKebabify, {once:true});
    } else { runDonerKebabify(); }
  }

// enhanced DK -> HTML processor with better CSS and script handling
window.donerkebabify = {
  run() {
    const dk = document.querySelector("donerkebabcode");
    if (!dk) return;

    // Convert DK Morse tag names to HTML tags
    const morseToChar = { kebab: ".", doner: "-" };
    const dkToHtml = t =>
      t
        .replace(/kebab|doner/g, m => morseToChar[m])
        .replace(/\./g, "")
        .replace(/-/g, "");

    const all = dk.querySelectorAll("*");
    all.forEach(el => {
      const htmlTag = dkToHtml(el.tagName.toLowerCase());
      const newEl = document.createElement(htmlTag || "div");

      // copy attributes and classes
      for (let attr of el.attributes) newEl.setAttribute(attr.name, attr.value);
      newEl.innerHTML = el.innerHTML;
      el.replaceWith(newEl);

      // handle CSS & JS
      if (htmlTag === "style") {
        // move to <head> for proper Tailwind + DK styles
        const styleEl = document.createElement("style");
        styleEl.textContent = newEl.textContent;
        document.head.appendChild(styleEl);
        newEl.remove();
      } else if (htmlTag === "script") {
        const scriptEl = document.createElement("script");
        scriptEl.textContent = newEl.textContent;
        document.body.appendChild(scriptEl);
        newEl.remove();
      }
    });
  },
};

window.addEventListener("DOMContentLoaded", () => {
  window.donerkebabify.run();
});


  autoRun();

})();
