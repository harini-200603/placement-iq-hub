export const webLanguagesContent: Record<string, string> = {
  // ===== C PROGRAMMING =====
  "c-intro": `## Introduction to C

### What is C?
C is a general-purpose programming language developed by **Dennis Ritchie** at **Bell Labs** in **1972**. It is one of the most widely used languages and forms the foundation for many modern languages like C++, Java, and Python.

### Why Learn C?
- **Foundation of programming** — understanding C helps you learn any other language faster
- **System programming** — operating systems (Linux, Windows) are written in C
- **Embedded systems** — microcontrollers and IoT devices use C
- **Performance** — C is one of the fastest languages
- **Placement exams** — many companies test C fundamentals

### Key Features
- Procedural language (step-by-step)
- Low-level access to memory (pointers)
- Fast execution speed
- Portable across platforms
- Rich library of built-in functions

### Your First C Program
\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`
**Output:** \`Hello, World!\`

### Key Notes
- \`#include <stdio.h>\` — standard input/output library
- \`int main()\` — entry point of the program
- \`printf()\` — prints output
- \`return 0;\` — indicates successful execution
- Every statement ends with semicolon (;)`,

  "c-setup": `## Installation & Setup

### Windows
1. Download **MinGW** (Minimalist GNU for Windows) or **Dev-C++**
2. Install and add to PATH: \`C:\\MinGW\\bin\`
3. Verify: \`gcc --version\`

### Mac
\`\`\`bash
xcode-select --install   # Installs GCC via Xcode tools
gcc --version
\`\`\`

### Linux
\`\`\`bash
sudo apt install gcc      # Ubuntu/Debian
gcc --version
\`\`\`

### Compile and Run
\`\`\`bash
gcc hello.c -o hello      # Compile
./hello                   # Run
\`\`\`

### Recommended IDEs
| IDE | Best For |
|-----|----------|
| VS Code + GCC | Lightweight, popular |
| Code::Blocks | Beginner-friendly |
| Dev-C++ | Simple Windows IDE |
| Turbo C | Legacy (not recommended) |`,

  "c-syntax": `## Basic Syntax in C

### Structure
\`\`\`c
#include <stdio.h>    // Preprocessor directive

int main() {          // Main function
    // Your code here
    printf("Hello!\\n");
    return 0;
}
\`\`\`

### Input and Output
\`\`\`c
#include <stdio.h>

int main() {
    int age;
    char name[50];

    printf("Enter your name: ");
    scanf("%s", name);

    printf("Enter your age: ");
    scanf("%d", &age);

    printf("Hello %s, you are %d years old.\\n", name, age);
    return 0;
}
\`\`\`

### Format Specifiers
| Specifier | Type | Example |
|-----------|------|---------|
| %d | int | printf("%d", 42) |
| %f | float | printf("%.2f", 3.14) |
| %c | char | printf("%c", 'A') |
| %s | string | printf("%s", "Hello") |
| %lf | double | scanf("%lf", &d) |
| %ld | long | printf("%ld", 100000L) |

### Key Notes
- \`scanf()\` needs \`&\` for variables (except strings)
- \`\\n\` = newline character
- Comments: \`//\` single line, \`/* */\` multi-line`,

  "c-variables": `## Variables in C

### Declaration
\`\`\`c
int age = 21;
float salary = 50000.50;
char grade = 'A';
char name[] = "Ravi";
\`\`\`

### Rules
- Must declare type before using
- Start with letter or underscore
- Case-sensitive
- Cannot use reserved keywords

### Storage Classes
| Class | Scope | Lifetime | Default |
|-------|-------|----------|---------|
| auto | Local | Function | Garbage |
| static | Local | Program | 0 |
| extern | Global | Program | 0 |
| register | Local | Function | Garbage |

### Constants
\`\`\`c
const int MAX = 100;
#define PI 3.14159
\`\`\``,

  "c-datatypes": `## Data Types in C

| Type | Size | Range | Format |
|------|------|-------|--------|
| char | 1 byte | -128 to 127 | %c |
| int | 4 bytes | -2³¹ to 2³¹-1 | %d |
| float | 4 bytes | 6 decimal digits | %f |
| double | 8 bytes | 15 decimal digits | %lf |
| short | 2 bytes | -32768 to 32767 | %hd |
| long | 8 bytes | Very large | %ld |

### sizeof Operator
\`\`\`c
printf("int: %lu bytes\\n", sizeof(int));      // 4
printf("char: %lu bytes\\n", sizeof(char));    // 1
printf("float: %lu bytes\\n", sizeof(float));  // 4
printf("double: %lu bytes\\n", sizeof(double));// 8
\`\`\`

### Type Casting
\`\`\`c
int a = 10, b = 3;
float result = (float)a / b;   // 3.333...
printf("%.2f\\n", result);
\`\`\``,

  "c-operators": `## Operators in C

### Arithmetic: +, -, *, /, %
### Relational: ==, !=, >, <, >=, <=
### Logical: &&, ||, !
### Bitwise: &, |, ^, ~, <<, >>
### Assignment: =, +=, -=, *=, /=

### Increment/Decrement
\`\`\`c
int a = 5;
printf("%d\\n", a++);  // 5 (post-increment)
printf("%d\\n", a);    // 6
printf("%d\\n", ++a);  // 7 (pre-increment)
\`\`\`

### Ternary
\`\`\`c
int age = 20;
printf("%s\\n", (age >= 18) ? "Adult" : "Minor");
\`\`\``,

  "c-conditionals": `## Conditional Statements in C

### if-else
\`\`\`c
int marks = 75;
if (marks >= 90) printf("Grade A\\n");
else if (marks >= 75) printf("Grade B\\n");
else if (marks >= 60) printf("Grade C\\n");
else printf("Fail\\n");
\`\`\`

### switch
\`\`\`c
int day = 3;
switch (day) {
    case 1: printf("Monday\\n"); break;
    case 2: printf("Tuesday\\n"); break;
    case 3: printf("Wednesday\\n"); break;
    default: printf("Other day\\n");
}
\`\`\``,

  "c-loops": `## Loops in C

### for Loop
\`\`\`c
for (int i = 1; i <= 5; i++) {
    printf("%d ", i);  // 1 2 3 4 5
}
\`\`\`

### while Loop
\`\`\`c
int i = 1;
while (i <= 5) {
    printf("%d ", i);
    i++;
}
\`\`\`

### do-while
\`\`\`c
int i = 1;
do {
    printf("%d ", i);
    i++;
} while (i <= 5);
\`\`\`

### Pattern Example
\`\`\`c
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++)
        printf("* ");
    printf("\\n");
}
\`\`\`
**Output:**
\`\`\`
*
* *
* * *
* * * *
* * * * *
\`\`\``,

  "c-functions": `## Functions in C

### Syntax
\`\`\`c
returnType functionName(parameters) {
    // body
    return value;
}
\`\`\`

### Example
\`\`\`c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

void greet(char name[]) {
    printf("Hello, %s!\\n", name);
}

int main() {
    printf("Sum: %d\\n", add(10, 20));  // 30
    greet("Ravi");
    return 0;
}
\`\`\`

### Call by Value vs Reference
\`\`\`c
// Call by value (copy)
void change(int x) { x = 100; }

// Call by reference (pointer)
void changeRef(int *x) { *x = 100; }

int main() {
    int a = 5;
    change(a);    printf("%d\\n", a);  // 5 (unchanged)
    changeRef(&a); printf("%d\\n", a); // 100 (changed)
}
\`\`\`

### Recursion
\`\`\`c
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
\`\`\``,

  "c-arrays": `## Arrays & Strings in C

### 1D Array
\`\`\`c
int marks[5] = {85, 90, 78, 92, 88};
printf("First: %d\\n", marks[0]);     // 85
printf("Size: %lu\\n", sizeof(marks)/sizeof(marks[0]));  // 5
\`\`\`

### 2D Array
\`\`\`c
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
printf("%d\\n", matrix[1][2]);  // 6
\`\`\`

### Strings
\`\`\`c
#include <string.h>

char name[] = "Hello";
printf("Length: %lu\\n", strlen(name));  // 5

char dest[20];
strcpy(dest, name);       // Copy
strcat(dest, " World");   // Concatenate
printf("%s\\n", dest);     // Hello World

if (strcmp("abc", "abc") == 0)
    printf("Equal\\n");
\`\`\`

### Common String Functions
| Function | Purpose |
|----------|---------|
| strlen() | Length |
| strcpy() | Copy |
| strcat() | Concatenate |
| strcmp() | Compare |
| strrev() | Reverse |`,

  "c-pointers": `## Pointers in C

### What is a Pointer?
A pointer is a variable that stores the **memory address** of another variable.

### Basics
\`\`\`c
int x = 10;
int *ptr = &x;    // ptr stores address of x

printf("Value: %d\\n", x);       // 10
printf("Address: %p\\n", &x);    // 0x7fff...
printf("Pointer: %p\\n", ptr);   // Same address
printf("Dereferenced: %d\\n", *ptr); // 10
\`\`\`

### Pointer Arithmetic
\`\`\`c
int arr[] = {10, 20, 30, 40};
int *p = arr;

printf("%d\\n", *p);       // 10
printf("%d\\n", *(p+1));   // 20
printf("%d\\n", *(p+2));   // 30
\`\`\`

### Pointers and Functions
\`\`\`c
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&x, &y);
    printf("x=%d, y=%d\\n", x, y);  // x=10, y=5
}
\`\`\`

### Key Notes
- \`&\` = address-of operator
- \`*\` = dereference operator (get value at address)
- Pointer arithmetic moves by sizeof(type)
- NULL pointer: \`int *p = NULL;\`
- Wild pointer: uninitialized pointer (dangerous!)`,

  "c-examples": `## Example Programs in C

### 1. Swap Two Numbers
\`\`\`c
int a = 5, b = 10;
a = a + b;  // 15
b = a - b;  // 5
a = a - b;  // 10
printf("a=%d, b=%d\\n", a, b);  // a=10, b=5
\`\`\`

### 2. Factorial
\`\`\`c
int fact = 1, n = 5;
for (int i = 1; i <= n; i++) fact *= i;
printf("Factorial: %d\\n", fact);  // 120
\`\`\`

### 3. Prime Check
\`\`\`c
int n = 29, is_prime = 1;
for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) { is_prime = 0; break; }
}
printf("%d is %s\\n", n, is_prime ? "prime" : "not prime");
\`\`\`

### 4. Reverse a String
\`\`\`c
char str[] = "Hello";
int len = strlen(str);
for (int i = 0; i < len/2; i++) {
    char temp = str[i];
    str[i] = str[len-1-i];
    str[len-1-i] = temp;
}
printf("%s\\n", str);  // olleH
\`\`\`

### 5. Matrix Multiplication
\`\`\`c
int a[2][2] = {{1,2},{3,4}};
int b[2][2] = {{5,6},{7,8}};
int c[2][2] = {0};

for (int i = 0; i < 2; i++)
    for (int j = 0; j < 2; j++)
        for (int k = 0; k < 2; k++)
            c[i][j] += a[i][k] * b[k][j];
// c = {{19,22},{43,50}}
\`\`\``,

  "c-errors": `## Common Errors in C

### 1. Segmentation Fault
Accessing memory you don't own.
\`\`\`c
int *p = NULL;
*p = 10;  // ❌ Segfault
\`\`\`

### 2. Uninitialized Variables
\`\`\`c
int x;
printf("%d\\n", x);  // ❌ Garbage value
\`\`\`

### 3. Buffer Overflow
\`\`\`c
char name[5];
scanf("%s", name);  // If input > 4 chars → overflow
\`\`\`
**Fix:** Use \`fgets(name, 5, stdin);\`

### 4. Missing & in scanf
\`\`\`c
int x;
scanf("%d", x);   // ❌ Missing &
scanf("%d", &x);  // ✅
\`\`\`

### 5. Memory Leak
\`\`\`c
int *p = malloc(sizeof(int) * 10);
// ... use p ...
// Forgot free(p);  ❌
free(p);  // ✅ Always free allocated memory
\`\`\``,

  "c-interview": `## Top 20 C Interview Questions

**Q1: What is a pointer?** A variable storing the memory address of another variable.

**Q2: malloc vs calloc?** malloc doesn't initialize (garbage), calloc initializes to 0. Both allocate dynamic memory.

**Q3: What is a dangling pointer?** Pointer pointing to freed/deallocated memory.

**Q4: struct vs union?** Struct allocates memory for all members. Union shares memory — only one member active at a time.

**Q5: What is recursion?** A function calling itself with a base case to stop.

**Q6: Call by value vs reference?** Value = copy of data (original unchanged). Reference = address passed (original can change).

**Q7: What is a static variable?** Retains its value between function calls. Initialized only once.

**Q8: What is volatile keyword?** Tells compiler the variable can change unexpectedly (hardware, other threads).

**Q9: Difference between ++i and i++?** ++i increments first then uses. i++ uses then increments.

**Q10: What is typedef?** Creates an alias for a data type: \`typedef unsigned int uint;\``,

  "c-summary": `## C Quick Revision

| Concept | Key Point |
|---------|-----------|
| Variables | Must declare type, use format specifiers |
| Data Types | int, float, char, double + modifiers |
| Operators | Arithmetic, relational, logical, bitwise |
| Control | if-else, switch, for, while, do-while |
| Functions | Call by value/reference, recursion |
| Arrays | Fixed size, 0-indexed |
| Strings | Character arrays, use string.h functions |
| Pointers | &=address, *=dereference, crucial for C |
| Memory | malloc/calloc/free for dynamic allocation |
| Structs | Group different data types together |`,

  // ===== HTML =====
  "html-intro": `## Introduction to HTML

### What is HTML?
HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the **structure** of a web page using **tags**.

### How It Works
Browser receives HTML → Parses tags → Renders visual page

### Basic Structure
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

### Key Notes
- HTML uses **tags** enclosed in angle brackets: \`<tag>\`
- Most tags come in pairs: \`<p>content</p>\`
- \`<!DOCTYPE html>\` declares HTML5
- \`<head>\` contains metadata; \`<body>\` contains visible content`,

  "html-headings": `## Headings & Paragraphs

### Headings (h1 to h6)
\`\`\`html
<h1>Heading 1 (Largest)</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 (Smallest)</h6>
\`\`\`

### Paragraphs
\`\`\`html
<p>This is a paragraph. HTML ignores extra spaces and line breaks in code.</p>
<p>Use the &lt;br&gt; tag for<br>line breaks within a paragraph.</p>
<hr> <!-- Horizontal line -->
\`\`\`

### Key Notes
- Use only ONE \`<h1>\` per page (SEO best practice)
- \`<br>\` = line break (self-closing)
- \`<hr>\` = horizontal rule (self-closing)
- \`<pre>\` preserves whitespace and line breaks`,

  "html-setup": `## Setup & First Page

### What You Need
1. A **text editor** (VS Code recommended)
2. A **web browser** (Chrome, Firefox)

### Steps
1. Open VS Code
2. Create a new file: \`index.html\`
3. Type \`!\` and press Tab (Emmet shortcut for HTML boilerplate)
4. Save and open in browser

### VS Code Extensions for HTML
- **Live Server** — auto-refreshes browser on save
- **Auto Rename Tag** — renames matching tags
- **Prettier** — auto-formats code`,

  "html-syntax": `## Basic Syntax & Structure

### Tags and Attributes
\`\`\`html
<tagname attribute="value">Content</tagname>
\`\`\`

### Common Attributes
| Attribute | Purpose | Example |
|-----------|---------|---------|
| id | Unique identifier | \`<div id="main">\` |
| class | CSS class name | \`<p class="intro">\` |
| style | Inline CSS | \`<h1 style="color:blue">\` |
| title | Tooltip text | \`<p title="Info">\` |

### Self-Closing Tags
\`\`\`html
<br>    <!-- Line break -->
<hr>    <!-- Horizontal rule -->
<img>   <!-- Image -->
<input> <!-- Form input -->
\`\`\``,

  "html-formatting": `## Text Formatting

\`\`\`html
<b>Bold text</b> or <strong>Important text</strong>
<i>Italic text</i> or <em>Emphasized text</em>
<u>Underlined text</u>
<mark>Highlighted text</mark>
<del>Deleted text</del> (strikethrough)
<sub>Subscript</sub> H<sub>2</sub>O
<sup>Superscript</sup> x<sup>2</sup>
<small>Small text</small>
<code>Inline code</code>
\`\`\`

### Tip
- Use \`<strong>\` over \`<b>\` for semantic meaning (screen readers)
- Use \`<em>\` over \`<i>\` for semantic emphasis`,

  "html-links": `## Links & Images

### Links
\`\`\`html
<a href="https://www.google.com">Visit Google</a>
<a href="about.html">About Page</a>
<a href="#section1">Jump to Section</a>
<a href="mailto:test@email.com">Send Email</a>
<a href="https://example.com" target="_blank">Opens in new tab</a>
\`\`\`

### Images
\`\`\`html
<img src="photo.jpg" alt="Description of image" width="300">
<img src="https://example.com/image.png" alt="Online image">
\`\`\`

### Key Notes
- Always use \`alt\` attribute for accessibility and SEO
- \`target="_blank"\` opens link in new tab
- Use relative paths for local files, absolute URLs for external`,

  "html-lists": `## Lists & Tables

### Ordered List
\`\`\`html
<ol>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ol>
\`\`\`

### Unordered List
\`\`\`html
<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
</ul>
\`\`\`

### Tables
\`\`\`html
<table border="1">
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
    </tr>
    <tr>
        <td>Ravi</td>
        <td>21</td>
        <td>Chennai</td>
    </tr>
    <tr>
        <td>Priya</td>
        <td>22</td>
        <td>Mumbai</td>
    </tr>
</table>
\`\`\`

### Key Notes
- \`<th>\` = table header (bold, centered by default)
- \`<td>\` = table data
- \`<tr>\` = table row
- Use CSS for table styling, not \`border\` attribute`,

  "html-forms": `## Forms & Input

\`\`\`html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" placeholder="Enter name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password">

    <label for="age">Age:</label>
    <input type="number" id="age" name="age" min="18" max="100">

    <label>Gender:</label>
    <input type="radio" name="gender" value="male"> Male
    <input type="radio" name="gender" value="female"> Female

    <label>Skills:</label>
    <input type="checkbox" name="skill" value="html"> HTML
    <input type="checkbox" name="skill" value="css"> CSS
    <input type="checkbox" name="skill" value="js"> JavaScript

    <label for="course">Course:</label>
    <select id="course" name="course">
        <option value="btech">B.Tech</option>
        <option value="bca">BCA</option>
        <option value="mca">MCA</option>
    </select>

    <label for="message">Message:</label>
    <textarea id="message" rows="4" cols="50"></textarea>

    <button type="submit">Submit</button>
</form>
\`\`\`

### Input Types
text, email, password, number, date, file, color, range, url, tel, search`,

  "html-semantic": `## Semantic HTML

### What is Semantic HTML?
Semantic elements clearly describe their meaning to both the browser and developer.

\`\`\`html
<header>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>

<main>
    <article>
        <h2>Article Title</h2>
        <p>Article content...</p>
    </article>

    <section>
        <h2>Section Title</h2>
        <p>Section content...</p>
    </section>

    <aside>
        <h3>Related Links</h3>
    </aside>
</main>

<footer>
    <p>&copy; 2024 PlacementIQ</p>
</footer>
\`\`\`

### Why Use Semantic HTML?
- Better **SEO** (search engines understand page structure)
- Better **accessibility** (screen readers navigate semantically)
- Cleaner, more **readable** code
- Follows **web standards**`,

  "html-examples": `## Example HTML Pages

### Simple Portfolio Page
\`\`\`html
<!DOCTYPE html>
<html>
<head><title>My Portfolio</title></head>
<body>
    <header>
        <h1>Ravi Kumar</h1>
        <p>Web Developer | B.Tech CSE</p>
    </header>
    <main>
        <section>
            <h2>About Me</h2>
            <p>I'm a passionate developer from Chennai.</p>
        </section>
        <section>
            <h2>Skills</h2>
            <ul>
                <li>HTML & CSS</li>
                <li>JavaScript</li>
                <li>React</li>
                <li>Python</li>
            </ul>
        </section>
        <section>
            <h2>Contact</h2>
            <form>
                <input type="text" placeholder="Your Name">
                <input type="email" placeholder="Your Email">
                <textarea placeholder="Message"></textarea>
                <button>Send</button>
            </form>
        </section>
    </main>
    <footer><p>&copy; 2024 Ravi Kumar</p></footer>
</body>
</html>
\`\`\``,

  "html-errors": `## Common HTML Mistakes

### 1. Unclosed Tags
\`\`\`html
❌ <p>Hello <b>World</p>
✅ <p>Hello <b>World</b></p>
\`\`\`

### 2. Missing alt on Images
\`\`\`html
❌ <img src="photo.jpg">
✅ <img src="photo.jpg" alt="Profile photo of Ravi">
\`\`\`

### 3. Improper Nesting
\`\`\`html
❌ <b><i>Bold Italic</b></i>
✅ <b><i>Bold Italic</i></b>
\`\`\`

### 4. Using Deprecated Tags
\`\`\`html
❌ <font color="red">Text</font>
✅ <span style="color:red">Text</span> (or use CSS)
\`\`\`

### 5. Missing DOCTYPE
Always include \`<!DOCTYPE html>\` as the first line.`,

  "html-interview": `## HTML Interview Questions

**Q1: What is HTML?** Markup language for structuring web pages.

**Q2: Block vs Inline elements?** Block: takes full width (div, p, h1). Inline: takes only needed width (span, a, strong).

**Q3: What is semantic HTML?** Elements that describe their meaning (header, nav, article, section, footer).

**Q4: div vs span?** div = block-level container. span = inline container.

**Q5: What are void/self-closing elements?** Elements with no closing tag: br, hr, img, input.

**Q6: What is the purpose of DOCTYPE?** Tells browser which HTML version to use (HTML5 = \`<!DOCTYPE html>\`).

**Q7: What are data- attributes?** Custom attributes to store data: \`<div data-id="123">\`

**Q8: Local storage vs Session storage?** Local persists after browser close. Session clears on tab close.

**Q9: What are meta tags?** Provide metadata: charset, viewport, description, keywords.

**Q10: HTML5 new elements?** header, footer, nav, article, section, aside, figure, video, audio, canvas.`,

  "html-summary": `## HTML Quick Revision

| Tag | Purpose |
|-----|---------|
| h1-h6 | Headings |
| p | Paragraph |
| a | Link |
| img | Image |
| ul/ol/li | Lists |
| table/tr/td | Tables |
| form/input | Forms |
| div | Block container |
| span | Inline container |
| header/nav/main/footer | Semantic structure |`,

  // ===== CSS =====
  "css-intro": `## Introduction to CSS
CSS (Cascading Style Sheets) controls the **visual presentation** of HTML elements — colors, fonts, layouts, spacing, and animations. HTML = structure, CSS = style.

### 3 Ways to Add CSS
\`\`\`html
<!-- 1. Inline -->
<p style="color: blue;">Blue text</p>

<!-- 2. Internal -->
<style>
  p { color: blue; }
</style>

<!-- 3. External (Recommended) -->
<link rel="stylesheet" href="style.css">
\`\`\``,

  "css-syntax": `## CSS Syntax & Selectors

### Basic Syntax
\`\`\`css
selector {
    property: value;
}
\`\`\`

### Types of Selectors
\`\`\`css
p { }              /* Element selector */
.intro { }         /* Class selector */
#main { }          /* ID selector */
* { }              /* Universal selector */
div p { }          /* Descendant */
div > p { }        /* Direct child */
h1, h2, h3 { }    /* Grouping */
a:hover { }        /* Pseudo-class */
p::first-line { }  /* Pseudo-element */
\`\`\`

### Specificity (Priority)
1. !important (highest)
2. Inline styles
3. ID selectors (#)
4. Class selectors (.)
5. Element selectors (lowest)`,

  "css-colors": `## Colors & Backgrounds

\`\`\`css
/* Color values */
color: red;                    /* Named */
color: #ff0000;                /* Hex */
color: rgb(255, 0, 0);         /* RGB */
color: rgba(255, 0, 0, 0.5);   /* RGBA (with opacity) */
color: hsl(0, 100%, 50%);      /* HSL */

/* Background */
background-color: #f0f0f0;
background-image: url('bg.jpg');
background-size: cover;
background-position: center;
background-repeat: no-repeat;

/* Gradient */
background: linear-gradient(to right, #667eea, #764ba2);
background: radial-gradient(circle, #667eea, #764ba2);
\`\`\``,

  "css-box-model": `## The Box Model

Every HTML element is a box with 4 layers:

\`\`\`
┌─────────────── Margin ────────────────┐
│ ┌──────────── Border ──────────────┐  │
│ │ ┌────────── Padding ──────────┐  │  │
│ │ │ ┌──────── Content ────────┐ │  │  │
│ │ │ │                         │ │  │  │
│ │ │ └─────────────────────────┘ │  │  │
│ │ └─────────────────────────────┘  │  │
│ └──────────────────────────────────┘  │
└───────────────────────────────────────┘
\`\`\`

\`\`\`css
div {
    width: 200px;
    padding: 20px;
    border: 2px solid black;
    margin: 10px;
}

/* box-sizing makes width include padding + border */
* {
    box-sizing: border-box;  /* ✅ Always use this */
}
\`\`\``,

  "css-text": `## Text & Fonts

\`\`\`css
h1 {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    text-decoration: underline;
    text-transform: uppercase;
    letter-spacing: 2px;
    line-height: 1.6;
    color: #333;
}
\`\`\`

### Google Fonts
\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
\`\`\`
\`\`\`css
body { font-family: 'Roboto', sans-serif; }
\`\`\``,

  "css-layout": `## Display & Position

### Display
\`\`\`css
.block { display: block; }      /* Full width */
.inline { display: inline; }    /* Only needed width */
.ib { display: inline-block; }  /* Inline + can set width/height */
.none { display: none; }        /* Hidden */
\`\`\`

### Position
\`\`\`css
.static { position: static; }     /* Default */
.relative { position: relative; top: 10px; }  /* Relative to itself */
.absolute { position: absolute; top: 0; right: 0; }  /* Relative to parent */
.fixed { position: fixed; bottom: 0; }  /* Fixed to viewport */
.sticky { position: sticky; top: 0; }  /* Scrolls then sticks */
\`\`\``,

  "css-flexbox": `## Flexbox

### Container Properties
\`\`\`css
.container {
    display: flex;
    flex-direction: row;           /* row | column */
    justify-content: center;       /* Main axis alignment */
    align-items: center;           /* Cross axis alignment */
    flex-wrap: wrap;               /* Allow wrapping */
    gap: 10px;                     /* Space between items */
}
\`\`\`

### Item Properties
\`\`\`css
.item {
    flex: 1;              /* Grow to fill space */
    flex-grow: 2;         /* Grow ratio */
    flex-shrink: 0;       /* Don't shrink */
    flex-basis: 200px;    /* Initial size */
    align-self: flex-end; /* Override alignment */
    order: -1;            /* Change order */
}
\`\`\`

### Common Patterns
\`\`\`css
/* Center anything */
.center { display: flex; justify-content: center; align-items: center; }

/* Space between */
.navbar { display: flex; justify-content: space-between; align-items: center; }
\`\`\``,

  "css-grid": `## CSS Grid

\`\`\`css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */
    grid-template-rows: auto;
    gap: 20px;
    padding: 20px;
}

.item-1 { grid-column: span 2; }  /* Takes 2 columns */
.item-2 { grid-row: span 2; }     /* Takes 2 rows */
\`\`\`

### Grid vs Flexbox
| Feature | Flexbox | Grid |
|---------|---------|------|
| Direction | 1D (row OR column) | 2D (rows AND columns) |
| Best for | Navigation, cards | Page layouts, dashboards |`,

  "css-responsive": `## Responsive Design

### Media Queries
\`\`\`css
/* Mobile first */
.container { padding: 10px; }

@media (min-width: 768px) {
    .container { padding: 20px; max-width: 720px; }
}

@media (min-width: 1024px) {
    .container { max-width: 960px; }
}
\`\`\`

### Viewport Units
\`\`\`css
.hero {
    width: 100vw;    /* 100% viewport width */
    height: 100vh;   /* 100% viewport height */
    font-size: 5vw;  /* Responsive font */
}
\`\`\`

### Common Breakpoints
| Device | Width |
|--------|-------|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |`,

  "css-animations": `## Animations & Transitions

### Transitions
\`\`\`css
.button {
    background: blue;
    transition: all 0.3s ease;
}
.button:hover {
    background: darkblue;
    transform: scale(1.05);
}
\`\`\`

### Keyframe Animations
\`\`\`css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.card {
    animation: fadeIn 0.5s ease forwards;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.loader { animation: spin 1s linear infinite; }
\`\`\`

### Transform
\`\`\`css
.element {
    transform: translateX(50px);
    transform: rotate(45deg);
    transform: scale(1.5);
    transform: skew(10deg);
}
\`\`\``,

  "css-examples": `## Example Designs

### Card Component
\`\`\`css
.card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 24px;
    transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}
\`\`\`

### Responsive Navbar
\`\`\`css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #333;
    color: white;
}
.nav-links { display: flex; gap: 20px; list-style: none; }
.nav-links a { color: white; text-decoration: none; }
.nav-links a:hover { color: #667eea; }
\`\`\``,

  "css-errors": `## Common CSS Mistakes

### 1. Specificity Conflicts
\`\`\`css
❌ .btn { color: red; }
   #submit { color: blue; }  /* ID wins over class */
✅ Use consistent selector types
\`\`\`

### 2. z-index Not Working
z-index only works on positioned elements (relative, absolute, fixed).

### 3. Overflow Issues
\`\`\`css
✅ overflow: hidden;   /* Clip content */
✅ overflow: auto;     /* Scroll when needed */
\`\`\`

### 4. Not Using box-sizing
\`\`\`css
✅ * { box-sizing: border-box; }  /* Always add this */
\`\`\``,

  "css-interview": `## CSS Interview Questions

**Q1: Box model?** Content + Padding + Border + Margin

**Q2: Flexbox vs Grid?** Flex = 1D layout. Grid = 2D layout.

**Q3: Position types?** static, relative, absolute, fixed, sticky.

**Q4: What is specificity?** Priority system: inline > ID > class > element.

**Q5: em vs rem?** em = relative to parent. rem = relative to root (html).

**Q6: How to center a div?** Flexbox: display:flex + justify/align center.

**Q7: What is BEM?** Naming convention: block__element--modifier.

**Q8: display:none vs visibility:hidden?** none removes from flow. hidden keeps space.`,

  "css-summary": `## CSS Quick Revision
| Concept | Key Point |
|---------|-----------|
| Selectors | element, .class, #id, * |
| Box Model | content + padding + border + margin |
| Colors | hex, rgb, hsl, named |
| Layout | display, position, float |
| Flexbox | 1D layout, justify/align |
| Grid | 2D layout, rows + columns |
| Responsive | Media queries, viewport units |
| Animation | transition, @keyframes, transform |`,

  // ===== JAVASCRIPT =====
  "js-intro": `## Introduction to JavaScript

JavaScript is the **programming language of the web**. It adds interactivity, logic, and dynamic behavior to web pages. It runs in the browser (client-side) and on servers (Node.js).

### Key Facts
- Created by **Brendan Eich** in **1995** (in 10 days!)
- Originally called "Mocha" → "LiveScript" → "JavaScript"
- NOT related to Java (marketing name)
- Most popular programming language worldwide

### What Can JavaScript Do?
- Change HTML content and CSS styles dynamically
- Handle user events (clicks, typing, scrolling)
- Validate forms before submission
- Create animations and interactive UIs
- Communicate with servers (AJAX, Fetch API)
- Build full-stack apps (with Node.js)

### Your First JavaScript
\`\`\`html
<script>
    alert("Hello, World!");
    console.log("Check the console!");
    document.write("Written to page");
</script>
\`\`\``,

  "js-setup": `## Setup & Console

### 3 Ways to Add JavaScript
\`\`\`html
<!-- 1. Inline -->
<button onclick="alert('Hi!')">Click Me</button>

<!-- 2. Internal -->
<script>
    console.log("Internal JS");
</script>

<!-- 3. External (Recommended) -->
<script src="app.js"></script>
\`\`\`

### Browser Console
- Open: F12 or Ctrl+Shift+I → Console tab
- Use \`console.log()\` for debugging
- Can run JS directly in console`,

  "js-syntax": `## Basic Syntax

\`\`\`javascript
// Single line comment
/* Multi-line comment */

// Statements end with semicolon (optional but recommended)
let x = 5;
console.log(x);

// Strict mode
"use strict";  // Enables strict error checking
\`\`\``,

  "js-variables": `## Variables in JavaScript

### var, let, const
\`\`\`javascript
var name = "Ravi";      // Function-scoped, can be redeclared
let age = 21;           // Block-scoped, can be reassigned
const PI = 3.14159;     // Block-scoped, cannot be reassigned

// let and const are preferred (ES6+)
\`\`\`

### Hoisting
\`\`\`javascript
console.log(a);  // undefined (var is hoisted)
var a = 5;

console.log(b);  // ❌ ReferenceError (let not hoisted)
let b = 10;
\`\`\`

### Key Notes
- Use \`const\` by default
- Use \`let\` when you need to reassign
- Avoid \`var\` (legacy)`,

  "js-datatypes": `## Data Types

### Primitive Types
\`\`\`javascript
let str = "Hello";          // String
let num = 42;               // Number
let big = 9007199254740991n; // BigInt
let bool = true;            // Boolean
let nothing = null;         // Null (intentional empty)
let notDefined;             // Undefined
let id = Symbol("id");      // Symbol (unique identifier)
\`\`\`

### typeof Operator
\`\`\`javascript
console.log(typeof "Hello");    // "string"
console.log(typeof 42);         // "number"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof null);       // "object" (JS quirk!)
console.log(typeof {});         // "object"
console.log(typeof []);         // "object" (arrays are objects)
\`\`\``,

  "js-operators": `## Operators

### Comparison
\`\`\`javascript
5 == "5"    // true  (loose equality, type conversion)
5 === "5"   // false (strict equality, no conversion) ✅ Use this
5 != "5"    // false
5 !== "5"   // true
\`\`\`

### Spread & Destructuring
\`\`\`javascript
// Spread
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5];  // [1,2,3,4,5]

// Destructuring
let [a, b] = [10, 20];
let {name, age} = {name: "Ravi", age: 21};
\`\`\`

### Nullish Coalescing & Optional Chaining
\`\`\`javascript
let val = null ?? "default";   // "default"
let name = user?.profile?.name; // Safe access
\`\`\``,

  "js-conditionals": `## Conditional Statements

### if-else
\`\`\`javascript
let marks = 75;
if (marks >= 90) console.log("A");
else if (marks >= 75) console.log("B");
else if (marks >= 60) console.log("C");
else console.log("Fail");
\`\`\`

### Ternary
\`\`\`javascript
let status = (age >= 18) ? "Adult" : "Minor";
\`\`\`

### switch
\`\`\`javascript
switch (day) {
    case "Mon": console.log("Monday"); break;
    case "Tue": console.log("Tuesday"); break;
    default: console.log("Other day");
}
\`\`\`

### Nullish Coalescing
\`\`\`javascript
let name = inputName ?? "Anonymous";
\`\`\``,

  "js-loops": `## Loops

\`\`\`javascript
// for loop
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0,1,2,3,4
}

// while
let i = 0;
while (i < 5) { console.log(i); i++; }

// for...of (arrays)
let fruits = ["apple", "banana"];
for (let fruit of fruits) console.log(fruit);

// for...in (object keys)
let obj = {a: 1, b: 2};
for (let key in obj) console.log(key, obj[key]);

// forEach
[1,2,3].forEach((num, index) => console.log(index, num));

// map (returns new array)
let doubled = [1,2,3].map(x => x * 2);  // [2,4,6]
\`\`\``,

  "js-functions": `## Functions

### Function Declaration
\`\`\`javascript
function greet(name) {
    return "Hello, " + name;
}
\`\`\`

### Function Expression
\`\`\`javascript
const greet = function(name) {
    return "Hello, " + name;
};
\`\`\`

### Arrow Function (ES6) ✅
\`\`\`javascript
const greet = (name) => "Hello, " + name;
const add = (a, b) => a + b;
const square = x => x * x;  // Single param: no ()
\`\`\`

### Default Parameters
\`\`\`javascript
function greet(name = "Guest") {
    console.log("Hello, " + name);
}
\`\`\`

### Closures
\`\`\`javascript
function counter() {
    let count = 0;
    return () => ++count;
}
const inc = counter();
console.log(inc()); // 1
console.log(inc()); // 2
\`\`\``,

  "js-arrays": `## Arrays & Objects

### Arrays
\`\`\`javascript
let arr = [1, 2, 3, 4, 5];
arr.push(6);           // Add to end
arr.pop();             // Remove from end
arr.unshift(0);        // Add to start
arr.shift();           // Remove from start
arr.includes(3);       // true
arr.indexOf(3);        // 2
arr.slice(1, 3);       // [2, 3] (no mutation)
arr.splice(1, 2);      // Removes 2 items from index 1 (mutates)

// Important methods
let doubled = arr.map(x => x * 2);
let evens = arr.filter(x => x % 2 === 0);
let sum = arr.reduce((acc, x) => acc + x, 0);
let found = arr.find(x => x > 3);
\`\`\`

### Objects
\`\`\`javascript
let student = {
    name: "Ravi",
    age: 21,
    greet() { return "Hi, I'm " + this.name; }
};

console.log(student.name);       // Ravi
console.log(student["age"]);     // 21
student.college = "XYZ";         // Add property

// JSON
let json = JSON.stringify(student);   // Object → String
let obj = JSON.parse(json);           // String → Object
\`\`\``,

  "js-dom": `## DOM Manipulation

### Selecting Elements
\`\`\`javascript
document.getElementById("title");
document.querySelector(".card");          // First match
document.querySelectorAll(".card");       // All matches
document.getElementsByClassName("btn");
document.getElementsByTagName("p");
\`\`\`

### Changing Content & Style
\`\`\`javascript
let el = document.getElementById("title");
el.textContent = "New Title";
el.innerHTML = "<strong>Bold Title</strong>";
el.style.color = "blue";
el.style.fontSize = "24px";
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("dark");
\`\`\`

### Event Handling
\`\`\`javascript
document.getElementById("btn").addEventListener("click", function() {
    alert("Button clicked!");
});

// Arrow function
document.querySelector(".card").addEventListener("mouseover", () => {
    console.log("Hovered!");
});
\`\`\`

### Creating & Removing Elements
\`\`\`javascript
let newDiv = document.createElement("div");
newDiv.textContent = "New Element";
newDiv.className = "card";
document.body.appendChild(newDiv);

// Remove
let old = document.getElementById("old");
old.remove();
\`\`\``,

  "js-examples": `## Example Programs

### 1. Simple Calculator
\`\`\`javascript
function calculate(a, b, op) {
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : "Error";
        default: return "Invalid";
    }
}
console.log(calculate(10, 5, '+'));  // 15
\`\`\`

### 2. Todo List Logic
\`\`\`javascript
let todos = [];
const addTodo = (text) => todos.push({text, done: false, id: Date.now()});
const toggleTodo = (id) => {
    let todo = todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
};
const removeTodo = (id) => todos = todos.filter(t => t.id !== id);
\`\`\`

### 3. Form Validation
\`\`\`javascript
function validateForm(email, password) {
    if (!email.includes("@")) return "Invalid email";
    if (password.length < 8) return "Password too short";
    return "Valid";
}
\`\`\``,

  "js-errors": `## Common JavaScript Errors

### 1. TypeError
\`\`\`javascript
null.toString();  // ❌ Cannot read properties of null
undefined.map();  // ❌ undefined is not a function
\`\`\`

### 2. ReferenceError
\`\`\`javascript
console.log(x);  // ❌ x is not defined
\`\`\`

### 3. SyntaxError
\`\`\`javascript
let x = ;  // ❌ Unexpected token
\`\`\`

### Error Handling
\`\`\`javascript
try {
    let result = riskyOperation();
} catch (error) {
    console.error("Error:", error.message);
} finally {
    console.log("Always runs");
}
\`\`\``,

  "js-interview": `## Top 20 JavaScript Interview Questions

**Q1: var vs let vs const?** var=function-scoped. let/const=block-scoped. const can't be reassigned.

**Q2: == vs ===?** == converts types. === strict (no conversion). Always use ===.

**Q3: What is closure?** Function that remembers variables from its outer scope.

**Q4: What is hoisting?** Variable/function declarations moved to top of scope.

**Q5: What is the event loop?** Mechanism that handles async operations (call stack + callback queue).

**Q6: What are promises?** Object representing future async result. States: pending, fulfilled, rejected.

**Q7: async/await?** Syntactic sugar for promises. async function + await keyword.

**Q8: What is 'this'?** Context-dependent. In method = object. In function = window/undefined. Arrow function = lexical.

**Q9: map vs forEach?** map returns new array. forEach returns undefined (side effects only).

**Q10: What is prototype?** Object from which other objects inherit properties.`,

  "js-summary": `## JavaScript Quick Revision
| Concept | Key Point |
|---------|-----------|
| Variables | const (default), let (reassign), avoid var |
| Types | string, number, boolean, null, undefined, object, symbol |
| Operators | ===, ??, ?., ... spread, destructuring |
| Functions | Arrow functions, closures, callbacks |
| Arrays | map, filter, reduce, find, forEach |
| Objects | Dot/bracket access, JSON, destructuring |
| DOM | querySelector, addEventListener, classList |
| Async | Promises, async/await, fetch API |
| ES6+ | let/const, arrow functions, template literals, modules |`,
};
