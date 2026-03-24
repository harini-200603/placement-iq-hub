export const programmingContent: Record<string, string> = {
  // ===== JAVA =====
  "java-intro": `## Introduction to Java

### What is Java?
Java is a high-level, object-oriented programming language developed by **James Gosling** at **Sun Microsystems** in **1995**. It is now owned by **Oracle Corporation**.

### Key Features
- **Platform Independent**: "Write Once, Run Anywhere" (WORA) — Java code runs on any machine with a JVM
- **Object-Oriented**: Everything in Java is based on objects and classes
- **Secure**: No explicit pointers, bytecode verification, security manager
- **Robust**: Strong memory management, exception handling, garbage collection
- **Multithreaded**: Built-in support for concurrent programming
- **Simple**: No pointers, no operator overloading, automatic garbage collection

### JDK vs JRE vs JVM
| Component | Full Form | Purpose |
|-----------|-----------|---------|
| **JDK** | Java Development Kit | For developing Java programs (includes JRE + compiler + tools) |
| **JRE** | Java Runtime Environment | For running Java programs (includes JVM + libraries) |
| **JVM** | Java Virtual Machine | Executes Java bytecode on any platform |

### How Java Works
\`\`\`
Source Code (.java) → Compiler (javac) → Bytecode (.class) → JVM → Machine Code
\`\`\`

### Your First Java Program
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

**Output:**
\`\`\`
Hello, World!
\`\`\`

### Key Notes
- File name must match class name (HelloWorld.java)
- \`main\` method is the entry point
- \`System.out.println()\` prints output to console
- Java is **case-sensitive**
- Every statement ends with a **semicolon (;)**

### 🎯 Interview Question
**Q: Why is Java platform independent?**
*A: Java code is compiled into bytecode by the Java compiler. This bytecode is platform-independent and can run on any machine that has a JVM installed. The JVM translates the bytecode to machine-specific code at runtime.*`,

  "java-variables": `## Variables in Java

### What is a Variable?
A variable is a container that stores data values. In Java, every variable must be declared with a **data type**.

### Syntax
\`\`\`java
dataType variableName = value;
\`\`\`

### Example
\`\`\`java
int age = 21;
String name = "Ravi";
double salary = 50000.50;
boolean isPlaced = true;
\`\`\`

### Types of Variables
| Type | Where Declared | Scope |
|------|---------------|-------|
| **Local** | Inside a method | Within that method only |
| **Instance** | Inside class, outside method | Each object has its own copy |
| **Static** | With \`static\` keyword | Shared across all objects |

### Example Program
\`\`\`java
public class VariableDemo {
    static int count = 0;        // Static variable
    String name;                 // Instance variable

    public void display() {
        int age = 20;            // Local variable
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Count: " + count);
    }

    public static void main(String[] args) {
        VariableDemo obj = new VariableDemo();
        obj.name = "Priya";
        count = 1;
        obj.display();
    }
}
\`\`\`

**Output:**
\`\`\`
Name: Priya
Age: 20
Count: 1
\`\`\`

### Naming Rules
- Must start with a **letter**, **$**, or **_**
- Cannot start with a number
- Cannot use Java **keywords** (int, class, etc.)
- **camelCase** convention: \`studentName\`, \`totalMarks\`
- Case-sensitive: \`name\` ≠ \`Name\`

### Key Notes
- Always **initialize** local variables before use
- Instance variables get default values (0, null, false)
- Use \`final\` keyword for constants: \`final int MAX = 100;\``,

  "java-datatypes": `## Data Types in Java

### Categories
Java has two categories of data types:

### 1. Primitive Data Types (8 types)
| Type | Size | Default | Range | Example |
|------|------|---------|-------|---------|
| **byte** | 1 byte | 0 | -128 to 127 | \`byte b = 100;\` |
| **short** | 2 bytes | 0 | -32,768 to 32,767 | \`short s = 1000;\` |
| **int** | 4 bytes | 0 | -2³¹ to 2³¹-1 | \`int x = 50000;\` |
| **long** | 8 bytes | 0L | -2⁶³ to 2⁶³-1 | \`long l = 99999L;\` |
| **float** | 4 bytes | 0.0f | 6-7 decimal digits | \`float f = 3.14f;\` |
| **double** | 8 bytes | 0.0d | 15-16 decimal digits | \`double d = 3.14159;\` |
| **char** | 2 bytes | '\\u0000' | 0 to 65,535 | \`char c = 'A';\` |
| **boolean** | 1 bit | false | true or false | \`boolean b = true;\` |

### 2. Non-Primitive (Reference) Types
- **String**: \`String name = "Java";\`
- **Array**: \`int[] arr = {1, 2, 3};\`
- **Class/Object**: \`Scanner sc = new Scanner(System.in);\`

### Type Casting
\`\`\`java
// Widening (automatic): smaller → larger
int num = 100;
double d = num;       // 100.0

// Narrowing (manual): larger → smaller
double price = 99.99;
int p = (int) price;  // 99 (truncated)
\`\`\`

### Example Program
\`\`\`java
public class DataTypeDemo {
    public static void main(String[] args) {
        int age = 21;
        double cgpa = 8.5;
        char grade = 'A';
        boolean isEligible = true;
        String college = "XYZ Engineering College";

        System.out.println("Age: " + age);
        System.out.println("CGPA: " + cgpa);
        System.out.println("Grade: " + grade);
        System.out.println("Eligible: " + isEligible);
        System.out.println("College: " + college);
    }
}
\`\`\`

**Output:**
\`\`\`
Age: 21
CGPA: 8.5
Grade: A
Eligible: true
College: XYZ Engineering College
\`\`\`

### Key Notes
- Use \`int\` for most integer values
- Use \`double\` for decimal values
- Add \`f\` suffix for float: \`3.14f\`
- Add \`L\` suffix for long: \`100000L\`
- \`char\` uses single quotes, \`String\` uses double quotes`,

  "java-operators": `## Operators in Java

### Types of Operators

### 1. Arithmetic Operators
| Operator | Description | Example | Result |
|----------|------------|---------|--------|
| + | Addition | 10 + 3 | 13 |
| - | Subtraction | 10 - 3 | 7 |
| * | Multiplication | 10 * 3 | 30 |
| / | Division | 10 / 3 | 3 (integer division) |
| % | Modulus | 10 % 3 | 1 |

### 2. Relational Operators
| Operator | Description | Example | Result |
|----------|------------|---------|--------|
| == | Equal to | 5 == 5 | true |
| != | Not equal | 5 != 3 | true |
| > | Greater than | 5 > 3 | true |
| < | Less than | 5 < 3 | false |
| >= | Greater or equal | 5 >= 5 | true |
| <= | Less or equal | 3 <= 5 | true |

### 3. Logical Operators
| Operator | Description | Example |
|----------|------------|---------|
| && | AND | (a > 0 && b > 0) |
| \\|\\| | OR | (a > 0 \\|\\| b > 0) |
| ! | NOT | !(a > 0) |

### 4. Assignment Operators
\`\`\`java
int x = 10;
x += 5;   // x = 15
x -= 3;   // x = 12
x *= 2;   // x = 24
x /= 4;   // x = 6
x %= 4;   // x = 2
\`\`\`

### 5. Increment/Decrement
\`\`\`java
int a = 5;
System.out.println(a++);  // 5 (post-increment: use then increase)
System.out.println(a);    // 6
System.out.println(++a);  // 7 (pre-increment: increase then use)
\`\`\`

### 6. Ternary Operator
\`\`\`java
int marks = 75;
String result = (marks >= 40) ? "Pass" : "Fail";
System.out.println(result);  // Pass
\`\`\`

### Example Program
\`\`\`java
public class OperatorDemo {
    public static void main(String[] args) {
        int a = 15, b = 4;

        System.out.println("a + b = " + (a + b));   // 19
        System.out.println("a - b = " + (a - b));   // 11
        System.out.println("a * b = " + (a * b));   // 60
        System.out.println("a / b = " + (a / b));   // 3
        System.out.println("a % b = " + (a % b));   // 3
        System.out.println("a > b: " + (a > b));    // true
        System.out.println("a == b: " + (a == b));  // false
    }
}
\`\`\`

### Key Notes
- Integer division truncates: 10/3 = 3 (not 3.33)
- Use \`==\` for comparison, \`=\` for assignment
- \`&&\` short-circuits: if first is false, second isn't evaluated
- Ternary operator is a compact if-else`,

  "java-conditionals": `## Conditional Statements in Java

### 1. if Statement
\`\`\`java
int marks = 85;
if (marks >= 90) {
    System.out.println("Excellent!");
}
\`\`\`

### 2. if-else Statement
\`\`\`java
int marks = 55;
if (marks >= 40) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}
\`\`\`
**Output:** \`Pass\`

### 3. if-else-if Ladder
\`\`\`java
int marks = 75;
if (marks >= 90) {
    System.out.println("Grade A");
} else if (marks >= 75) {
    System.out.println("Grade B");
} else if (marks >= 60) {
    System.out.println("Grade C");
} else if (marks >= 40) {
    System.out.println("Grade D");
} else {
    System.out.println("Fail");
}
\`\`\`
**Output:** \`Grade B\`

### 4. switch-case
\`\`\`java
int day = 3;
switch (day) {
    case 1: System.out.println("Monday"); break;
    case 2: System.out.println("Tuesday"); break;
    case 3: System.out.println("Wednesday"); break;
    case 4: System.out.println("Thursday"); break;
    case 5: System.out.println("Friday"); break;
    default: System.out.println("Weekend");
}
\`\`\`
**Output:** \`Wednesday\`

### 5. Nested if
\`\`\`java
int age = 22;
boolean hasID = true;

if (age >= 18) {
    if (hasID) {
        System.out.println("Entry allowed");
    } else {
        System.out.println("Bring your ID");
    }
} else {
    System.out.println("Underage - not allowed");
}
\`\`\`
**Output:** \`Entry allowed\`

### Key Notes
- Always use \`{}\` even for single-line if blocks (best practice)
- \`switch\` works with int, char, String, enum
- Don't forget \`break\` in switch — otherwise "fall-through" happens
- Use \`default\` case in switch for unexpected values`,

  "java-loops": `## Loops in Java

### 1. for Loop
\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println("Count: " + i);
}
\`\`\`
**Output:**
\`\`\`
Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
\`\`\`

### 2. while Loop
\`\`\`java
int i = 1;
while (i <= 5) {
    System.out.println("i = " + i);
    i++;
}
\`\`\`

### 3. do-while Loop
\`\`\`java
int i = 1;
do {
    System.out.println("i = " + i);
    i++;
} while (i <= 5);
\`\`\`
**Note:** Executes at least once, even if condition is false.

### 4. Enhanced for Loop (for-each)
\`\`\`java
int[] marks = {85, 90, 78, 92, 88};
for (int m : marks) {
    System.out.println("Marks: " + m);
}
\`\`\`

### 5. break and continue
\`\`\`java
// break - exits the loop
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;
    System.out.print(i + " ");  // 1 2 3 4
}

// continue - skips current iteration
for (int i = 1; i <= 5; i++) {
    if (i == 3) continue;
    System.out.print(i + " ");  // 1 2 4 5
}
\`\`\`

### Pattern Printing Example
\`\`\`java
// Right triangle pattern
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}
\`\`\`
**Output:**
\`\`\`
*
* *
* * *
* * * *
* * * * *
\`\`\`

### When to Use Which Loop?
| Loop | Best For |
|------|----------|
| for | When you know the number of iterations |
| while | When condition-based (unknown iterations) |
| do-while | When you need at least one execution |
| for-each | When iterating over arrays/collections |

### Key Notes
- Infinite loop: \`while(true)\` or \`for(;;)\`
- \`break\` exits only the innermost loop
- \`continue\` skips to the next iteration
- Avoid modifying loop variable inside the loop body`,

  "java-functions": `## Functions (Methods) in Java

### What is a Method?
A method is a block of code that performs a specific task. It runs only when called.

### Syntax
\`\`\`java
returnType methodName(parameters) {
    // method body
    return value;  // if not void
}
\`\`\`

### Example
\`\`\`java
public class MethodDemo {
    // Method with return value
    static int add(int a, int b) {
        return a + b;
    }

    // Method without return value
    static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        int sum = add(10, 20);
        System.out.println("Sum: " + sum);  // Sum: 30
        greet("Ravi");  // Hello, Ravi!
    }
}
\`\`\`

### Method Overloading
Same method name, different parameters:
\`\`\`java
static int add(int a, int b) { return a + b; }
static double add(double a, double b) { return a + b; }
static int add(int a, int b, int c) { return a + b + c; }
\`\`\`

### Recursion
A method calling itself:
\`\`\`java
static int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}
// factorial(5) = 5 × 4 × 3 × 2 × 1 = 120
\`\`\`

### Key Notes
- \`void\` methods don't return anything
- Use \`static\` to call without creating object
- Method overloading = compile-time polymorphism
- Recursion needs a base case to avoid infinite loop`,

  "java-arrays": `## Arrays & Collections in Java

### Arrays
An array stores multiple values of the same type in a single variable.

\`\`\`java
// Declaration and initialization
int[] marks = {85, 90, 78, 92, 88};
String[] names = new String[3];  // Empty array of size 3
names[0] = "Ravi";
names[1] = "Priya";
names[2] = "Arjun";

// Accessing elements
System.out.println(marks[0]);  // 85
System.out.println(marks.length);  // 5
\`\`\`

### 2D Arrays
\`\`\`java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
System.out.println(matrix[1][2]);  // 6
\`\`\`

### ArrayList (Dynamic Array)
\`\`\`java
import java.util.ArrayList;

ArrayList<String> students = new ArrayList<>();
students.add("Ravi");
students.add("Priya");
students.add("Arjun");
students.remove("Priya");

System.out.println(students);       // [Ravi, Arjun]
System.out.println(students.size()); // 2
System.out.println(students.get(0)); // Ravi
\`\`\`

### HashMap
\`\`\`java
import java.util.HashMap;

HashMap<String, Integer> scores = new HashMap<>();
scores.put("Ravi", 85);
scores.put("Priya", 92);
scores.put("Arjun", 78);

System.out.println(scores.get("Priya"));  // 92
System.out.println(scores.containsKey("Ravi"));  // true
\`\`\`

### Key Notes
- Arrays have **fixed size**; ArrayList is **dynamic**
- Array index starts at **0**
- \`ArrayIndexOutOfBoundsException\` if you access invalid index
- Use ArrayList for most practical applications
- HashMap stores key-value pairs`,

  "java-oops": `## OOP Concepts in Java

### The 4 Pillars of OOP

### 1. Encapsulation
Wrapping data and methods together, hiding internal details.
\`\`\`java
class Student {
    private String name;  // Hidden
    private int age;

    public String getName() { return name; }           // Getter
    public void setName(String name) { this.name = name; }  // Setter
    public int getAge() { return age; }
    public void setAge(int age) {
        if (age > 0) this.age = age;  // Validation
    }
}
\`\`\`

### 2. Inheritance
One class inherits properties of another.
\`\`\`java
class Animal {
    void eat() { System.out.println("Eating..."); }
}

class Dog extends Animal {
    void bark() { System.out.println("Barking..."); }
}

// Dog d = new Dog();
// d.eat();  // Inherited from Animal
// d.bark(); // Own method
\`\`\`

### 3. Polymorphism
Same method name, different behavior.

**Method Overloading (Compile-time):**
\`\`\`java
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}
\`\`\`

**Method Overriding (Runtime):**
\`\`\`java
class Animal {
    void sound() { System.out.println("Some sound"); }
}
class Cat extends Animal {
    @Override
    void sound() { System.out.println("Meow"); }
}
\`\`\`

### 4. Abstraction
Hiding complex details, showing only essentials.
\`\`\`java
abstract class Shape {
    abstract double area();  // No body
    void display() { System.out.println("Shape"); }
}

class Circle extends Shape {
    double radius = 5;
    double area() { return 3.14 * radius * radius; }
}
\`\`\`

### Interface
\`\`\`java
interface Drawable {
    void draw();  // Abstract by default
}

class Rectangle implements Drawable {
    public void draw() {
        System.out.println("Drawing rectangle");
    }
}
\`\`\`

### Key Differences
| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| Methods | Abstract + Concrete | All abstract (before Java 8) |
| Variables | Any type | public static final only |
| Inheritance | Single | Multiple |
| Constructor | Yes | No |
| Keyword | extends | implements |

### Key Notes
- Encapsulation = data hiding using private + getters/setters
- Inheritance = code reuse using \`extends\`
- Polymorphism = many forms (overloading + overriding)
- Abstraction = hiding complexity using abstract class/interface`,

  "java-examples": `## Example Programs in Java

### 1. Factorial
\`\`\`java
public class Factorial {
    public static void main(String[] args) {
        int n = 5, fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        System.out.println("Factorial of " + n + " = " + fact);
    }
}
\`\`\`
**Output:** \`Factorial of 5 = 120\`

### 2. Fibonacci Series
\`\`\`java
public class Fibonacci {
    public static void main(String[] args) {
        int n = 10, a = 0, b = 1;
        System.out.print(a + " " + b);
        for (int i = 2; i < n; i++) {
            int c = a + b;
            System.out.print(" " + c);
            a = b;
            b = c;
        }
    }
}
\`\`\`
**Output:** \`0 1 1 2 3 5 8 13 21 34\`

### 3. Palindrome Check
\`\`\`java
public class Palindrome {
    public static void main(String[] args) {
        String str = "madam";
        String rev = new StringBuilder(str).reverse().toString();
        if (str.equals(rev)) {
            System.out.println(str + " is a palindrome");
        } else {
            System.out.println(str + " is not a palindrome");
        }
    }
}
\`\`\`
**Output:** \`madam is a palindrome\`

### 4. Prime Number Check
\`\`\`java
public class PrimeCheck {
    public static void main(String[] args) {
        int n = 29;
        boolean isPrime = true;
        if (n <= 1) isPrime = false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) { isPrime = false; break; }
        }
        System.out.println(n + (isPrime ? " is prime" : " is not prime"));
    }
}
\`\`\`
**Output:** \`29 is prime\`

### 5. Bubble Sort
\`\`\`java
public class BubbleSort {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        for (int val : arr) System.out.print(val + " ");
    }
}
\`\`\`
**Output:** \`11 12 22 25 34 64 90\``,

  "java-errors": `## Common Errors in Java

### 1. NullPointerException
\`\`\`java
String name = null;
System.out.println(name.length());  // ❌ NullPointerException
\`\`\`
**Fix:** Always check for null: \`if (name != null)\`

### 2. ArrayIndexOutOfBoundsException
\`\`\`java
int[] arr = {1, 2, 3};
System.out.println(arr[5]);  // ❌ Index 5 doesn't exist
\`\`\`
**Fix:** Check \`arr.length\` before accessing

### 3. ClassCastException
\`\`\`java
Object obj = "Hello";
Integer num = (Integer) obj;  // ❌ String can't be cast to Integer
\`\`\`
**Fix:** Use \`instanceof\` check before casting

### 4. StackOverflowError
\`\`\`java
void infinite() { infinite(); }  // ❌ No base case
\`\`\`
**Fix:** Always have a base case in recursion

### 5. NumberFormatException
\`\`\`java
int x = Integer.parseInt("abc");  // ❌ Not a number
\`\`\`
**Fix:** Validate input or use try-catch

### 6. ConcurrentModificationException
\`\`\`java
ArrayList<String> list = new ArrayList<>();
for (String s : list) {
    list.remove(s);  // ❌ Modifying while iterating
}
\`\`\`
**Fix:** Use Iterator's remove() method

### Key Notes
- Use **try-catch** for handling expected exceptions
- **Checked exceptions** must be handled (IOException, SQLException)
- **Unchecked exceptions** are runtime errors (NullPointer, ArrayIndex)
- Use **finally** block for cleanup code`,

  "java-interview": `## Top 20 Java Interview Questions

### Q1: What is the difference between JDK, JRE, and JVM?
**A:** JDK = Development tools + JRE. JRE = Runtime libraries + JVM. JVM = Executes bytecode.

### Q2: Is Java purely object-oriented?
**A:** No, because it supports primitive data types (int, char, etc.) which are not objects.

### Q3: What is the difference between == and .equals()?
**A:** \`==\` compares references (memory addresses). \`.equals()\` compares actual content/values.

### Q4: What is method overloading vs overriding?
**A:** Overloading = same name, different parameters (compile-time). Overriding = same name and parameters in child class (runtime).

### Q5: Can we override static methods?
**A:** No. Static methods belong to the class, not objects. You can hide them but not override.

### Q6: What is the difference between abstract class and interface?
**A:** Abstract class can have concrete methods; interface (pre-Java 8) has only abstract. Class can implement multiple interfaces but extend only one class.

### Q7: What are access modifiers?
**A:** public (everywhere), protected (same package + subclass), default (same package), private (same class only).

### Q8: What is a constructor?
**A:** Special method that initializes an object. Same name as class, no return type, called automatically.

### Q9: What is the difference between ArrayList and LinkedList?
**A:** ArrayList = dynamic array (fast access). LinkedList = doubly linked list (fast insert/delete).

### Q10: What is garbage collection?
**A:** Automatic memory management. JVM removes objects with no references.

### Q11: What is \`this\` keyword?
**A:** Refers to the current object instance.

### Q12: What is \`super\` keyword?
**A:** Refers to the parent class. Used to call parent constructor or methods.

### Q13: What is a final keyword?
**A:** final variable = constant. final method = can't override. final class = can't extend.

### Q14: What is exception handling?
**A:** Mechanism to handle runtime errors using try-catch-finally-throw-throws.

### Q15: What is multithreading?
**A:** Running multiple threads simultaneously. Implement via Thread class or Runnable interface.

### Q16: What is the String pool?
**A:** A special memory area where Java stores string literals to save memory.

### Q17: What is the difference between String, StringBuilder, and StringBuffer?
**A:** String = immutable. StringBuilder = mutable, not thread-safe, faster. StringBuffer = mutable, thread-safe, slower.

### Q18: What is a HashMap?
**A:** Stores key-value pairs. Keys must be unique. Uses hashing for O(1) average access.

### Q19: What is the difference between throw and throws?
**A:** \`throw\` = used to explicitly throw an exception. \`throws\` = declares that a method may throw exceptions.

### Q20: What is SOLID principles?
**A:** S=Single Responsibility, O=Open/Closed, L=Liskov Substitution, I=Interface Segregation, D=Dependency Inversion.`,

  "java-setup": `## Installation & Setup

### Step 1: Download JDK
- Go to [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
- Download the latest version for your OS (Windows/Mac/Linux)

### Step 2: Install JDK
- Run the installer and follow the instructions
- Default installation path (Windows): \`C:\\Program Files\\Java\\jdk-XX\`

### Step 3: Set PATH Variable (Windows)
1. Right-click "This PC" → Properties → Advanced System Settings
2. Click "Environment Variables"
3. Under System Variables, find "Path" → Edit → Add: \`C:\\Program Files\\Java\\jdk-XX\\bin\`
4. Add new variable: \`JAVA_HOME\` = \`C:\\Program Files\\Java\\jdk-XX\`

### Step 4: Verify Installation
\`\`\`bash
java -version
javac -version
\`\`\`

### Step 5: Choose an IDE
| IDE | Best For |
|-----|----------|
| **IntelliJ IDEA** | Professional development (recommended) |
| **Eclipse** | Enterprise Java |
| **VS Code** | Lightweight, with Java extensions |
| **NetBeans** | Beginner-friendly |

### Your First Program
1. Create file: \`HelloWorld.java\`
2. Write code:
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Java is installed successfully!");
    }
}
\`\`\`
3. Compile: \`javac HelloWorld.java\`
4. Run: \`java HelloWorld\`

**Output:** \`Java is installed successfully!\``,

  "java-syntax": `## Basic Syntax in Java

### Structure of a Java Program
\`\`\`java
// Package declaration (optional)
package com.example;

// Import statements
import java.util.Scanner;

// Class definition
public class MyProgram {

    // Main method - entry point
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello Java!");
    }
}
\`\`\`

### Rules
- **File name** must match **class name** (MyProgram.java)
- Every Java application must have a **main method**
- Statements end with **semicolons (;)**
- Code blocks are enclosed in **curly braces {}**
- Java is **case-sensitive** (Main ≠ main)

### Comments
\`\`\`java
// Single-line comment

/* Multi-line
   comment */

/** Javadoc comment
 *  Used for documentation
 */
\`\`\`

### Input and Output
\`\`\`java
import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        System.out.print("Enter your age: ");
        int age = sc.nextInt();

        System.out.println("Hello " + name + ", you are " + age + " years old.");
        sc.close();
    }
}
\`\`\`

### Key Notes
- \`System.out.println()\` → prints with newline
- \`System.out.print()\` → prints without newline
- \`Scanner\` class is used for user input
- Use \`+\` for string concatenation`,

  "java-summary": `## Java Quick Revision Summary

### Core Concepts at a Glance

| Concept | Key Point |
|---------|-----------|
| Variables | int, double, String, boolean — declare before use |
| Data Types | 8 primitive types + reference types |
| Operators | Arithmetic, relational, logical, assignment, ternary |
| if-else | Conditional branching |
| switch | Multi-way branching (int, char, String) |
| for loop | Known iterations |
| while | Unknown iterations, condition-based |
| Arrays | Fixed-size, index starts at 0 |
| ArrayList | Dynamic size, use for most cases |
| Methods | Reusable code blocks, can be overloaded |
| OOP | Encapsulation, Inheritance, Polymorphism, Abstraction |
| Exception | try-catch-finally for error handling |

### Must-Know Code Snippets
- Factorial, Fibonacci, Palindrome, Prime check, Sorting
- String reversal, Array operations, HashMap usage

### Quick Tips for Interviews
- String is immutable in Java
- == checks reference, .equals() checks value
- ArrayList is dynamic, Array is fixed
- Abstract class: partial abstraction. Interface: full abstraction
- Java doesn't support multiple class inheritance (but supports multiple interfaces)
- Garbage collection is automatic`,

  // ===== PYTHON =====
  "python-intro": `## Introduction to Python

### What is Python?
Python is a high-level, interpreted programming language created by **Guido van Rossum** in **1991**. It emphasizes code readability with its clean syntax.

### Why Python?
- **Simple syntax** — reads like English
- **Versatile** — web, data science, AI, automation, scripting
- **Huge community** — extensive libraries and support
- **Most in-demand** language in 2024
- **Great for beginners** — minimal boilerplate code

### Python vs Other Languages
| Feature | Python | Java | C |
|---------|--------|------|---|
| Syntax | Simple | Moderate | Complex |
| Typing | Dynamic | Static | Static |
| Speed | Slower | Faster | Fastest |
| Use Case | AI, Web, Data | Enterprise, Android | Systems, Embedded |
| Learning Curve | Easy | Moderate | Hard |

### Your First Python Program
\`\`\`python
print("Hello, World!")
\`\`\`
**Output:** \`Hello, World!\`

That's it! No class, no main method, no semicolons.

### Key Features
- **Interpreted**: No compilation needed — runs line by line
- **Dynamically typed**: No need to declare variable types
- **Indentation-based**: Uses whitespace instead of braces
- **Cross-platform**: Works on Windows, Mac, Linux
- **Open source**: Free to use and distribute

### 🎯 Interview Question
**Q: What is the difference between Python 2 and Python 3?**
*A: Python 3 is the current version. Key differences: print is a function in Python 3 \`print()\`, integer division returns float, Unicode strings by default. Python 2 is no longer supported since 2020.*`,

  "python-variables": `## Variables in Python

### What is a Variable?
A variable is a name that refers to a value stored in memory. Python variables are **dynamically typed** — no need to specify the type.

### Creating Variables
\`\`\`python
name = "Ravi"        # String
age = 21             # Integer
cgpa = 8.5           # Float
is_placed = True     # Boolean

print(name, age, cgpa, is_placed)
\`\`\`
**Output:** \`Ravi 21 8.5 True\`

### Multiple Assignment
\`\`\`python
a, b, c = 10, 20, 30
x = y = z = 0
\`\`\`

### Variable Types
\`\`\`python
x = 10
print(type(x))   # <class 'int'>

x = "hello"
print(type(x))   # <class 'str'>  (type changed!)
\`\`\`

### Naming Rules
- Must start with letter or underscore
- Cannot start with number
- Case-sensitive: \`Name\` ≠ \`name\`
- Convention: \`snake_case\` (e.g., \`student_name\`)
- Constants: \`ALL_CAPS\` (e.g., \`MAX_SIZE = 100\`)

### Key Notes
- Python is dynamically typed — variable type can change
- No need to declare type explicitly
- Use \`type()\` to check variable type
- Use meaningful variable names for readability`,

  "python-datatypes": `## Data Types in Python

### Built-in Data Types
| Category | Types |
|----------|-------|
| Numeric | int, float, complex |
| Text | str |
| Boolean | bool (True/False) |
| Sequence | list, tuple, range |
| Mapping | dict |
| Set | set, frozenset |
| None | NoneType |

### Examples
\`\`\`python
# Numeric
age = 21          # int
price = 99.99     # float
z = 3 + 4j        # complex

# String
name = "Python"
greeting = 'Hello'
multi = """This is
a multi-line string"""

# Boolean
is_active = True
is_empty = False

# List (mutable, ordered)
marks = [85, 90, 78, 92]

# Tuple (immutable, ordered)
coordinates = (10, 20)

# Dictionary (key-value pairs)
student = {"name": "Ravi", "age": 21}

# Set (unique, unordered)
skills = {"Python", "Java", "SQL"}
\`\`\`

### Type Conversion
\`\`\`python
x = "100"
y = int(x)     # String to int → 100
z = float(x)   # String to float → 100.0
s = str(42)    # Int to string → "42"
\`\`\`

### Key Notes
- Python automatically detects data types
- Lists are mutable; tuples are immutable
- Dictionaries use key-value pairs
- Sets don't allow duplicates
- Use \`type()\` to check data type`,

  "python-syntax": `## Basic Syntax in Python

### Indentation
Python uses **indentation** (whitespace) to define code blocks — no curly braces needed!

\`\`\`python
if True:
    print("This is inside if")    # 4 spaces indent
    print("Still inside")
print("This is outside if")
\`\`\`

### Comments
\`\`\`python
# This is a single-line comment

"""
This is a
multi-line comment (docstring)
"""
\`\`\`

### Print Function
\`\`\`python
print("Hello")                    # Hello
print("Age:", 21)                 # Age: 21
print("A", "B", "C", sep="-")    # A-B-C
print("Hello", end=" ")          # No newline at end
print("World")                   # Hello World
\`\`\`

### Input Function
\`\`\`python
name = input("Enter your name: ")
age = int(input("Enter your age: "))   # Convert to int
print(f"Hello {name}, you are {age}")
\`\`\`

### f-Strings (Formatted Strings)
\`\`\`python
name = "Ravi"
marks = 95
print(f"{name} scored {marks} marks")  # Ravi scored 95 marks
print(f"Percentage: {marks/100:.2%}")  # Percentage: 95.00%
\`\`\`

### Key Notes
- Indentation is mandatory (4 spaces recommended)
- No semicolons needed at end of lines
- \`input()\` always returns a string — cast if needed
- f-strings are the preferred way to format output`,

  "python-setup": `## Installation & Setup

### Step 1: Download Python
- Visit [python.org](https://www.python.org/downloads/)
- Download the latest Python 3.x version

### Step 2: Install
- **Windows**: Run installer → ✅ Check "Add Python to PATH" → Install
- **Mac**: \`brew install python3\`
- **Linux**: \`sudo apt install python3\`

### Step 3: Verify
\`\`\`bash
python --version    # or python3 --version
pip --version
\`\`\`

### Step 4: Choose an IDE/Editor
| Tool | Best For |
|------|----------|
| **VS Code** | Recommended, lightweight, extensions |
| **PyCharm** | Professional Python IDE |
| **IDLE** | Comes with Python, basic |
| **Jupyter Notebook** | Data science, interactive |

### First Program
\`\`\`python
print("Python is installed!")
\`\`\`
Run: \`python first.py\``,

  "python-operators": `## Operators in Python

### 1. Arithmetic
\`\`\`python
print(10 + 3)    # 13
print(10 - 3)    # 7
print(10 * 3)    # 30
print(10 / 3)    # 3.333...
print(10 // 3)   # 3 (floor division)
print(10 % 3)    # 1 (modulus)
print(10 ** 3)   # 1000 (power)
\`\`\`

### 2. Comparison
\`\`\`python
print(5 == 5)    # True
print(5 != 3)    # True
print(5 > 3)     # True
print(5 < 3)     # False
\`\`\`

### 3. Logical
\`\`\`python
print(True and False)   # False
print(True or False)    # True
print(not True)         # False
\`\`\`

### 4. Membership
\`\`\`python
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)      # True
print("grape" not in fruits)   # True
\`\`\`

### 5. Identity
\`\`\`python
a = [1, 2, 3]
b = a
c = [1, 2, 3]
print(a is b)     # True (same object)
print(a is c)     # False (different objects)
print(a == c)     # True (same value)
\`\`\`

### Key Notes
- \`//\` is floor division (rounds down)
- \`**\` is power operator
- \`in\` checks membership in sequences
- \`is\` checks identity (same object), \`==\` checks equality (same value)`,

  "python-conditionals": `## Conditional Statements in Python

### if Statement
\`\`\`python
age = 18
if age >= 18:
    print("You can vote!")
\`\`\`

### if-else
\`\`\`python
marks = 55
if marks >= 40:
    print("Pass")
else:
    print("Fail")
\`\`\`

### if-elif-else
\`\`\`python
marks = 75
if marks >= 90:
    print("Grade A")
elif marks >= 75:
    print("Grade B")
elif marks >= 60:
    print("Grade C")
elif marks >= 40:
    print("Grade D")
else:
    print("Fail")
\`\`\`
**Output:** \`Grade B\`

### Ternary Operator
\`\`\`python
age = 20
status = "Adult" if age >= 18 else "Minor"
print(status)  # Adult
\`\`\`

### Key Notes
- Python uses \`elif\` (not \`else if\`)
- Indentation defines the code block
- No parentheses needed around conditions
- No switch-case in Python (use if-elif or match-case in 3.10+)`,

  "python-loops": `## Loops in Python

### for Loop
\`\`\`python
for i in range(5):
    print(i, end=" ")  # 0 1 2 3 4

for i in range(1, 6):
    print(i, end=" ")  # 1 2 3 4 5

for i in range(0, 10, 2):
    print(i, end=" ")  # 0 2 4 6 8
\`\`\`

### while Loop
\`\`\`python
i = 1
while i <= 5:
    print(i, end=" ")
    i += 1  # 1 2 3 4 5
\`\`\`

### for with Lists
\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

### break and continue
\`\`\`python
for i in range(10):
    if i == 5:
        break       # Exit loop
    print(i, end=" ")  # 0 1 2 3 4

for i in range(5):
    if i == 2:
        continue    # Skip this iteration
    print(i, end=" ")  # 0 1 3 4
\`\`\`

### List Comprehension
\`\`\`python
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

### Key Notes
- \`range(n)\` generates 0 to n-1
- \`range(start, stop, step)\` for custom ranges
- List comprehension = compact loop for creating lists
- Python has no do-while loop`,

  "python-functions": `## Functions in Python

### Basic Function
\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Ravi")  # Hello, Ravi!
\`\`\`

### Return Values
\`\`\`python
def add(a, b):
    return a + b

result = add(10, 20)
print(result)  # 30
\`\`\`

### Default Parameters
\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Ravi")           # Hello, Ravi!
greet("Ravi", "Hi")     # Hi, Ravi!
\`\`\`

### *args and **kwargs
\`\`\`python
def total(*args):
    return sum(args)

print(total(1, 2, 3, 4, 5))  # 15

def info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

info(name="Ravi", age=21, city="Chennai")
\`\`\`

### Lambda Functions
\`\`\`python
square = lambda x: x ** 2
print(square(5))  # 25

add = lambda a, b: a + b
print(add(3, 7))  # 10
\`\`\`

### Key Notes
- \`def\` keyword defines a function
- \`return\` sends back a value
- \`*args\` = variable positional arguments (tuple)
- \`**kwargs\` = variable keyword arguments (dict)
- Lambda = anonymous one-line function`,

  "python-collections": `## Collections in Python

### 1. Lists (Mutable, Ordered)
\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")          # Add to end
fruits.insert(1, "avocado")    # Insert at index
fruits.remove("banana")        # Remove by value
fruits.pop()                   # Remove last
print(fruits)                  # ['apple', 'avocado', 'cherry']
print(len(fruits))             # 3
print(fruits[0])               # apple
print(fruits[-1])              # cherry
print(fruits[1:3])             # ['avocado', 'cherry']
\`\`\`

### 2. Tuples (Immutable, Ordered)
\`\`\`python
coordinates = (10, 20, 30)
print(coordinates[0])    # 10
# coordinates[0] = 5     # ❌ Error! Tuples are immutable
x, y, z = coordinates    # Tuple unpacking
\`\`\`

### 3. Dictionaries (Key-Value, Mutable)
\`\`\`python
student = {
    "name": "Ravi",
    "age": 21,
    "marks": [85, 90, 78]
}
print(student["name"])          # Ravi
student["college"] = "XYZ"      # Add new key
del student["age"]              # Delete key
print(student.keys())           # dict_keys(['name', 'marks', 'college'])
print(student.values())
\`\`\`

### 4. Sets (Unique, Unordered)
\`\`\`python
skills = {"Python", "Java", "Python", "SQL"}
print(skills)              # {'Python', 'Java', 'SQL'} (no duplicates)
skills.add("React")
skills.discard("Java")

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)   # Union: {1,2,3,4,5,6}
print(a & b)   # Intersection: {3,4}
print(a - b)   # Difference: {1,2}
\`\`\`

### Comparison
| Feature | List | Tuple | Dict | Set |
|---------|------|-------|------|-----|
| Mutable | ✅ | ❌ | ✅ | ✅ |
| Ordered | ✅ | ✅ | ✅ (3.7+) | ❌ |
| Duplicates | ✅ | ✅ | Keys: ❌ | ❌ |
| Index | ✅ | ✅ | Key-based | ❌ |`,

  "python-oops": `## OOP Concepts in Python

### Class and Object
\`\`\`python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"I'm {self.name}, age {self.age}")

s1 = Student("Ravi", 21)
s1.introduce()  # I'm Ravi, age 21
\`\`\`

### Inheritance
\`\`\`python
class Animal:
    def speak(self):
        print("Some sound")

class Dog(Animal):
    def speak(self):     # Override
        print("Woof!")

class Cat(Animal):
    def speak(self):
        print("Meow!")

d = Dog()
d.speak()  # Woof!
\`\`\`

### Encapsulation
\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance   # Private

    def get_balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

acc = BankAccount(1000)
acc.deposit(500)
print(acc.get_balance())  # 1500
# print(acc.__balance)    # ❌ Error! Private
\`\`\`

### Polymorphism
\`\`\`python
class Shape:
    def area(self): pass

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

class Rectangle(Shape):
    def __init__(self, l, w): self.l, self.w = l, w
    def area(self): return self.l * self.w

shapes = [Circle(5), Rectangle(4, 6)]
for s in shapes:
    print(s.area())  # 78.5, 24
\`\`\`

### Key Notes
- \`__init__\` = constructor
- \`self\` = reference to current instance
- \`__variable\` = private (name mangling)
- Python supports multiple inheritance
- Use \`super()\` to call parent methods`,

  "python-examples": `## Example Programs in Python

### 1. Factorial
\`\`\`python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

### 2. Fibonacci
\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b

fibonacci(10)  # 0 1 1 2 3 5 8 13 21 34
\`\`\`

### 3. Palindrome
\`\`\`python
word = "madam"
if word == word[::-1]:
    print(f"{word} is a palindrome")
\`\`\`

### 4. Prime Check
\`\`\`python
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

print(is_prime(29))  # True
\`\`\`

### 5. Sorting
\`\`\`python
# Built-in sort
nums = [64, 34, 25, 12, 22]
nums.sort()
print(nums)  # [12, 22, 25, 34, 64]

# Bubble sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
\`\`\``,

  "python-errors": `## Common Errors in Python

### 1. IndentationError
\`\`\`python
if True:
print("Hello")  # ❌ Missing indentation
\`\`\`
**Fix:** Add 4 spaces before print

### 2. NameError
\`\`\`python
print(x)  # ❌ x is not defined
\`\`\`
**Fix:** Define variable before using

### 3. TypeError
\`\`\`python
result = "age: " + 21  # ❌ Can't add string and int
\`\`\`
**Fix:** \`"age: " + str(21)\` or \`f"age: {21}"\`

### 4. IndexError
\`\`\`python
lst = [1, 2, 3]
print(lst[5])  # ❌ Index out of range
\`\`\`

### 5. KeyError
\`\`\`python
d = {"name": "Ravi"}
print(d["age"])  # ❌ Key doesn't exist
\`\`\`
**Fix:** Use \`d.get("age", "N/A")\`

### 6. ZeroDivisionError
\`\`\`python
print(10 / 0)  # ❌
\`\`\`
**Fix:** Check before dividing

### Key Notes
- Use \`try-except\` to handle errors gracefully
- \`finally\` block runs regardless of error
- Print error messages for debugging: \`except Exception as e: print(e)\``,

  "python-interview": `## Top 20 Python Interview Questions

**Q1: Is Python interpreted or compiled?**
A: Interpreted. Code runs line by line without separate compilation.

**Q2: What are mutable and immutable types?**
A: Mutable: list, dict, set. Immutable: int, str, tuple, frozenset.

**Q3: List vs Tuple?**
A: List is mutable and uses []. Tuple is immutable and uses ().

**Q4: What is a dictionary?**
A: Unordered collection of key-value pairs. Keys must be unique and immutable.

**Q5: What is list comprehension?**
A: Compact syntax: \`[x**2 for x in range(5)]\` → \`[0, 1, 4, 9, 16]\`

**Q6: What is \`self\`?**
A: Reference to the current instance of a class.

**Q7: What is \`__init__\`?**
A: Constructor method, called when object is created.

**Q8: What is the difference between \`==\` and \`is\`?**
A: \`==\` compares values. \`is\` compares object identity (memory address).

**Q9: What are decorators?**
A: Functions that modify other functions using @decorator syntax.

**Q10: What is a generator?**
A: Function using \`yield\` to return values lazily, one at a time.

**Q11: What is PIP?**
A: Python package manager. Install packages: \`pip install package_name\`

**Q12: What is a virtual environment?**
A: Isolated Python environment. Create: \`python -m venv myenv\`

**Q13: How is memory managed?**
A: Automatic garbage collection + reference counting.

**Q14: What is the GIL?**
A: Global Interpreter Lock — allows only one thread to execute at a time in CPython.

**Q15: What are *args and **kwargs?**
A: *args = variable positional args (tuple). **kwargs = variable keyword args (dict).

**Q16: What is slicing?**
A: Extracting parts of sequences: \`list[start:stop:step]\`

**Q17: Exception handling?**
A: try-except-else-finally blocks.

**Q18: What is lambda?**
A: Anonymous function: \`lambda x: x*2\`

**Q19: File handling?**
A: \`open("file.txt", "r")\` with modes: r, w, a, r+

**Q20: What is __name__ == "__main__"?**
A: Checks if file is run directly (not imported).`,

  "python-summary": `## Python Quick Revision Summary

| Concept | Key Point |
|---------|-----------|
| Variables | Dynamic typing, snake_case naming |
| Data Types | int, float, str, bool, list, tuple, dict, set |
| Operators | +, -, *, /, //, **, %, in, is, and, or, not |
| if-elif-else | Indentation-based, no switch (use match in 3.10+) |
| Loops | for + range(), while, list comprehension |
| Functions | def, return, *args, **kwargs, lambda |
| OOP | class, __init__, self, inheritance, polymorphism |
| Collections | list (mutable), tuple (immutable), dict (key-value), set (unique) |
| Error Handling | try-except-finally |
| File I/O | open(), read(), write(), with statement |`,
};
