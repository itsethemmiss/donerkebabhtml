# 🥙 Doner-Kebab HTML

Transform your HTML tags into delicious kebab-encoded markup while preserving scripts, styles, and source attributes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML](https://img.shields.io/badge/HTML-Encoder-orange.svg)](https://github.com/itsethemmiss/donerkebabhtml)

## 🌟 What is Doner-Kebab HTML?

Doner-Kebab HTML is a unique HTML encoding library that converts standard HTML tags into kebab-encoded format. It's perfect for scenarios where you need to obfuscate HTML structure while maintaining full functionality.

The encoded tags are automatically transformed back to standard HTML at runtime using the `donerkebabify.js` library.

## ✨ Features

- 🔒 **Preserve Scripts** - Script tags remain intact and fully functional
- 🎨 **Keep Styles** - CSS styles work normally without encoding
- 📦 **Media Support** - Video and audio elements fully supported
- 🔄 **Auto Transform** - Automatic decoding at runtime
- 🎯 **Source Protection** - Source attributes remain unencoded
- 🌐 **Browser Compatible** - Works in all modern browsers

## 🚀 Quick Start

### Installation

Include the Doner-Kebab library in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/itsethemmiss/donerkebabhtml@main/donerkebabify.js"></script>

## 🥙 Use the Converter

Doner-Kebab HTML comes with an online or local converter to quickly transform your standard HTML into kebab-encoded HTML.

### Online Converter

Visit the [Doner-Kebab HTML Converter](https://itsethemmiss.github.io/donerkebabhtml) to paste your HTML and get the encoded version instantly.

### Local Usage

You can also use the converter script locally:

```html
<script src="https://cdn.jsdelivr.net/gh/itsethemmiss/donerkebabhtml@main/donerkebabify.js"></script>
<script>
  // Example: Convert a div to kebab-encoded format
  const html = '<div>Hello, world!</div>';
  const encoded = DonerKebab.encode(html);
  console.log(encoded);
</script>
