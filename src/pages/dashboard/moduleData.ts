export interface ModuleNote {
  heading: string;
  body: string;
  code?: string;
  tip?: string;
  keyPoints?: string[];
}
export interface ModuleQuiz { q: string; options: string[]; answer: number; }
export interface ModuleContent { notes: ModuleNote[]; quiz: ModuleQuiz[]; }

// Import comprehensive content
import { HTML_COMPREHENSIVE } from './comprehensiveModuleData';

const HTML: ModuleContent = HTML_COMPREHENSIVE;


const CSS: ModuleContent = {
  notes: [
    {
      heading: "1. What is CSS & How It Works",
      body: "CSS (Cascading Style Sheets) controls the visual presentation of HTML. 'Cascading' means styles flow down — later rules override earlier ones. CSS can be written inline (style attribute), internal (<style> tag in <head>), or external (separate .css file linked with <link>). External CSS is best practice for maintainability.",
      code: `/* External CSS (best practice) */\n/* style.css */\nbody {\n  font-family: 'Poppins', sans-serif;\n  background-color: #f8f9fa;\n  margin: 0;\n  padding: 0;\n}\n\nh1 {\n  color: #6c63ff;\n  font-size: 2rem;\n}`,
      tip: "Always use external CSS files for real projects. Inline styles are hard to maintain and override.",
      keyPoints: ["CSS = Cascading Style Sheets", "Inline > Internal > External (specificity order)", "External CSS is best for maintainability", "CSS rules: selector { property: value; }"],
    },
    {
      heading: "2. Selectors & Specificity",
      body: "Selectors target which HTML elements to style. Element selectors (p) target all paragraphs. Class selectors (.btn) target elements with that class. ID selectors (#header) target a unique element. Specificity determines which rule wins when multiple rules apply: ID (100) > Class (10) > Element (1).",
      code: `/* Element selector */\np { color: gray; }\n\n/* Class selector */\n.highlight { background: yellow; }\n\n/* ID selector */\n#hero { font-size: 3rem; }\n\n/* Descendant selector */\n.card p { font-size: 14px; }\n\n/* Pseudo-class */\na:hover { color: purple; }\n\n/* Pseudo-element */\np::first-line { font-weight: bold; }`,
      tip: "Avoid using IDs for styling — they're too specific and hard to override. Stick to classes.",
      keyPoints: ["Element: p, h1, div (specificity: 1)", "Class: .name (specificity: 10)", "ID: #name (specificity: 100)", "!important overrides everything — use sparingly"],
    },
    {
      heading: "3. The Box Model",
      body: "Every HTML element is a rectangular box. The box model has 4 layers from inside out: Content (actual text/image), Padding (space inside the border), Border (the edge line), Margin (space outside the border). By default, width/height only applies to content. Use box-sizing: border-box to include padding and border in the total size.",
      code: `.card {\n  width: 300px;\n  padding: 20px;        /* space inside */\n  border: 2px solid #ccc; /* edge */\n  margin: 16px;         /* space outside */\n  box-sizing: border-box; /* width includes padding+border */\n}\n\n/* Global reset (recommended) */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}`,
      tip: "Always add box-sizing: border-box to * at the top of your CSS — it makes sizing predictable.",
      keyPoints: ["Content → Padding → Border → Margin", "box-sizing: border-box is essential", "margin: auto centers block elements", "padding adds space inside, margin outside"],
    },
    {
      heading: "4. Flexbox Layout",
      body: "Flexbox is a 1D layout system (row OR column). Apply display: flex to a container and its children become flex items. justify-content aligns items along the main axis. align-items aligns along the cross axis. flex-wrap allows items to wrap to the next line. gap adds space between items.",
      code: `.navbar {\n  display: flex;\n  justify-content: space-between; /* main axis */\n  align-items: center;            /* cross axis */\n  gap: 16px;\n  padding: 12px 24px;\n}\n\n/* Center anything */\n.centered {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n/* Flex child grows to fill space */\n.main-content {\n  flex: 1;\n}`,
      tip: "Flexbox is perfect for navbars, card rows, and centering. For full page layouts, use Grid.",
      keyPoints: ["display: flex on parent", "justify-content = main axis alignment", "align-items = cross axis alignment", "flex: 1 makes item fill available space"],
    },
    {
      heading: "5. CSS Grid & Responsive Design",
      body: "CSS Grid is a 2D layout system (rows AND columns). Define a grid with grid-template-columns. The fr unit distributes available space. Media queries apply different styles at different screen sizes — the foundation of responsive design.",
      code: `/* Grid layout */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n}\n\n/* Responsive: 1 column on mobile */\n@media (max-width: 768px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n/* Span multiple columns */\n.featured {\n  grid-column: span 2;\n}`,
      tip: "Use fr units instead of percentages in Grid — they automatically account for gaps.",
      keyPoints: ["display: grid on parent", "grid-template-columns defines column sizes", "fr = fractional unit of available space", "@media queries enable responsive design"],
    },
  ],
  quiz: [
    { q: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "foreground"], answer: 2 },
    { q: "What does the box model include (inside to outside)?", options: ["Content, padding, border, margin", "Width and height only", "Font and color", "Display and position"], answer: 0 },
    { q: "Which value of display creates a flex container?", options: ["block", "inline", "flex", "grid"], answer: 2 },
    { q: "Which property controls spacing inside an element?", options: ["margin", "padding", "border", "gap"], answer: 1 },
  ],
};

const JAVASCRIPT: ModuleContent = {
  notes: [
    {
      heading: "1. Variables, Data Types & Operators",
      body: "JavaScript has 3 ways to declare variables: var (old, avoid), let (block-scoped, reassignable), const (block-scoped, fixed reference). There are 7 primitive types: string, number, bigint, boolean, undefined, null, symbol. Objects and arrays are reference types. Use typeof to check a value's type.",
      code: `// Variable declarations\nconst name = "Alice";       // string\nlet age = 25;               // number\nlet isLoggedIn = true;      // boolean\nlet score = null;           // null (intentional empty)\nlet result;                 // undefined (not assigned)\n\n// Template literals (backticks)\nconsole.log(\`Hello, \${name}! You are \${age} years old.\`);\n\n// Type checking\nconsole.log(typeof name);   // "string"\nconsole.log(typeof age);    // "number"\n\n// Operators\nconst sum = 10 + 5;         // 15\nconst isAdult = age >= 18;  // true\nconst greeting = age > 18 ? "Adult" : "Minor"; // ternary`,
      tip: "Always use const by default. Only use let when you need to reassign. Never use var.",
      keyPoints: ["const = fixed, let = reassignable, var = avoid", "7 primitive types in JavaScript", "Template literals use backticks and ${}", "=== checks value AND type (use over ==)"],
    },
    {
      heading: "2. Functions & Scope",
      body: "Functions are reusable blocks of code. JavaScript has function declarations, function expressions, and arrow functions. Scope determines where variables are accessible: global scope (everywhere), function scope (inside function), block scope (inside {} with let/const). Closures allow inner functions to access outer variables.",
      code: `// Function declaration (hoisted)\nfunction greet(name = "World") {\n  return \`Hello, \${name}!\`;\n}\n\n// Arrow function (concise)\nconst add = (a, b) => a + b;\n\n// Arrow with body\nconst multiply = (a, b) => {\n  const result = a * b;\n  return result;\n};\n\n// Higher-order function\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);  // [2,4,6,8,10]\nconst evens = numbers.filter(n => n % 2 === 0); // [2,4]\nconst total = numbers.reduce((sum, n) => sum + n, 0); // 15`,
      tip: "Arrow functions don't have their own 'this' — use them for callbacks. Use regular functions for methods.",
      keyPoints: ["Function declarations are hoisted", "Arrow functions: const fn = () => {}", "Default parameters: function(x = 0)", "map/filter/reduce are essential array methods"],
    },
    {
      heading: "3. Arrays & Objects",
      body: "Arrays store ordered lists. Objects store key-value pairs. Both are reference types — assigning them copies the reference, not the value. Use spread (...) to copy. Destructuring extracts values cleanly. Optional chaining (?.) safely accesses nested properties.",
      code: `// Arrays\nconst fruits = ["apple", "banana", "cherry"];\nfruits.push("date");           // add to end\nfruits.pop();                  // remove from end\nconst first = fruits[0];       // "apple"\nconst [a, b, ...rest] = fruits; // destructuring\n\n// Objects\nconst user = {\n  name: "Alice",\n  age: 25,\n  address: { city: "Mumbai" }\n};\nconst { name, age } = user;    // destructuring\nconst city = user.address?.city; // optional chaining\n\n// Spread (copy without mutation)\nconst newUser = { ...user, age: 26 };\nconst newFruits = [...fruits, "elderberry"];`,
      tip: "Never mutate objects/arrays directly in React. Always create a new copy with spread operator.",
      keyPoints: ["Arrays: ordered, index-based access", "Objects: key-value pairs, dot/bracket access", "Spread (...) creates shallow copies", "Optional chaining (?.) prevents null errors"],
    },
    {
      heading: "4. DOM Manipulation",
      body: "The DOM (Document Object Model) is a tree representation of your HTML that JavaScript can read and modify. You can select elements, change their content/styles, add/remove classes, and listen for user events. This is how JavaScript makes pages interactive.",
      code: `// Selecting elements\nconst btn = document.querySelector("#myBtn");\nconst items = document.querySelectorAll(".item");\n\n// Changing content\nbtn.textContent = "Click Me";\nbtn.innerHTML = "<strong>Click</strong>";\n\n// Changing styles & classes\nbtn.style.backgroundColor = "blue";\nbtn.classList.add("active");\nbtn.classList.toggle("hidden");\n\n// Creating elements\nconst li = document.createElement("li");\nli.textContent = "New Item";\ndocument.querySelector("ul").appendChild(li);\n\n// Event listeners\nbtn.addEventListener("click", (e) => {\n  console.log("Clicked!", e.target);\n  e.preventDefault(); // stop default behavior\n});`,
      tip: "Use querySelector (CSS selector syntax) over getElementById — it's more flexible and consistent.",
      keyPoints: ["querySelector returns first match", "querySelectorAll returns NodeList", "classList.add/remove/toggle for classes", "addEventListener for all user interactions"],
    },
    {
      heading: "5. Async JavaScript & Fetch API",
      body: "JavaScript is single-threaded but handles async operations (API calls, timers) without blocking. Promises represent future values. async/await makes async code look synchronous. The Fetch API makes HTTP requests. Always handle errors with try/catch.",
      code: `// Fetch with async/await\nconst getUser = async (id) => {\n  try {\n    const response = await fetch(\`https://api.example.com/users/\${id}\`);\n    \n    if (!response.ok) {\n      throw new Error(\`HTTP error! status: \${response.status}\`);\n    }\n    \n    const data = await response.json();\n    console.log(data);\n    return data;\n  } catch (error) {\n    console.error("Failed to fetch user:", error);\n  }\n};\n\n// Parallel requests\nconst [users, posts] = await Promise.all([\n  fetch("/api/users").then(r => r.json()),\n  fetch("/api/posts").then(r => r.json()),\n]);`,
      tip: "Always use try/catch with async/await. A rejected promise without catch will crash your app.",
      keyPoints: ["async functions always return a Promise", "await pauses execution until Promise resolves", "fetch() returns a Promise", "Promise.all() runs multiple requests in parallel"],
    },
  ],
  quiz: [
    { q: "Which keyword declares a constant in JS?", options: ["var", "let", "const", "def"], answer: 2 },
    { q: "What does typeof 42 return?", options: ["'integer'", "'number'", "'int'", "'float'"], answer: 1 },
    { q: "Which array method creates a new filtered array?", options: ["map()", "forEach()", "filter()", "reduce()"], answer: 2 },
    { q: "How do you select an element by ID?", options: ["document.getElement('id')", "document.querySelector('#id')", "document.find('#id')", "document.select('id')"], answer: 1 },
  ],
};

const REACT: ModuleContent = {
  notes: [
    {
      heading: "1. What is React & Why Use It?",
      body: "React is a JavaScript library for building user interfaces using reusable components. Instead of manually updating the DOM, you describe what the UI should look like and React efficiently updates only what changed using a Virtual DOM. React uses a component-based architecture — break your UI into small, reusable pieces.",
      code: `// Without React (manual DOM)\ndocument.getElementById("count").textContent = count;\n\n// With React (declarative)\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}`,
      tip: "React is declarative — you describe WHAT the UI should look like, not HOW to update it.",
      keyPoints: ["Component-based architecture", "Virtual DOM for efficient updates", "Declarative: describe UI, React handles updates", "One-way data flow (parent → child)"],
    },
    {
      heading: "2. JSX — JavaScript + HTML",
      body: "JSX (JavaScript XML) lets you write HTML-like syntax inside JavaScript. It compiles to React.createElement() calls. JSX expressions go in curly braces {}. You must return a single root element (use <> fragments to avoid extra divs). JSX attributes use camelCase: className instead of class, onClick instead of onclick.",
      code: `// JSX compiles to:\n// React.createElement('h1', {className: 'title'}, 'Hello')\nconst element = <h1 className="title">Hello</h1>;\n\n// Expressions in JSX\nconst name = "Alice";\nconst el = <p>Hello, {name.toUpperCase()}!</p>;\n\n// Conditional rendering\nconst isLoggedIn = true;\nconst ui = (\n  <div>\n    {isLoggedIn ? <Dashboard /> : <Login />}\n    {isLoggedIn && <UserMenu />}\n  </div>\n);\n\n// Lists (always need key)\nconst items = ["a", "b", "c"];\nconst list = (\n  <ul>\n    {items.map((item, i) => (\n      <li key={i}>{item}</li>\n    ))}\n  </ul>\n);`,
      tip: "Always add a unique key prop when rendering lists — React uses it to track which items changed.",
      keyPoints: ["JSX = JavaScript + HTML syntax", "Use className (not class), htmlFor (not for)", "Expressions in {} — not statements", "Fragments <> avoid unnecessary wrapper divs"],
    },
    {
      heading: "3. Props — Passing Data to Components",
      body: "Props (properties) are how parent components pass data to child components. They are read-only — a child should never modify its props. Props can be any JavaScript value: strings, numbers, arrays, objects, functions, or even other components. Destructure props for cleaner code.",
      code: `// Parent passes props\nfunction App() {\n  return (\n    <UserCard\n      name="Alice"\n      age={25}\n      isAdmin={true}\n      onLogout={() => console.log("logout")}\n    />\n  );\n}\n\n// Child receives and uses props\nfunction UserCard({ name, age, isAdmin, onLogout }) {\n  return (\n    <div className="card">\n      <h2>{name}</h2>\n      <p>Age: {age}</p>\n      {isAdmin && <span className="badge">Admin</span>}\n      <button onClick={onLogout}>Logout</button>\n    </div>\n  );\n}\n\n// Default props\nfunction Button({ label = "Click Me", variant = "primary" }) {\n  return <button className={variant}>{label}</button>;\n}`,
      tip: "If you find yourself passing props through many levels, consider using Context API instead.",
      keyPoints: ["Props flow one-way: parent → child", "Props are read-only (immutable)", "Destructure props for cleaner syntax", "Functions can be passed as props (callbacks)"],
    },
    {
      heading: "4. State & Hooks",
      body: "State is local data that a component manages. When state changes, React re-renders the component. useState returns [value, setter]. useEffect runs side effects after render. The dependency array controls when it runs: [] = once on mount, [dep] = when dep changes, no array = every render.",
      code: `import { useState, useEffect } from 'react';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    // Runs when userId changes\n    const fetchUser = async () => {\n      try {\n        setLoading(true);\n        const res = await fetch(\`/api/users/\${userId}\`);\n        const data = await res.json();\n        setUser(data);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    };\n    fetchUser();\n\n    // Cleanup function\n    return () => { /* cancel requests if needed */ };\n  }, [userId]); // re-runs when userId changes\n\n  if (loading) return <Spinner />;\n  if (error) return <Error message={error} />;\n  return <div>{user?.name}</div>;\n}`,
      tip: "Never update state directly (user.name = 'x'). Always use the setter function to trigger re-render.",
      keyPoints: ["useState: const [val, setVal] = useState(init)", "State updates trigger re-renders", "useEffect for API calls, subscriptions, timers", "Cleanup function prevents memory leaks"],
    },
    {
      heading: "5. Component Patterns & Best Practices",
      body: "Good React code is organized into small, focused components. Lift state up when multiple components need the same data. Use custom hooks to share logic. Keep components pure — same props should always produce same output. Avoid side effects in render.",
      code: `// Custom hook — reusable logic\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url)\n      .then(r => r.json())\n      .then(d => { setData(d); setLoading(false); });\n  }, [url]);\n\n  return { data, loading };\n}\n\n// Usage\nfunction Posts() {\n  const { data: posts, loading } = useFetch('/api/posts');\n  if (loading) return <p>Loading...</p>;\n  return posts.map(p => <PostCard key={p.id} post={p} />);\n}\n\n// Lifting state up\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  return (\n    <>\n      <Display count={count} />\n      <Controls onIncrement={() => setCount(c => c + 1)} />\n    </>\n  );\n}`,
      tip: "Custom hooks (useXxx) are the best way to share stateful logic between components without prop drilling.",
      keyPoints: ["Lift state to the nearest common ancestor", "Custom hooks start with 'use'", "Keep components small and focused", "Prefer composition over inheritance"],
    },
  ],
  quiz: [
    { q: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], answer: 0 },
    { q: "Which hook manages local state?", options: ["useEffect", "useRef", "useState", "useContext"], answer: 2 },
    { q: "How do you pass data to a child component?", options: ["State", "Props", "Context only", "Redux only"], answer: 1 },
    { q: "What does useEffect with [] dependency do?", options: ["Runs on every render", "Runs once on mount", "Runs on unmount only", "Never runs"], answer: 1 },
  ],
};

const NODE: ModuleContent = {
  notes: [
    {
      heading: "1. Node.js Fundamentals",
      body: "Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser — on servers, CLIs, and desktop apps. It's event-driven and non-blocking, meaning it can handle thousands of concurrent connections without creating a new thread for each one.",
      code: `// hello.js — run with: node hello.js\nconsole.log("Hello from Node.js!");\n\n// Built-in modules\nconst fs = require('fs');\nconst path = require('path');\nconst os = require('os');\n\n// Read a file\nfs.readFile('data.txt', 'utf8', (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});\n\n// Async version\nconst data = await fs.promises.readFile('data.txt', 'utf8');\nconsole.log(data);\n\nconsole.log("Platform:", os.platform());\nconsole.log("CPU cores:", os.cpus().length);`,
      tip: "Node.js uses CommonJS (require/module.exports) by default. Use .mjs or 'type: module' in package.json for ES modules.",
      keyPoints: ["Node.js = JavaScript on the server", "Non-blocking I/O — handles many connections", "Built-in modules: fs, path, http, os, crypto", "npm = Node Package Manager"],
    },
    {
      heading: "2. Express.js — Building Web Servers",
      body: "Express is the most popular Node.js web framework. It provides routing, middleware, and request/response handling. A route matches an HTTP method + URL path and runs a handler function. req contains request data, res is used to send responses.",
      code: `const express = require('express');\nconst app = express();\n\n// Parse JSON bodies\napp.use(express.json());\n\n// Routes\napp.get('/', (req, res) => {\n  res.json({ message: 'API is running' });\n});\n\napp.get('/users/:id', (req, res) => {\n  const { id } = req.params;  // URL parameter\n  res.json({ userId: id });\n});\n\napp.post('/users', (req, res) => {\n  const { name, email } = req.body;  // Request body\n  // Save to database...\n  res.status(201).json({ name, email });\n});\n\napp.delete('/users/:id', (req, res) => {\n  res.status(204).send();\n});\n\napp.listen(3000, () => console.log('Server on port 3000'));`,
      tip: "Use HTTP status codes correctly: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.",
      keyPoints: ["app.get/post/put/delete for routes", "req.params = URL params (:id)", "req.body = POST/PUT body data", "req.query = query string (?key=value)"],
    },
    {
      heading: "3. Middleware",
      body: "Middleware functions run between the request and response. They have access to req, res, and next(). Call next() to pass control to the next middleware. Middleware can: parse bodies, authenticate users, log requests, handle errors, serve static files.",
      code: `// Logger middleware\nconst logger = (req, res, next) => {\n  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);\n  next(); // MUST call next() or request hangs\n};\n\n// Auth middleware\nconst authenticate = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'No token' });\n  // verify token...\n  req.user = decodedUser;\n  next();\n};\n\n// Apply globally\napp.use(logger);\napp.use(express.json());\n\n// Apply to specific route\napp.get('/profile', authenticate, (req, res) => {\n  res.json(req.user);\n});\n\n// Error handling middleware (4 params)\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: err.message });\n});`,
      tip: "Error handling middleware must have 4 parameters (err, req, res, next) — Express identifies it by the 4th param.",
      keyPoints: ["Middleware = function(req, res, next)", "Always call next() unless sending response", "Order matters — middleware runs top to bottom", "Error middleware has 4 params"],
    },
    {
      heading: "4. REST API Design",
      body: "REST (Representational State Transfer) is an architectural style for APIs. Resources are nouns (users, posts). HTTP methods are verbs (GET, POST, PUT, DELETE). URLs should be clean and hierarchical. Always return consistent JSON responses with appropriate status codes.",
      code: `// RESTful routes for 'posts' resource\n// GET    /posts          → list all posts\n// GET    /posts/:id      → get one post\n// POST   /posts          → create post\n// PUT    /posts/:id      → replace post\n// PATCH  /posts/:id      → update post fields\n// DELETE /posts/:id      → delete post\n\n// Consistent response format\nconst sendSuccess = (res, data, status = 200) => {\n  res.status(status).json({ success: true, data });\n};\n\nconst sendError = (res, message, status = 400) => {\n  res.status(status).json({ success: false, error: message });\n};\n\n// Example\napp.get('/posts', async (req, res) => {\n  try {\n    const posts = await Post.findAll();\n    sendSuccess(res, posts);\n  } catch (err) {\n    sendError(res, err.message, 500);\n  }\n});`,
      tip: "Use plural nouns for resource URLs (/users not /user). Never use verbs in URLs (/getUsers is wrong).",
      keyPoints: ["Resources = nouns, Methods = verbs", "GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove", "Use proper HTTP status codes", "Keep URLs clean: /users/:id/posts"],
    },
    {
      heading: "5. Async Node.js & Database Integration",
      body: "Node.js excels at async operations. Use async/await for clean code. Connect to databases (PostgreSQL, MongoDB, Supabase) using client libraries. Always handle connection errors and use environment variables for credentials — never hardcode secrets.",
      code: `// Environment variables\nrequire('dotenv').config();\nconst DB_URL = process.env.DATABASE_URL;\n\n// Async route with error handling\napp.get('/users', async (req, res, next) => {\n  try {\n    const { rows } = await db.query('SELECT * FROM users');\n    res.json(rows);\n  } catch (err) {\n    next(err); // pass to error middleware\n  }\n});\n\n// Parallel async operations\napp.get('/dashboard', async (req, res) => {\n  const [users, posts, stats] = await Promise.all([\n    db.query('SELECT COUNT(*) FROM users'),\n    db.query('SELECT COUNT(*) FROM posts'),\n    db.query('SELECT AVG(score) FROM quiz_attempts'),\n  ]);\n  res.json({ users: users.rows[0], posts: posts.rows[0] });\n});`,
      tip: "Store all secrets in .env files and add .env to .gitignore. Never commit API keys or passwords to git.",
      keyPoints: ["Use dotenv for environment variables", "async/await for all database calls", "Promise.all() for parallel queries", "Always pass errors to next(err)"],
    },
  ],
  quiz: [
    { q: "What is Node.js built on?", options: ["SpiderMonkey", "V8 Engine", "JavaVM", "Chakra"], answer: 1 },
    { q: "Which HTTP method is used to create a resource?", options: ["GET", "DELETE", "PUT", "POST"], answer: 3 },
    { q: "What does middleware do?", options: ["Renders HTML", "Runs between request and response", "Manages database", "Handles CSS"], answer: 1 },
    { q: "How do you parse JSON bodies in Express?", options: ["app.use(express.json())", "app.parse('json')", "req.json()", "express.parseJSON()"], answer: 0 },
  ],
};

const ARRAYS: ModuleContent = {
  notes: [
    {
      heading: "1. Arrays — Basics & Complexity",
      body: "An array is a contiguous block of memory storing elements of the same type. Access by index is O(1) — instant. Insertion/deletion at the end is O(1) amortized. But insertion/deletion in the middle is O(n) because all subsequent elements must shift. Understanding this helps you choose the right data structure.",
      code: `// Array operations and their complexity\nconst arr = [10, 20, 30, 40, 50];\n\n// O(1) — direct index access\nconsole.log(arr[2]);        // 30\n\n// O(1) amortized — add/remove at end\narr.push(60);               // [10,20,30,40,50,60]\narr.pop();                  // [10,20,30,40,50]\n\n// O(n) — add/remove at beginning (shifts all)\narr.unshift(0);             // [0,10,20,30,40,50]\narr.shift();                // [10,20,30,40,50]\n\n// O(n) — search\nconst idx = arr.indexOf(30); // 2\nconst found = arr.includes(30); // true\n\n// O(n) — slice creates new array\nconst sub = arr.slice(1, 3); // [20, 30]`,
      tip: "If you need frequent insertions at the beginning, consider a linked list or deque instead of an array.",
      keyPoints: ["Access by index: O(1)", "Push/pop (end): O(1) amortized", "Shift/unshift (beginning): O(n)", "Search (unsorted): O(n)"],
    },
    {
      heading: "2. Two-Pointer Technique",
      body: "Two pointers is a pattern where you use two indices to traverse an array, often from both ends or at different speeds. It reduces O(n²) brute force solutions to O(n). Common problems: pair sum in sorted array, removing duplicates, reversing, container with most water.",
      code: `// Problem: Find pair that sums to target in sorted array\nfunction twoSum(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;   // need bigger sum\n    else right--;               // need smaller sum\n  }\n  return [];\n}\n// twoSum([1,2,3,4,6], 6) → [1,3] (2+4=6)\n\n// Problem: Remove duplicates in-place\nfunction removeDuplicates(arr) {\n  let slow = 0;\n  for (let fast = 1; fast < arr.length; fast++) {\n    if (arr[fast] !== arr[slow]) {\n      slow++;\n      arr[slow] = arr[fast];\n    }\n  }\n  return slow + 1; // new length\n}`,
      tip: "Two pointers only works on sorted arrays for pair-sum problems. Sort first if needed: O(n log n).",
      keyPoints: ["Reduces O(n²) to O(n)", "Works on sorted arrays", "Left pointer moves right, right moves left", "Fast/slow pointers for cycle detection"],
    },
    {
      heading: "3. Sliding Window",
      body: "Sliding window maintains a 'window' of elements and slides it across the array. Expand the window by moving the right pointer. Shrink it by moving the left pointer when a condition is violated. Used for: maximum sum subarray of size k, longest substring without repeating characters, minimum window substring.",
      code: `// Fixed window: max sum of k consecutive elements\nfunction maxSumSubarray(arr, k) {\n  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);\n  let maxSum = windowSum;\n\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k]; // slide window\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n// maxSumSubarray([2,1,5,1,3,2], 3) → 9 (5+1+3)\n\n// Variable window: longest subarray with sum ≤ k\nfunction longestSubarray(arr, k) {\n  let left = 0, sum = 0, maxLen = 0;\n  for (let right = 0; right < arr.length; right++) {\n    sum += arr[right];\n    while (sum > k) sum -= arr[left++]; // shrink\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      tip: "For fixed-size windows, compute the first window then slide by adding the new element and removing the old one.",
      keyPoints: ["Fixed window: size k stays constant", "Variable window: expand/shrink based on condition", "O(n) time — each element added/removed once", "Great for subarray/substring problems"],
    },
    {
      heading: "4. Sorting Algorithms",
      body: "Sorting is fundamental to CS. Bubble, Selection, and Insertion sort are O(n²) — fine for small arrays. Merge Sort and Quick Sort are O(n log n) — used in practice. JavaScript's built-in .sort() uses TimSort (hybrid of Merge + Insertion). Always pass a comparator to .sort() for numbers.",
      code: `// Bubble Sort — O(n²)\nfunction bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j+1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; // swap\n      }\n    }\n  }\n  return arr;\n}\n\n// Merge Sort — O(n log n)\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\n// JS built-in sort (always use comparator for numbers!)\n[3,1,10,2].sort();           // WRONG: [1,10,2,3] (string sort)\n[3,1,10,2].sort((a,b)=>a-b); // CORRECT: [1,2,3,10]`,
      tip: "JavaScript's .sort() without a comparator sorts as strings! Always pass (a, b) => a - b for numbers.",
      keyPoints: ["Bubble/Selection/Insertion: O(n²)", "Merge Sort: O(n log n), stable, extra space", "Quick Sort: O(n log n) avg, in-place", "JS .sort() needs comparator for numbers"],
    },
    {
      heading: "5. Prefix Sum & Binary Search",
      body: "Prefix sum precomputes cumulative sums for O(1) range queries. Binary search finds elements in sorted arrays in O(log n) by halving the search space each step. These are two of the most powerful array techniques in competitive programming.",
      code: `// Prefix Sum\nfunction buildPrefix(arr) {\n  const prefix = [0];\n  for (const num of arr) {\n    prefix.push(prefix[prefix.length-1] + num);\n  }\n  return prefix;\n}\n\nfunction rangeSum(prefix, l, r) {\n  return prefix[r+1] - prefix[l]; // O(1) query!\n}\n\nconst arr = [1, 2, 3, 4, 5];\nconst prefix = buildPrefix(arr); // [0,1,3,6,10,15]\nconsole.log(rangeSum(prefix, 1, 3)); // 2+3+4 = 9\n\n// Binary Search — O(log n)\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1; // not found\n}`,
      tip: "Binary search requires a SORTED array. If the array isn't sorted, sort it first (O(n log n)) then binary search.",
      keyPoints: ["Prefix sum: O(n) build, O(1) range query", "Binary search: O(log n) on sorted array", "Binary search: left <= right, mid = (l+r)/2", "Prefix sum great for subarray sum problems"],
    },
  ],
  quiz: [
    { q: "Time complexity of accessing an array element by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2 },
    { q: "Which technique uses two indices moving toward each other?", options: ["Sliding window", "Two-pointer", "Prefix sum", "Binary search"], answer: 1 },
    { q: "What is the time complexity of Merge Sort?", options: ["O(n²)", "O(n)", "O(n log n)", "O(log n)"], answer: 2 },
    { q: "Prefix sum helps solve which type of problem efficiently?", options: ["Sorting", "Range sum queries", "Graph traversal", "String matching"], answer: 1 },
  ],
};

const DEFAULT: ModuleContent = {
  notes: [
    {
      heading: "1. Module Overview",
      body: "This module covers core concepts that are fundamental to your learning journey. Each section builds on the previous one, so read through carefully and take notes as you go. Active engagement with the material — not just passive reading — is what leads to real understanding.",
      tip: "Take notes in your own words. Summarizing concepts forces your brain to process them deeply.",
      keyPoints: ["Read each section completely before moving on", "Take notes in your own words", "Try to think of real-world examples", "Ask yourself: how would I use this?"],
    },
    {
      heading: "2. Key Concepts",
      body: "Focus on understanding the underlying principles rather than memorizing syntax. Syntax can always be looked up — but the ability to reason about problems and design solutions is what makes a great developer. Every concept in this module connects to real-world applications.",
      tip: "If you don't understand something, re-read it slowly. Understanding > speed.",
      keyPoints: ["Principles over syntax", "Connect concepts to real problems", "Understanding beats memorization", "Ask 'why' not just 'how'"],
    },
    {
      heading: "3. Practice & Application",
      body: "Apply what you learn immediately. After reading each concept, try to write a small example or solve a practice problem. The act of writing code — even simple examples — cements understanding far better than reading alone. Make mistakes, debug them, and learn from them.",
      code: `// Always try to code along\n// Even simple examples build muscle memory\nconsole.log("I am practicing!");\n\n// Break things intentionally to understand them\n// Then fix them`,
      tip: "The best way to learn programming is to write code every day, even if it's just 15 minutes.",
      keyPoints: ["Code along with examples", "Build small projects", "Debugging teaches more than reading", "Consistency beats intensity"],
    },
    {
      heading: "4. Review & Spaced Repetition",
      body: "After completing this module, revisit the key points tomorrow, then in 3 days, then in a week. This is called spaced repetition — the most scientifically proven technique for long-term memory retention. Use flashcards or re-read your notes at increasing intervals.",
      tip: "Review this module's notes before taking the quiz. The quiz reinforces what you've learned.",
      keyPoints: ["Review: tomorrow, 3 days, 1 week, 1 month", "Spaced repetition = best memory technique", "Teach concepts to others to solidify understanding", "Connect new knowledge to what you already know"],
    },
  ],
  quiz: [
    { q: "What is the best way to retain new knowledge?", options: ["Passive reading", "Active practice and recall", "Watching videos only", "Skipping exercises"], answer: 1 },
    { q: "What should you do after learning a new concept?", options: ["Move on immediately", "Apply it with examples", "Ignore it", "Wait a week"], answer: 1 },
    { q: "What is spaced repetition?", options: ["Studying everything at once", "Reviewing at increasing intervals", "Reading the same page twice", "None of the above"], answer: 1 },
    { q: "Which approach builds deeper understanding?", options: ["Memorizing syntax", "Understanding principles", "Copying code", "Skipping theory"], answer: 1 },
  ],
};

export const getModuleData = (title: string): ModuleContent => {
  const t = title.toLowerCase();
  if (t.includes("html")) return HTML;
  if (t.includes("css")) return CSS;
  if (t.includes("javascript") || t.includes("js")) return JAVASCRIPT;
  if (t.includes("react")) return REACT;
  if (t.includes("node")) return NODE;
  if (t.includes("array")) return ARRAYS;
  return DEFAULT;
};
