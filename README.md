+   1 # 🥙 Doner-Kebab HTML
+   2 
+   3 Transform your HTML tags into delicious kebab-encoded markup while preserving scripts, styles, and source attributes.
+   4 
+   5 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
+   6 [![HTML](https://img.shields.io/badge/HTML-Encoder-orange.svg)](https://github.com/itsethemmiss/donerkebabhtml)
+   7 
+   8 ## 🌟 What is Doner-Kebab HTML?
+   9 
+  10 Doner-Kebab HTML is a unique HTML encoding library that converts standard HTML tags into kebab-encoded format. It's perfect for scenarios where you need to obfuscate HTML structure while maintaining full functionality.
+  11 
+  12 The encoded tags are automatically transformed back to standard HTML at runtime using the `donerkebabify.js` library.
+  13 
+  14 ## ✨ Features
+  15 
+  16 - 🔒 **Preserve Scripts** - Script tags remain intact and fully functional
+  17 - 🎨 **Keep Styles** - CSS styles work normally without encoding
+  18 - 📦 **Media Support** - Video and audio elements fully supported
+  19 - 🔄 **Auto Transform** - Automatic decoding at runtime
+  20 - 🎯 **Source Protection** - Source attributes remain unencoded
+  21 - 🌐 **Browser Compatible** - Works in all modern browsers
+  22 
+  23 ## 🚀 Quick Start
+  24 
+  25 ### Installation
+  26 
+  27 Include the Doner-Kebab library in your HTML file:
+  28 
+  29 ```html
+  30 <script src="https://cdn.jsdelivr.net/gh/itsethemmiss/donerkebabhtml@main/donerkebabify.js"></script>
+  31 ```
+  32 
+  33 ### Basic Usage
+  34 
+  35 Wrap your kebab-encoded HTML within `<donerkebabcode>` tags:
+  36 
+  37 ```html
+  38 <!DOCTYPE html>
+  39 <html lang="en">
+  40 <head>
+  41   <script src="https://cdn.jsdelivr.net/gh/itsethemmiss/donerkebabhtml@main/donerkebabify.js"></script>
+  42 </head>
+  43 <body>
+  44   <donerkebabcode>
+  45     <!-- Encoded div tag -->
+  46     <kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>
+  47       <kebabkebabkebabkebab>Hello, Doner-Kebab World!</kebabkebabkebabkebab>
+  48     </kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>
+  49   </donerkebabcode>
+  50 </body>
+  51 </html>
+  52 ```
+  53 
+  54 ## 📖 Encoding Reference
+  55 
+  56 ### Common Tag Encodings
+  57 
+  58 | HTML Tag | Doner-Kebab Encoding |
+  59 |----------|---------------------|
+  60 | `<div>` | `<kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>` |
+  61 | `<p>` | `<kebabkebabkebabkebab>` |
+  62 | `<span>` | `<kebabkebabdonerkebabdonerdonerkebabkebabkebabdonerdoner>` |
+  63 | `<video>` | `<kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>` |
+  64 | `<audio>` | `<kebabdonerkebabkebabdonerdonerkebabkebabkebabkebabdonerdonerdoner>` |
+  65 
+  66 ### Special Tags (NOT Encoded)
+  67 
+  68 The following tags and attributes are **never encoded** and remain in their original form:
+  69 
+  70 - `<script>` tags
+  71 - `<style>` tags
+  72 - `src` attributes
+  73 - `href` attributes
+  74 - All attributes within encoded tags
+  75 
+  76 ## 💡 Examples
+  77 
+  78 ### Example 1: Simple Content
+  79 
+  80 ```html
+  81 <donerkebabcode>
+  82   <kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner class="container">
+  83     <kebabkebabkebabkebab>This is a paragraph!</kebabkebabkebabkebab>
+  84   </kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>
+  85 </donerkebabcode>
+  86 ```
+  87 
+  88 **Transforms to:**
+  89 ```html
+  90 <div class="container">
+  91   <p>This is a paragraph!</p>
+  92 </div>
+  93 ```
+  94 
+  95 ### Example 2: Video with Normal Source
+  96 
+  97 ```html
+  98 <donerkebabcode>
+  99   <kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner controls>
+ 100     <source src="video.mp4" type="video/mp4">
+ 101   </kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>
+ 102 </donerkebabcode>
+ 103 ```
+ 104 
+ 105 **Transforms to:**
+ 106 ```html
+ 107 <video controls>
+ 108   <source src="video.mp4" type="video/mp4">
+ 109 </video>
+ 110 ```
+ 111 
+ 112 ### Example 3: Mixed Content
+ 113 
+ 114 ```html
+ 115 <donerkebabcode>
+ 116   <!-- Encoded HTML -->
+ 117   <kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner id="main">
+ 118     <kebabkebabkebabkebab>Content here</kebabkebabkebabkebab>
+ 119   </kebabkebabkebabdonerkebabkebabdonerkebabkebabkebabdonerdonerdoner>
+ 120 
+ 121   <!-- Normal CSS -->
+ 122   <style>
+ 123     #main { color: red; }
+ 124   </style>
+ 125 
+ 126   <!-- Normal JavaScript -->
+ 127   <script>
+ 128     console.log("Scripts work normally!");
+ 129   </script>
+ 130 </donerkebabcode>
+ 131 ```
+ 132 
+ 133 ## 🎯 Use Cases
+ 134 
+ 135 - **Content Protection** - Obfuscate HTML structure from casual inspection
+ 136 - **Anti-Scraping** - Make automated scraping more difficult
+ 137 - **Code Obfuscation** - Hide HTML structure while maintaining functionality
+ 138 - **Educational** - Learn about DOM manipulation and runtime transformations
+ 139 - **Creative Projects** - Unique approach to HTML encoding
+ 140 
+ 141 ## 🛠️ How It Works
+ 142 
+ 143 1. **Wrap Content** - Place your kebab-encoded HTML within `<donerkebabcode>` tags
+ 144 2. **Library Loads** - The `donerkebabify.js` script loads and scans the page
+ 145 3. **Pattern Detection** - Identifies kebab-encoded patterns
+ 146 4. **Runtime Transform** - Converts encoded tags back to standard HTML
+ 147 5. **Browser Renders** - Standard HTML is rendered normally
+ 148 
+ 149 ## 🌐 Browser Support
+ 150 
+ 151 - ✅ Chrome/Edge (Latest)
+ 152 - ✅ Firefox (Latest)
+ 153 - ✅ Safari (Latest)
+ 154 - ✅ Opera (Latest)
+ 155 
+ 156 ## 📦 CDN
+ 157 
+ 158 ```html
+ 159 <!-- Latest version -->
+ 160 <script src="https://cdn.jsdelivr.net/gh/itsethemmiss/donerkebabhtml@main/donerkebabify.js"></script>
+ 161 ```
+ 162 
+ 163 ## 🤝 Contributing
+ 164 
+ 165 Contributions are welcome! Feel free to:
+ 166 
+ 167 1. Fork the repository
+ 168 2. Create a feature branch (`git checkout -b feature/amazing-feature`)
+ 169 3. Commit your changes (`git commit -m 'Add amazing feature'`)
+ 170 4. Push to the branch (`git push origin feature/amazing-feature`)
+ 171 5. Open a Pull Request
+ 172 
+ 173 ## 📝 License
+ 174 
+ 175 This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
+ 176 
+ 177 ## 🙏 Acknowledgments
+ 178 
+ 179 - Inspired by the need for creative HTML obfuscation solutions
+ 180 - Built with ❤️ for the web development community
+ 181 
+ 182 ## 📧 Contact
+ 183 
+ 184 - GitHub: [@itsethemmiss](https://github.com/itsethemmiss)
+ 185 - Project Link: [https://github.com/itsethemmiss/donerkebabhtml](https://github.com/itsethemmiss/donerkebabhtml)
+ 186 
+ 187 ---
+ 188 
+ 189 <p align="center">Made with 🥙 by the Doner-Kebab HTML team</p>
