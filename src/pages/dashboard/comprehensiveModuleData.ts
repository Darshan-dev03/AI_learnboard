/**
 * COMPREHENSIVE MODULE DATA - ULTRA DETAILED CONTENT
 * Each module contains extensive explanations, multiple examples, and deep dives into concepts
 */

import { ModuleContent } from './moduleData';

// ============================================================
// COMPREHENSIVE HTML MODULE - ULTRA DETAILED
// ============================================================
export const HTML_COMPREHENSIVE: ModuleContent = {
  notes: [
    {
      heading: "1. HTML Fundamentals - Complete Deep Dive",
      body: `HTML (HyperText Markup Language) is the foundational technology of the World Wide Web. Let's break down what this means:

**HyperText**: This refers to text that contains links to other text. The "hyper" prefix means it goes beyond regular text - it's interconnected. When you click a link on a webpage, you're using hypertext to navigate between documents. This concept, invented by Tim Berners-Lee in 1989, revolutionized how we access information.

**Markup**: HTML is a markup language, not a programming language. This is a crucial distinction. Markup languages annotate text to give it structure and meaning. You're not writing logic or algorithms - you're describing what each piece of content represents. For example, you mark text as a heading, a paragraph, a list item, etc.

**Language**: HTML has syntax rules and a vocabulary (tags). Browsers parse this language and render it visually.

**Why HTML Matters:**
1. **Universal Standard**: Every website uses HTML. It's the common language all browsers understand.
2. **Semantic Structure**: HTML gives meaning to content. A <h1> isn't just big text - it tells browsers and search engines "this is the main heading."
3. **Accessibility Foundation**: Screen readers rely on proper HTML structure to help visually impaired users navigate websites.
4. **SEO Impact**: Search engines use HTML structure to understand and rank your content.

**HTML Evolution:**
- HTML 1.0 (1991): Basic tags like <p>, <h1>, <a>
- HTML 2.0 (1995): Forms and tables added
- HTML 3.2 (1997): Applets, text flow around images
- HTML 4.01 (1999): Stylesheets, scripting, accessibility
- XHTML (2000): XML-based, stricter syntax
- HTML5 (2014): Semantic elements, multimedia, APIs - the modern standard

**HTML5 Revolutionary Features:**
- Semantic elements (<header>, <nav>, <article>, <section>, <aside>, <footer>)
- Native video and audio support (no more Flash!)
- Canvas for graphics and animations
- Local storage for offline capabilities
- Geolocation, drag-and-drop, and many APIs
- Better form controls with validation
- Improved accessibility features`,
      code: `<!DOCTYPE html>
<!-- The DOCTYPE declaration tells the browser this is HTML5 -->
<!-- It must be the very first line, before <html> -->

<html lang="en">
<!-- The lang attribute is crucial for:
     1. Screen readers (correct pronunciation)
     2. Search engines (language targeting)
     3. Translation tools
     4. Accessibility compliance -->

<head>
  <!-- The <head> contains metadata - information ABOUT the page -->
  <!-- Nothing in <head> is directly visible on the page -->
  
  <meta charset="UTF-8" />
  <!-- UTF-8 encoding supports all languages and special characters
       Without this, characters like é, ñ, 中文 may display incorrectly -->
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- CRITICAL for responsive design on mobile devices
       width=device-width: use the device's screen width
       initial-scale=1.0: don't zoom in or out by default
       Without this, mobile sites will look like desktop sites zoomed out -->
  
  <meta name="description" content="Learn HTML5 from basics to advanced - comprehensive tutorial with examples" />
  <!-- This appears in search results under your page title
       Keep it 150-160 characters for optimal display
       This is your "sales pitch" in search results -->
  
  <meta name="keywords" content="HTML, HTML5, web development, tutorial, semantic HTML" />
  <!-- Less important for SEO now, but still used by some search engines -->
  
  <meta name="author" content="Your Name" />
  <!-- Credits the page author -->
  
  <meta name="robots" content="index, follow" />
  <!-- Tells search engines to index this page and follow links
       Other options: noindex, nofollow -->
  
  <!-- Open Graph tags for social media sharing -->
  <meta property="og:title" content="HTML5 Complete Guide" />
  <meta property="og:description" content="Master HTML5 with this comprehensive tutorial" />
  <meta property="og:image" content="https://example.com/preview.jpg" />
  <meta property="og:url" content="https://example.com/html-guide" />
  <!-- When someone shares your page on Facebook/LinkedIn, these control how it looks -->
  
  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="HTML5 Complete Guide" />
  <meta name="twitter:description" content="Master HTML5 with this comprehensive tutorial" />
  <meta name="twitter:image" content="https://example.com/preview.jpg" />
  
  <title>HTML5 Complete Guide - Learn Web Development</title>
  <!-- The <title> is EXTREMELY important:
       1. Appears in browser tab
       2. Appears in search results (most important SEO factor)
       3. Appears in bookmarks
       4. Should be 50-60 characters for optimal display
       5. Should be unique for each page
       6. Should include primary keyword -->
  
  <!-- Favicon - the small icon in browser tab -->
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <!-- Apple devices use this for home screen bookmarks -->
  
  <!-- Stylesheet -->
  <link rel="stylesheet" href="styles.css" />
  <!-- External CSS is best practice - keeps HTML clean and CSS reusable -->
  
  <!-- Preload critical resources for performance -->
  <link rel="preload" href="critical-font.woff2" as="font" type="font/woff2" crossorigin />
  <!-- Tells browser to download this font immediately -->
  
  <!-- DNS prefetch for external domains -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
  <!-- Resolves DNS early for faster loading of external resources -->
</head>

<body>
  <!-- The <body> contains all visible content -->
  
  <!-- Semantic HTML5 structure -->
  <header role="banner">
    <!-- <header> represents introductory content
         role="banner" is ARIA landmark for accessibility
         Screen readers can jump directly to banner -->
    
    <nav role="navigation" aria-label="Main navigation">
      <!-- <nav> represents navigation links
           aria-label describes this specific navigation
           (useful if you have multiple nav elements) -->
      
      <ul role="menubar">
        <!-- role="menubar" indicates this is a menu -->
        <li role="none">
          <!-- role="none" removes default list semantics -->
          <a href="/" role="menuitem" aria-current="page">Home</a>
          <!-- aria-current="page" indicates current page -->
        </li>
        <li role="none">
          <a href="/about" role="menuitem">About</a>
        </li>
        <li role="none">
          <a href="/contact" role="menuitem">Contact</a>
        </li>
      </ul>
    </nav>
  </header>
  
  <main role="main" id="main-content">
    <!-- <main> represents the primary content
         Should be unique - only one <main> per page
         role="main" is ARIA landmark
         id allows skip links to jump here -->
    
    <article>
      <!-- <article> represents self-contained content
           Could be distributed independently
           Examples: blog post, news article, forum post -->
      
      <header>
        <!-- Yes, you can have <header> inside <article>! -->
        <h1>Understanding HTML5 Semantic Structure</h1>
        <!-- <h1> is the most important heading
             Use only ONE <h1> per page for SEO
             It should describe the main topic -->
        
        <p class="meta">
          <time datetime="2026-04-27T10:00:00Z">April 27, 2026</time>
          <!-- <time> with datetime attribute is machine-readable
               Format: YYYY-MM-DDTHH:MM:SSZ (ISO 8601) -->
          by <span class="author">John Doe</span>
        </p>
      </header>
      
      <section>
        <!-- <section> represents a thematic grouping of content
             Should have a heading (h2-h6) -->
        
        <h2>What is Semantic HTML?</h2>
        <!-- <h2> is a subsection of <h1>
             Headings create document outline
             Never skip levels (h1 → h3 is wrong) -->
        
        <p>
          Semantic HTML means using elements that describe their meaning,
          not just their appearance. Instead of <code>&lt;div class="header"&gt;</code>,
          use <code>&lt;header&gt;</code>.
        </p>
        <!-- <code> represents inline code
             Use <pre><code> for code blocks -->
        
        <figure>
          <!-- <figure> groups media with caption -->
          <img src="/images/semantic-html.png" 
               alt="Diagram showing semantic HTML5 elements like header, nav, main, article, aside, footer"
               width="800"
               height="600"
               loading="lazy" />
          <!-- alt text is REQUIRED for accessibility
               Describe what's in the image for screen readers
               width/height prevent layout shift during loading
               loading="lazy" defers loading until image is near viewport -->
          
          <figcaption>
            <!-- <figcaption> provides caption for <figure> -->
            Figure 1: HTML5 semantic elements provide meaning to page structure
          </figcaption>
        </figure>
      </section>
      
      <section>
        <h2>Why Semantic HTML Matters</h2>
        
        <h3>1. Accessibility</h3>
        <!-- <h3> is a subsection of <h2> -->
        <p>
          Screen readers use semantic elements to help users navigate.
          A blind user can jump between headings, landmarks, and sections
          without reading every word.
        </p>
        
        <h3>2. SEO (Search Engine Optimization)</h3>
        <p>
          Search engines understand semantic HTML. They know a <code>&lt;nav&gt;</code>
          contains navigation, an <code>&lt;article&gt;</code> is main content,
          and <code>&lt;aside&gt;</code> is supplementary. This helps them
          rank your content appropriately.
        </p>
        
        <h3>3. Maintainability</h3>
        <p>
          Code is easier to read and maintain when elements describe their purpose.
          <code>&lt;header&gt;</code> is clearer than <code>&lt;div class="header"&gt;</code>.
        </p>
      </section>
    </article>
    
    <aside role="complementary">
      <!-- <aside> represents content tangentially related to main content
           Examples: sidebar, related links, ads, author bio
           role="complementary" is ARIA landmark -->
      
      <h2>Related Resources</h2>
      <ul>
        <li><a href="/css-guide">CSS Complete Guide</a></li>
        <li><a href="/js-guide">JavaScript Fundamentals</a></li>
        <li><a href="/accessibility">Web Accessibility</a></li>
      </ul>
    </aside>
  </main>
  
  <footer role="contentinfo">
    <!-- <footer> represents footer content
         Can be for whole page or for a section
         role="contentinfo" is ARIA landmark for page footer -->
    
    <p>&copy; 2026 Your Website. All rights reserved.</p>
    
    <nav aria-label="Footer navigation">
      <!-- Secondary navigation in footer -->
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/sitemap">Sitemap</a></li>
      </ul>
    </nav>
  </footer>
  
  <!-- Scripts at the end for performance -->
  <script src="main.js" defer></script>
  <!-- defer: download in parallel, execute after HTML parsing
       async: download in parallel, execute immediately when ready
       defer is usually better for maintaining execution order -->
</body>
</html>`,
      tip: "Always validate your HTML using the W3C Validator (validator.w3.org). Valid HTML ensures cross-browser compatibility and accessibility compliance.",
      keyPoints: [
        "HTML5 is the current standard, introducing semantic elements and powerful APIs",
        "DOCTYPE declaration must be first line: <!DOCTYPE html>",
        "lang attribute on <html> is crucial for accessibility and SEO",
        "UTF-8 charset supports all languages and special characters worldwide",
        "Viewport meta tag is essential for responsive mobile design",
        "Meta description appears in search results - your 160-character sales pitch",
        "Semantic elements (<header>, <nav>, <main>, <article>, <aside>, <footer>) provide meaning",
        "ARIA roles and labels enhance accessibility for screen reader users",
        "Only one <h1> per page for optimal SEO and document structure",
        "Alt text on images is required by law in many countries (ADA, WCAG compliance)"
      ],
    },
    {
      heading: "2. Text Content & Typography - Mastering Semantic Meaning",
      body: `Text is the foundation of web content. HTML provides numerous elements for text, each with specific semantic meaning. Understanding these semantics is crucial for accessibility, SEO, and code maintainability.

**The Difference Between Semantic and Presentational Elements:**

Semantic elements describe WHAT the content is:
- <strong> means "this text has strong importance"
- <em> means "this text has emphasis"
- <mark> means "this text is highlighted for reference"

Presentational elements describe HOW content looks:
- <b> means "this text is bold" (no semantic meaning)
- <i> means "this text is italic" (no semantic meaning)

**Why This Matters:**
1. **Screen Readers**: A screen reader will announce <strong> with emphasis in its voice, but <b> is just read normally.
2. **Search Engines**: Google understands <strong> indicates important content, but <b> is just styling.
3. **Future-Proofing**: Semantic HTML works even if CSS is disabled or on devices without screens (like voice assistants).

**Heading Hierarchy - The Document Outline:**

Headings (h1-h6) create a document outline, like a table of contents. This outline is used by:
- Screen readers (users can navigate by headings)
- Search engines (to understand content structure)
- Browser extensions (like table of contents generators)
- Accessibility auditing tools

**Rules for Headings:**
1. One <h1> per page (the main topic)
2. Don't skip levels (h1 → h2 → h3, not h1 → h3)
3. Headings should describe content, not be used for styling
4. Use CSS to change heading sizes, not different heading levels

**Text Formatting Best Practices:**

**For Importance:** Use <strong> (not <b>)
- Example: "This is <strong>very important</strong> information."
- Screen readers will emphasize this
- Search engines will note this as important

**For Emphasis:** Use <em> (not <i>)
- Example: "I <em>really</em> mean it."
- Changes the meaning of the sentence
- Screen readers will add vocal emphasis

**For Alternate Voice:** Use <i> when appropriate
- Technical terms: "The <i>Homo sapiens</i> species..."
- Foreign phrases: "The phrase <i>carpe diem</i> means..."
- Thoughts: "<i>I wonder if this will work</i>, she thought."

**For Highlighting:** Use <mark>
- Highlighting search results
- Highlighting relevant passages
- Drawing attention to specific text

**For Deletions/Insertions:** Use <del> and <ins>
- Show document changes
- Track edits in collaborative documents
- Display price changes: <del>$99</del> <ins>$79</ins>

**Code and Preformatted Text:**

<code> for inline code: "Use the <code>console.log()</code> function"
<pre><code> for code blocks: preserves whitespace and line breaks
<kbd> for keyboard input: "Press <kbd>Ctrl</kbd>+<kbd>C</kbd>"
<samp> for sample output: "The program returned <samp>Error 404</samp>"
<var> for variables: "The value of <var>x</var> is 10"

**Quotations:**

<blockquote> for long quotations (block-level)
- Use cite attribute for source URL
- Use <footer> and <cite> for attribution

<q> for short inline quotations
- Browsers automatically add quotation marks
- Use cite attribute for source URL

<cite> for titles of works
- Books, movies, songs, articles, etc.
- "I love <cite>The Great Gatsby</cite>"

**Abbreviations and Definitions:**

<abbr> with title attribute explains abbreviations
- Hover shows full text
- Screen readers can announce full text
- Example: <abbr title="HyperText Markup Language">HTML</abbr>

<dfn> marks the defining instance of a term
- First time you define a term in a document
- Example: <dfn>Semantic HTML</dfn> means using elements that describe their meaning.

**Subscript and Superscript:**

<sub> for subscript: H<sub>2</sub>O (water formula)
<sup> for superscript: E=mc<sup>2</sup> (Einstein's equation)

**Line Breaks and Horizontal Rules:**

<br> creates a line break
- Use sparingly - usually paragraphs are better
- Appropriate for addresses, poems

<hr> creates a thematic break
- Represents a shift in topic
- Not just a visual line - has semantic meaning`,
      code: `<!-- ============================================ -->
<!-- SEMANTIC TEXT FORMATTING - COMPREHENSIVE EXAMPLES -->
<!-- ============================================ -->

<!-- Headings - Document Outline -->
<article>
  <h1>Complete Guide to Web Development</h1>
  <!-- Main topic of the page -->
  
  <section>
    <h2>Frontend Development</h2>
    <!-- Major section -->
    
    <h3>HTML Fundamentals</h3>
    <!-- Subsection of Frontend -->
    
    <h4>Semantic Elements</h4>
    <!-- Sub-subsection -->
    
    <h5>Header Element</h5>
    <!-- Even more specific -->
    
    <h6>Best Practices</h6>
    <!-- Most specific level -->
  </section>
  
  <section>
    <h2>Backend Development</h2>
    <!-- Another major section at same level as Frontend -->
  </section>
</article>

<!-- ============================================ -->
<!-- IMPORTANCE AND EMPHASIS -->
<!-- ============================================ -->

<!-- Strong importance (semantic) -->
<p>
  <strong>Warning:</strong> This action cannot be undone.
</p>
<!-- Screen reader will emphasize "Warning" -->

<!-- Bold (presentational only) -->
<p>
  <b>Product Name:</b> Widget Pro 3000
</p>
<!-- Just visual styling, no semantic meaning -->

<!-- Emphasis (semantic) -->
<p>
  I <em>really</em> need you to understand this.
</p>
<!-- Changes meaning - "really" is emphasized -->

<!-- Italic (presentational) -->
<p>
  The term <i>algorithm</i> comes from the name of a Persian mathematician.
</p>
<!-- Technical term in alternate voice -->

<!-- Combining strong and emphasis -->
<p>
  This is <strong><em>extremely critical</em></strong> information.
</p>
<!-- Both strong importance AND emphasis -->

<!-- ============================================ -->
<!-- HIGHLIGHTING AND MARKING -->
<!-- ============================================ -->

<!-- Mark for highlighting -->
<p>
  Search results for "HTML":
  <mark>HTML</mark> is the standard markup language for web pages.
</p>
<!-- Highlights search term in results -->

<!-- Mark for relevance -->
<article>
  <p>
    The <mark>deadline for submissions</mark> is approaching.
    Please ensure all documents are ready.
  </p>
</article>

<!-- ============================================ -->
<!-- DELETIONS AND INSERTIONS -->
<!-- ============================================ -->

<!-- Price change -->
<p class="price">
  Regular price: <del>$99.99</del>
  <ins>Sale price: $79.99</ins>
</p>

<!-- Document edits -->
<p>
  The meeting is scheduled for
  <del datetime="2026-04-20T10:00:00Z">Monday</del>
  <ins datetime="2026-04-21T14:30:00Z">Tuesday</ins>
  at 2:00 PM.
</p>
<!-- datetime attributes track when changes were made -->

<!-- ============================================ -->
<!-- CODE AND TECHNICAL CONTENT -->
<!-- ============================================ -->

<!-- Inline code -->
<p>
  To print to console, use the <code>console.log()</code> function.
</p>

<!-- Code block with syntax highlighting -->
<pre><code class="language-javascript">
// Calculate factorial recursively
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120
</code></pre>
<!-- class="language-javascript" helps syntax highlighters -->

<!-- Keyboard input -->
<p>
  To save the file, press <kbd>Ctrl</kbd>+<kbd>S</kbd> on Windows
  or <kbd>Cmd</kbd>+<kbd>S</kbd> on Mac.
</p>

<!-- Sample output -->
<p>
  The program returned: <samp>Error 404: File not found</samp>
</p>

<!-- Variables -->
<p>
  If <var>x</var> = 10 and <var>y</var> = 5,
  then <var>x</var> + <var>y</var> = 15.
</p>

<!-- ============================================ -->
<!-- QUOTATIONS -->
<!-- ============================================ -->

<!-- Long quotation (block-level) -->
<blockquote cite="https://www.w3.org/standards/webdesign/htmlcss">
  <p>
    HTML and CSS are the fundamental technologies for building web pages:
    HTML provides the structure, CSS the visual and aural layout.
  </p>
  <footer>
    — <cite>W3C Web Design Standards</cite>
  </footer>
</blockquote>

<!-- Short inline quotation -->
<p>
  As Tim Berners-Lee said,
  <q cite="https://example.com/quote">
    The web is more a social creation than a technical one.
  </q>
</p>
<!-- Browsers automatically add quotation marks -->

<!-- Citing works -->
<p>
  My favorite book is <cite>The Pragmatic Programmer</cite>
  by Andrew Hunt and David Thomas.
</p>

<!-- ============================================ -->
<!-- ABBREVIATIONS AND DEFINITIONS -->
<!-- ============================================ -->

<!-- Abbreviation with explanation -->
<p>
  <abbr title="HyperText Markup Language">HTML</abbr> is the standard
  markup language for creating web pages.
</p>
<!-- Hover shows "HyperText Markup Language" -->

<!-- Multiple abbreviations -->
<p>
  <abbr title="Cascading Style Sheets">CSS</abbr> works with
  <abbr title="HyperText Markup Language">HTML</abbr> to style web pages.
</p>

<!-- Definition -->
<p>
  <dfn id="semantic-html">Semantic HTML</dfn> is the practice of using
  HTML elements that convey meaning about the content they contain,
  not just how they should look.
</p>
<!-- First definition of the term in document -->

<!-- Referencing a definition -->
<p>
  As we discussed earlier, <a href="#semantic-html">semantic HTML</a>
  is crucial for accessibility.
</p>

<!-- ============================================ -->
<!-- SUBSCRIPT AND SUPERSCRIPT -->
<!-- ============================================ -->

<!-- Chemical formulas -->
<p>
  Water is H<sub>2</sub>O.
  Carbon dioxide is CO<sub>2</sub>.
</p>

<!-- Mathematical expressions -->
<p>
  Einstein's famous equation: E=mc<sup>2</sup>
</p>

<!-- Footnotes -->
<p>
  This statement requires citation<sup>1</sup>.
</p>

<!-- Ordinal numbers -->
<p>
  She finished in 1<sup>st</sup> place.
</p>

<!-- ============================================ -->
<!-- SMALL TEXT AND FINE PRINT -->
<!-- ============================================ -->

<!-- Legal text -->
<p>
  <small>
    &copy; 2026 Company Name. All rights reserved.
    Terms and conditions apply.
  </small>
</p>

<!-- Side comments -->
<p>
  The price is $99.99
  <small>(plus applicable taxes)</small>
</p>

<!-- ============================================ -->
<!-- LINE BREAKS AND HORIZONTAL RULES -->
<!-- ============================================ -->

<!-- Address with line breaks -->
<address>
  John Doe<br>
  123 Main Street<br>
  Anytown, ST 12345<br>
  <a href="mailto:john@example.com">john@example.com</a>
</address>

<!-- Poem with line breaks -->
<p>
  Roses are red,<br>
  Violets are blue,<br>
  HTML is semantic,<br>
  And so should you.
</p>

<!-- Thematic break -->
<section>
  <h2>Chapter 1</h2>
  <p>Content of chapter 1...</p>
</section>

<hr>
<!-- Represents transition to new topic -->

<section>
  <h2>Chapter 2</h2>
  <p>Content of chapter 2...</p>
</section>

<!-- ============================================ -->
<!-- ADVANCED: RUBY ANNOTATIONS (for East Asian typography) -->
<!-- ============================================ -->

<!-- Japanese with pronunciation guide -->
<ruby>
  漢字 <rp>(</rp><rt>かんじ</rt><rp>)</rp>
</ruby>
<!-- Shows pronunciation above characters -->

<!-- ============================================ -->
<!-- ADVANCED: BDI AND BDO (for bidirectional text) -->
<!-- ============================================ -->

<!-- Bidirectional isolation -->
<p>
  User <bdi>إيان</bdi> scored 90 points.
</p>
<!-- Isolates Arabic text from surrounding left-to-right text -->

<!-- Bidirectional override -->
<p>
  <bdo dir="rtl">This text will display right-to-left</bdo>
</p>`,
      tip: "Use semantic elements consistently. If you use <strong> for warnings, always use <strong> for warnings - don't switch to <b>. Consistency helps screen reader users understand your content patterns.",
      keyPoints: [
        "Semantic elements (<strong>, <em>) describe meaning, presentational elements (<b>, <i>) describe appearance",
        "Screen readers announce <strong> with emphasis, but <b> is read normally",
        "Use only one <h1> per page - it's the main topic for SEO and accessibility",
        "Never skip heading levels (h1→h2→h3, not h1→h3) - breaks document outline",
        "<code> for inline code, <pre><code> for code blocks with preserved formatting",
        "<blockquote> for long quotes with cite attribute, <q> for inline quotes",
        "<abbr> with title attribute explains abbreviations on hover and to screen readers",
        "<mark> highlights text for reference (like search results highlighting)",
        "<del> and <ins> show document changes with optional datetime attributes",
        "<kbd> for keyboard input, <samp> for program output, <var> for variables",
        "<small> for fine print and legal text, not just for making text smaller",
        "<br> for line breaks (use sparingly), <hr> for thematic breaks between sections"
      ],
    },
  ],
  quiz: [
    { q: "What is the primary purpose of semantic HTML?", options: ["Make pages load faster", "Provide meaning to content structure for browsers and assistive technologies", "Add visual styling", "Reduce code size"], answer: 1 },
    { q: "Why should you use <strong> instead of <b> for important text?", options: ["<strong> is shorter", "<strong> has semantic meaning that screen readers and search engines understand", "<b> is deprecated", "<strong> makes text bigger"], answer: 1 },
    { q: "How many <h1> elements should a page have for optimal SEO?", options: ["As many as needed", "One per section", "Exactly one", "None"], answer: 2 },
    { q: "What does the lang attribute on <html> do?", options: ["Changes page language", "Helps screen readers pronounce content correctly and aids translation tools", "Sets text direction", "Enables multilingual support"], answer: 1 },
    { q: "Which element should you use for a block of code?", options: ["<code>", "<pre><code>", "<script>", "<program>"], answer: 1 },
    { q: "What is the purpose of the alt attribute on images?", options: ["Add a tooltip", "Provide alternative text for screen readers and when images fail to load", "Name the image file", "Add a caption"], answer: 1 },
    { q: "Which element represents a self-contained composition that could be distributed independently?", options: ["<section>", "<div>", "<article>", "<content>"], answer: 2 },
    { q: "What does the viewport meta tag do?", options: ["Adds animations", "Controls how the page scales on mobile devices", "Sets page width", "Enables responsive images"], answer: 1 },
    { q: "Which element should contain the main navigation links?", options: ["<menu>", "<nav>", "<links>", "<navigation>"], answer: 1 },
    { q: "What is the difference between <em> and <i>?", options: ["No difference", "<em> has semantic emphasis meaning, <i> is presentational italic", "<i> is deprecated", "<em> is for errors"], answer: 1 },
  ],
};

// Export function
export function getComprehensiveContent(moduleName: string): ModuleContent {
  return HTML_COMPREHENSIVE;
}
