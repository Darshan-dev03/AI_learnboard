/**
 * Enhanced Module Data with Premium Content
 * Free courses get basic content, Paid courses get comprehensive content
 */

import { ModuleContent, ModuleNote, ModuleQuiz } from './moduleData';

// ============================================================
// PREMIUM HTML CONTENT (for paid courses)
// ============================================================
export const HTML_PREMIUM: ModuleContent = {
  notes: [
    {
      heading: "1. HTML Fundamentals & Document Structure",
      body: "HTML (HyperText Markup Language) is the foundational language of the web. It provides semantic structure to content, allowing browsers to understand and render information correctly. HTML5 introduced semantic elements like <header>, <nav>, <article>, <section>, <aside>, and <footer> that give meaning to page structure beyond just visual presentation. Understanding semantic HTML is crucial for accessibility, SEO, and maintainability.",
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Learn HTML5 semantic structure" />
    <meta name="keywords" content="HTML, web development, semantic HTML" />
    <meta name="author" content="Your Name" />
    <title>HTML5 Semantic Structure</title>
    <link rel="stylesheet" href="styles.css" />
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
  </head>
  <body>
    <header>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <article>
        <h1>Main Article Title</h1>
        <p>Article content goes here...</p>
      </article>
      
      <aside>
        <h2>Related Links</h2>
        <ul>
          <li><a href="#">Resource 1</a></li>
        </ul>
      </aside>
    </main>
    
    <footer>
      <p>&copy; 2026 Your Website</p>
    </footer>
  </body>
</html>`,
      tip: "Always use semantic HTML elements instead of generic <div> tags. Screen readers and search engines rely on semantic structure to understand your content.",
      keyPoints: [
        "HTML5 semantic elements provide meaning to page structure",
        "<!DOCTYPE html> declares HTML5 document type",
        "<head> contains metadata, <body> contains visible content",
        "Semantic elements improve accessibility and SEO",
        "Always include lang attribute on <html> for screen readers",
        "Meta viewport tag is essential for responsive design"
      ],
    },
    {
      heading: "2. Text Formatting & Typography",
      body: "HTML provides numerous elements for text formatting, each with semantic meaning. <strong> indicates strong importance (rendered bold), while <b> is purely stylistic. <em> indicates emphasis (rendered italic), while <i> is for alternate voice. <mark> highlights text, <small> represents fine print, <del> shows deleted text, and <ins> shows inserted text. Understanding these semantic differences is crucial for accessibility.",
      code: `<!-- Semantic text formatting -->
<p>This is <strong>very important</strong> information.</p>
<p>This text has <em>emphasis</em> on certain words.</p>
<p>The price is <del>$99</del> <ins>$79</ins> today only!</p>
<p><mark>Highlighted text</mark> stands out visually.</p>
<p><small>Terms and conditions apply</small></p>

<!-- Code and preformatted text -->
<p>Use the <code>console.log()</code> function to debug.</p>
<pre><code>
function greet(name) {
  return \`Hello, \${name}!\`;
}
</code></pre>

<!-- Quotations -->
<blockquote cite="https://example.com">
  <p>This is a long quotation from another source.</p>
  <footer>— <cite>Author Name</cite></footer>
</blockquote>

<p>As Einstein said, <q>Imagination is more important than knowledge.</q></p>

<!-- Abbreviations and definitions -->
<p><abbr title="HyperText Markup Language">HTML</abbr> is the standard markup language.</p>
<p><dfn>Semantic HTML</dfn> means using elements that describe their meaning.</p>`,
      tip: "Use <strong> and <em> for semantic importance, not just for bold/italic styling. Use CSS for visual styling.",
      keyPoints: [
        "<strong> = strong importance, <b> = stylistic bold",
        "<em> = emphasis, <i> = alternate voice or technical term",
        "<code> for inline code, <pre><code> for code blocks",
        "<blockquote> for long quotes, <q> for inline quotes",
        "<abbr> with title attribute explains abbreviations",
        "<mark> highlights text, <del> shows deletions, <ins> shows insertions"
      ],
    },
    {
      heading: "3. Links, Navigation & Accessibility",
      body: "Links are the foundation of the web. The <a> element creates hyperlinks with the href attribute. Use descriptive link text for accessibility—avoid 'click here'. The target attribute controls where links open. rel='noopener noreferrer' is essential for security when using target='_blank'. Navigation should use <nav> element with proper ARIA labels for screen readers.",
      code: `<!-- External links with security -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit Example.com (opens in new tab)
</a>

<!-- Internal navigation -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- Anchor links (jump to section) -->
<a href="#section-2">Jump to Section 2</a>
<section id="section-2">
  <h2>Section 2</h2>
  <p>Content here...</p>
</section>

<!-- Email and phone links -->
<a href="mailto:hello@example.com">Email Us</a>
<a href="tel:+1234567890">Call Us</a>

<!-- Download links -->
<a href="/files/document.pdf" download="document.pdf">
  Download PDF
</a>

<!-- Skip navigation for accessibility -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<main id="main-content">
  <!-- Main content -->
</main>`,
      tip: "Always use descriptive link text. Instead of 'click here', use 'download the user guide' or 'read our privacy policy'.",
      keyPoints: [
        "href attribute specifies the link destination",
        "target='_blank' opens in new tab, requires rel='noopener noreferrer'",
        "Use descriptive link text for accessibility",
        "aria-current='page' indicates current page in navigation",
        "Anchor links (#id) enable in-page navigation",
        "Skip links improve keyboard navigation accessibility"
      ],
    },
    {
      heading: "4. Images, Figures & Multimedia",
      body: "Images are essential to modern web design. The <img> element requires src (source) and alt (alternative text) attributes. Alt text is crucial for accessibility and SEO. Use <figure> and <figcaption> to group images with captions. The <picture> element enables responsive images with different sources for different screen sizes. Always optimize images for web performance.",
      code: `<!-- Basic image with alt text -->
<img src="/images/sunset.jpg" 
     alt="Beautiful sunset over the ocean with orange and pink clouds" 
     width="800" 
     height="600"
     loading="lazy" />

<!-- Figure with caption -->
<figure>
  <img src="/images/chart.png" alt="Sales growth chart showing 25% increase" />
  <figcaption>Figure 1: Annual sales growth (2020-2026)</figcaption>
</figure>

<!-- Responsive images with picture element -->
<picture>
  <source media="(min-width: 1200px)" srcset="/images/hero-large.jpg" />
  <source media="(min-width: 768px)" srcset="/images/hero-medium.jpg" />
  <img src="/images/hero-small.jpg" alt="Hero image" />
</picture>

<!-- Responsive images with srcset -->
<img src="/images/photo.jpg"
     srcset="/images/photo-400w.jpg 400w,
             /images/photo-800w.jpg 800w,
             /images/photo-1200w.jpg 1200w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Responsive image example" />

<!-- Video element -->
<video controls width="640" height="360" poster="/images/video-poster.jpg">
  <source src="/videos/intro.mp4" type="video/mp4" />
  <source src="/videos/intro.webm" type="video/webm" />
  <p>Your browser doesn't support HTML5 video. 
     <a href="/videos/intro.mp4">Download the video</a>.</p>
</video>

<!-- Audio element -->
<audio controls>
  <source src="/audio/podcast.mp3" type="audio/mpeg" />
  <source src="/audio/podcast.ogg" type="audio/ogg" />
  <p>Your browser doesn't support HTML5 audio.</p>
</audio>`,
      tip: "Always include meaningful alt text. For decorative images, use alt='' (empty string) to tell screen readers to skip it.",
      keyPoints: [
        "Alt text is required for accessibility and SEO",
        "loading='lazy' defers offscreen image loading",
        "<figure> and <figcaption> group images with captions",
        "<picture> element enables art direction and format selection",
        "srcset and sizes attributes enable responsive images",
        "Always provide fallback content for video and audio"
      ],
    },
    {
      heading: "5. Forms & Input Elements",
      body: "Forms are how users interact with web applications. HTML5 introduced many new input types with built-in validation: email, url, tel, number, date, color, range, and more. Use proper input types for better mobile keyboards and validation. Labels are essential for accessibility—every input needs an associated label. Fieldsets group related inputs.",
      code: `<form action="/submit" method="POST" novalidate>
  <!-- Text inputs -->
  <div class="form-group">
    <label for="username">Username *</label>
    <input type="text" 
           id="username" 
           name="username" 
           required 
           minlength="3"
           maxlength="20"
           pattern="[a-zA-Z0-9]+"
           aria-describedby="username-help" />
    <small id="username-help">3-20 alphanumeric characters</small>
  </div>

  <!-- Email with validation -->
  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" 
           id="email" 
           name="email" 
           required 
           placeholder="you@example.com" />
  </div>

  <!-- Password -->
  <div class="form-group">
    <label for="password">Password *</label>
    <input type="password" 
           id="password" 
           name="password" 
           required 
           minlength="8"
           autocomplete="new-password" />
  </div>

  <!-- Select dropdown -->
  <div class="form-group">
    <label for="country">Country</label>
    <select id="country" name="country" required>
      <option value="">-- Select Country --</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="in">India</option>
    </select>
  </div>

  <!-- Radio buttons -->
  <fieldset>
    <legend>Subscription Plan</legend>
    <label>
      <input type="radio" name="plan" value="free" checked />
      Free
    </label>
    <label>
      <input type="radio" name="plan" value="pro" />
      Pro ($9/month)
    </label>
    <label>
      <input type="radio" name="plan" value="enterprise" />
      Enterprise ($99/month)
    </label>
  </fieldset>

  <!-- Checkboxes -->
  <div class="form-group">
    <label>
      <input type="checkbox" name="terms" required />
      I agree to the <a href="/terms">Terms of Service</a> *
    </label>
  </div>

  <!-- Textarea -->
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" 
              name="message" 
              rows="5" 
              maxlength="500"
              placeholder="Enter your message..."></textarea>
  </div>

  <!-- HTML5 input types -->
  <input type="date" name="birthdate" />
  <input type="time" name="appointment" />
  <input type="number" name="age" min="18" max="120" />
  <input type="range" name="volume" min="0" max="100" />
  <input type="color" name="theme-color" />
  <input type="url" name="website" placeholder="https://example.com" />
  <input type="tel" name="phone" pattern="[0-9]{10}" />

  <!-- File upload -->
  <div class="form-group">
    <label for="avatar">Profile Picture</label>
    <input type="file" 
           id="avatar" 
           name="avatar" 
           accept="image/png, image/jpeg" 
           multiple />
  </div>

  <!-- Submit button -->
  <button type="submit">Submit Form</button>
  <button type="reset">Reset</button>
</form>`,
      tip: "Use the correct input type for each field. Mobile browsers show optimized keyboards for email, tel, number, etc.",
      keyPoints: [
        "Every input needs an associated <label> for accessibility",
        "Use HTML5 input types for built-in validation",
        "required, minlength, maxlength, pattern for validation",
        "<fieldset> and <legend> group related form controls",
        "aria-describedby links inputs to help text",
        "novalidate on form disables browser validation for custom handling"
      ],
    },
    {
      heading: "6. Tables & Data Presentation",
      body: "Tables should only be used for tabular data, never for layout. Proper table structure includes <thead>, <tbody>, and <tfoot>. Use <th> for header cells with scope attribute for accessibility. <caption> provides a title for the table. colspan and rowspan merge cells. Always make tables responsive for mobile devices.",
      code: `<table>
  <caption>Quarterly Sales Report 2026</caption>
  <thead>
    <tr>
      <th scope="col">Quarter</th>
      <th scope="col">Revenue</th>
      <th scope="col">Expenses</th>
      <th scope="col">Profit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>$125,000</td>
      <td>$75,000</td>
      <td>$50,000</td>
    </tr>
    <tr>
      <th scope="row">Q2</th>
      <td>$150,000</td>
      <td>$80,000</td>
      <td>$70,000</td>
    </tr>
    <tr>
      <th scope="row">Q3</th>
      <td>$175,000</td>
      <td>$85,000</td>
      <td>$90,000</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>$450,000</td>
      <td>$240,000</td>
      <td>$210,000</td>
    </tr>
  </tfoot>
</table>

<!-- Table with colspan and rowspan -->
<table>
  <tr>
    <th colspan="2">Student Information</th>
  </tr>
  <tr>
    <th>Name</th>
    <td>Alice Johnson</td>
  </tr>
  <tr>
    <th>Grade</th>
    <td>A+</td>
  </tr>
</table>

<!-- Responsive table wrapper -->
<div class="table-responsive">
  <table>
    <!-- table content -->
  </table>
</div>`,
      tip: "For mobile responsiveness, wrap tables in a scrollable container or convert them to a card layout with CSS.",
      keyPoints: [
        "Use tables only for tabular data, not layout",
        "<thead>, <tbody>, <tfoot> structure table sections",
        "<th> with scope='col' or scope='row' for accessibility",
        "<caption> provides table title for screen readers",
        "colspan and rowspan merge cells horizontally/vertically",
        "Make tables responsive with CSS or alternative layouts"
      ],
    },
    {
      heading: "7. Lists & Structured Content",
      body: "HTML provides three types of lists: unordered (<ul>) for bullet points, ordered (<ol>) for numbered lists, and description lists (<dl>) for term-definition pairs. Lists can be nested for hierarchical content. Use lists for navigation menus, feature lists, steps in a process, and any content that represents a collection of items.",
      code: `<!-- Unordered list -->
<ul>
  <li>HTML - Structure</li>
  <li>CSS - Styling</li>
  <li>JavaScript - Interactivity</li>
</ul>

<!-- Ordered list with custom start -->
<ol start="5">
  <li>Step Five</li>
  <li>Step Six</li>
  <li>Step Seven</li>
</ol>

<!-- Ordered list with different types -->
<ol type="A">
  <li>Option A</li>
  <li>Option B</li>
  <li>Option C</li>
</ol>

<!-- Nested lists -->
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript
        <ul>
          <li>React</li>
          <li>Vue</li>
          <li>Angular</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>Python</li>
      <li>Java</li>
    </ul>
  </li>
</ul>

<!-- Description list -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language - the structure of web pages</dd>
  
  <dt>CSS</dt>
  <dd>Cascading Style Sheets - the presentation of web pages</dd>
  
  <dt>JavaScript</dt>
  <dd>Programming language for web interactivity</dd>
</dl>

<!-- Navigation menu using list -->
<nav>
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem">Home</a>
    </li>
    <li role="none">
      <a href="/about" role="menuitem">About</a>
    </li>
  </ul>
</nav>`,
      tip: "Use unordered lists when order doesn't matter, ordered lists when sequence is important, and description lists for glossaries or FAQs.",
      keyPoints: [
        "<ul> for unordered lists, <ol> for ordered lists",
        "<li> represents each list item",
        "Lists can be nested for hierarchical content",
        "<dl>, <dt>, <dd> for term-definition pairs",
        "start attribute on <ol> changes starting number",
        "type attribute on <ol> changes numbering style (1, A, a, I, i)"
      ],
    },
    {
      heading: "8. HTML5 APIs & Advanced Features",
      body: "HTML5 introduced powerful APIs that enable rich web applications without plugins. The Canvas API enables 2D graphics and animations. The Geolocation API accesses user location. Local Storage and Session Storage provide client-side data persistence. The Drag and Drop API enables intuitive interfaces. Web Workers run JavaScript in background threads.",
      code: `<!-- Canvas for graphics -->
<canvas id="myCanvas" width="400" height="300">
  Your browser doesn't support canvas.
</canvas>
<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#6c63ff';
  ctx.fillRect(50, 50, 200, 100);
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Hello Canvas!', 80, 110);
</script>

<!-- Geolocation API -->
<button onclick="getLocation()">Get My Location</button>
<p id="location"></p>
<script>
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        document.getElementById('location').textContent = 
          \`Lat: \${position.coords.latitude}, 
           Lng: \${position.coords.longitude}\`;
      });
    }
  }
</script>

<!-- Local Storage -->
<script>
  // Save data
  localStorage.setItem('username', 'Alice');
  localStorage.setItem('theme', 'dark');
  
  // Retrieve data
  const username = localStorage.getItem('username');
  
  // Remove data
  localStorage.removeItem('theme');
  
  // Clear all
  localStorage.clear();
</script>

<!-- Drag and Drop -->
<div id="drag-source" draggable="true" ondragstart="handleDragStart(event)">
  Drag me!
</div>
<div id="drop-zone" ondrop="handleDrop(event)" ondragover="handleDragOver(event)">
  Drop here
</div>

<!-- Data attributes for custom data -->
<article data-post-id="123" 
         data-author="Alice" 
         data-category="tutorial">
  <h2>Article Title</h2>
</article>
<script>
  const article = document.querySelector('article');
  console.log(article.dataset.postId);    // "123"
  console.log(article.dataset.author);    // "Alice"
  console.log(article.dataset.category);  // "tutorial"
</script>`,
      tip: "HTML5 APIs are powerful but check browser compatibility. Use feature detection before using advanced APIs.",
      keyPoints: [
        "Canvas API for 2D graphics, charts, and games",
        "Geolocation API accesses user's location (requires permission)",
        "localStorage persists data permanently, sessionStorage until tab closes",
        "Drag and Drop API enables intuitive drag-drop interfaces",
        "data-* attributes store custom data on elements",
        "Web Workers run JavaScript in background without blocking UI"
      ],
    },
  ],
  quiz: [
    { q: "What is the purpose of semantic HTML?", options: ["Make pages load faster", "Provide meaning to content structure", "Add animations", "Style the page"], answer: 1 },
    { q: "Which attribute is required for accessibility on images?", options: ["src", "alt", "title", "width"], answer: 1 },
    { q: "What does rel='noopener noreferrer' do on links?", options: ["Opens in new tab", "Prevents security vulnerabilities", "Adds styling", "Makes link bold"], answer: 1 },
    { q: "Which element groups an image with its caption?", options: ["<div>", "<figure>", "<section>", "<article>"], answer: 1 },
    { q: "What is the correct input type for email addresses?", options: ["text", "email", "mail", "address"], answer: 1 },
    { q: "Which element should be used for tabular data?", options: ["<div>", "<grid>", "<table>", "<data>"], answer: 2 },
    { q: "What does the scope attribute do on <th> elements?", options: ["Sets width", "Improves accessibility", "Adds color", "Merges cells"], answer: 1 },
    { q: "Which list type is best for term-definition pairs?", options: ["<ul>", "<ol>", "<dl>", "<list>"], answer: 2 },
    { q: "What does localStorage do?", options: ["Stores data temporarily", "Stores data permanently in browser", "Stores data on server", "Clears cache"], answer: 1 },
    { q: "Which HTML5 API enables 2D graphics?", options: ["SVG", "Canvas", "WebGL", "Graphics"], answer: 1 },
    { q: "What is the purpose of the <nav> element?", options: ["Create navigation menus", "Add navigation arrows", "Style links", "Create breadcrumbs"], answer: 0 },
    { q: "Which attribute makes an input field required?", options: ["mandatory", "required", "needed", "must"], answer: 1 },
    { q: "What does the loading='lazy' attribute do?", options: ["Loads image slowly", "Defers offscreen image loading", "Compresses image", "Adds loading spinner"], answer: 1 },
    { q: "Which element represents a self-contained composition?", options: ["<div>", "<section>", "<article>", "<content>"], answer: 2 },
    { q: "What is the purpose of the <aside> element?", options: ["Main content", "Sidebar content", "Footer content", "Header content"], answer: 1 },
  ],
};

// ============================================================
// BASIC HTML CONTENT (for free courses)
// ============================================================
export const HTML_BASIC: ModuleContent = {
  notes: [
    {
      heading: "1. What is HTML?",
      body: "HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to structure content. Tags are wrapped in angle brackets like <tagname>. Most tags have an opening and closing tag.",
      code: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`,
      tip: "Always include <!DOCTYPE html> at the top of your HTML files.",
      keyPoints: [
        "HTML stands for HyperText Markup Language",
        "Tags are wrapped in angle brackets",
        "Most tags have opening and closing pairs"
      ],
    },
    {
      heading: "2. Basic HTML Structure",
      body: "Every HTML document has a basic structure with <html>, <head>, and <body> tags. The <head> contains metadata, and the <body> contains visible content.",
      code: `<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>Main Heading</h1>
    <p>Paragraph text</p>
  </body>
</html>`,
      tip: "The <title> tag appears in the browser tab.",
      keyPoints: [
        "<html> is the root element",
        "<head> contains metadata",
        "<body> contains visible content"
      ],
    },
    {
      heading: "3. Headings and Paragraphs",
      body: "HTML has 6 heading levels from <h1> to <h6>. <h1> is the largest and most important. Paragraphs use the <p> tag.",
      code: `<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Section Title</h3>
<p>This is a paragraph of text.</p>`,
      tip: "Use only one <h1> per page for SEO.",
      keyPoints: [
        "6 heading levels: h1 to h6",
        "h1 is most important",
        "<p> creates paragraphs"
      ],
    },
    {
      heading: "4. Links and Images",
      body: "Links use the <a> tag with href attribute. Images use the <img> tag with src and alt attributes.",
      code: `<a href="https://google.com">Visit Google</a>
<img src="photo.jpg" alt="A photo" />`,
      tip: "Always include alt text on images for accessibility.",
      keyPoints: [
        "<a> creates links with href attribute",
        "<img> displays images",
        "alt attribute describes images"
      ],
    },
  ],
  quiz: [
    { q: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Modern Links", "None"], answer: 0 },
    { q: "Which tag creates the largest heading?", options: ["<h6>", "<h1>", "<heading>", "<head>"], answer: 1 },
    { q: "Which attribute specifies a link's destination?", options: ["src", "href", "link", "url"], answer: 1 },
    { q: "What does the alt attribute do?", options: ["Adds a link", "Describes an image", "Changes color", "Adds animation"], answer: 1 },
  ],
};

// Export function to get appropriate content based on course type
export function getEnhancedModuleContent(moduleName: string, isFree: boolean): ModuleContent {
  const name = moduleName.toLowerCase();
  
  if (name.includes('html')) {
    return isFree ? HTML_BASIC : HTML_PREMIUM;
  }
  
  // Return basic content as fallback
  return HTML_BASIC;
}
