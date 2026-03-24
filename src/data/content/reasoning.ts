export const reasoningContent: Record<string, string> = {
  "blood-relations": `## 📚 Introduction
Blood Relations is a reasoning topic where you determine family relationships based on given information. Questions involve coded relationships, family trees, and generational mapping.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 2–3 questions | Medium |
| Infosys | 1–3 questions | Medium |
| Wipro | 1–2 questions | Easy–Medium |

## 📐 Key Relationships

> **Relationship Chart**
> - Father's/Mother's son → Brother
> - Father's/Mother's daughter → Sister
> - Father's father → Grandfather
> - Mother's father → Maternal Grandfather
> - Father's brother → Uncle (Paternal)
> - Mother's brother → Uncle (Maternal / Mama)
> - Father's sister → Aunt (Bua)
> - Mother's sister → Aunt (Mausi)
> - Son's wife → Daughter-in-law
> - Daughter's husband → Son-in-law
> - Brother's son → Nephew
> - Sister's daughter → Niece
> - Husband's/Wife's sister → Sister-in-law

### Solving Strategy
1. **Draw a family tree** — always start from the given person
2. **Use symbols**: Male = +, Female = -, Generation lines = |
3. **Read the statement backward** to find the answer
4. **Coded relations**: First decode the relationship words, then solve

## ✅ Solved Examples

### Type 1: Direct Relation
**Question:** Pointing to a photograph, Ravi says "She is the daughter of my grandfather's only son." How is the girl related to Ravi?
**Method:**
Step 1: Grandfather's only son = Ravi's father
Step 2: Father's daughter = Ravi's sister
**Answer:** Sister ✅

### Type 2: Coded Statement
**Question:** A is the father of B. B is the mother of C. D is the husband of A's daughter. How is D related to C?
**Method:**
Step 1: A (father) → B (daughter, since B is a mother)
Step 2: B is mother of C
Step 3: D is husband of A's daughter = D is B's husband
Step 4: D is C's **father**
**Answer:** Father ✅

### Type 3: Complex Chain
**Question:** Introducing Ravi, Sita says "His mother is the only daughter of my mother." How is Sita related to Ravi?
**Method:**
Step 1: "Only daughter of my mother" = Sita herself
Step 2: So Ravi's mother = Sita
**Answer:** Mother ✅

## 💡 Shortcut Tips
- "Only son/daughter of my father/mother" = the speaker themselves
- Always draw the family tree — don't try to solve mentally for complex problems
- Read from the end of the sentence backward
- Watch for gender clues in names

## ⚠️ Common Mistakes
- Assuming gender from names (always check clues in the question)
- Not considering that "only son" means that person IS the speaker
- Mixing up paternal and maternal sides
- Forgetting in-law relationships

## 📝 Practice Questions

**Q1.** A man said to a lady, "Your mother's husband's sister is my aunt." How is the lady related to the man?
*Answer:* Lady's mother's husband = Lady's father. Father's sister = Aunt. Same aunt → They are **siblings (sister)**

**Q2.** Pointing to a boy, Meera says "He is the son of the only sister of my father." How is the boy related to Meera?
*Answer:* Father's only sister = Meera's aunt. Aunt's son = **Cousin**

**Q3.** If A + B means A is father of B, A - B means A is sister of B, A × B means A is mother of B. What does P + Q - R mean?
*Answer:* P is father of Q, Q is sister of R. So P is **father** of R.

## 🔑 Key Points Summary
- Blood relations require careful reading and diagramming
- "Only" is a key word — pay special attention
- Gender identification is crucial
- Practice with family tree drawings`,

  "coding-decoding": `## 📚 Introduction
Coding-Decoding involves encoding messages using a specific pattern or rule. You need to identify the pattern and apply it to decode or encode new words/numbers.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 2–4 questions | Easy–Medium |
| Infosys | 2–3 questions | Medium |
| Wipro | 1–3 questions | Easy |

## 📐 Types of Coding

> **Common Coding Patterns**
> 1. **Letter Shifting**: Each letter shifted by fixed positions (A→C, B→D = +2)
> 2. **Reverse Coding**: Word written in reverse (COME → EMOC)
> 3. **Number Coding**: Letters assigned numbers (A=1, B=2, ..., Z=26)
> 4. **Opposite Letter Coding**: A↔Z, B↔Y, C↔X (sum = 27)
> 5. **Positional Coding**: Based on position in the word
> 6. **Mixed Coding**: Combination of above patterns

### Opposite Letter Pairs (Must Know!)
| A↔Z | B↔Y | C↔X | D↔W | E↔V |
|------|------|------|------|------|
| F↔U | G↔T | H↔S | I↔R | J↔Q |
| K↔P | L↔O | M↔N | | |

**Tip:** Sum of opposite letter positions = 27

## ✅ Solved Examples

### Type 1: Letter Shifting
**Question:** If CAT = FDW, how is DOG coded?
**Method:**
C(3)+3=F(6), A(1)+3=D(4), T(20)+3=W(23) → Pattern: +3
D(4)+3=G, O(15)+3=R, G(7)+3=J → **GRJ**
**Answer:** GRJ ✅

### Type 2: Reverse Coding
**Question:** If FIRE = ERIF, how is WATER coded?
**Method:** Simple reversal → WATER = **RETAW**
**Answer:** RETAW ✅

### Type 3: Opposite Letters
**Question:** If ARMY = ZINY, how is NAVY coded?
**Method:** A↔Z, R↔I, M↔N, Y↔B → Pattern: opposite letters
N↔M, A↔Z, V↔E, Y↔B → **MZEB**
**Answer:** MZEB ✅

### Type 4: Number Coding
**Question:** If RED = 27, how is BLUE coded?
**Method:** R(18)+E(5)+D(4) = 27 → Sum of positions
B(2)+L(12)+U(21)+E(5) = **40**
**Answer:** 40 ✅

## 💡 Shortcut Tips
- First check: is it simple shifting? (+1, +2, -1, etc.)
- Then check: reversal?
- Then check: opposite letters? (A↔Z)
- Then check: position-based number coding?
- Memorize A=1 to Z=26 and opposite pairs

## 📝 Practice Questions

**Q1.** If MANGO = OCPIQ, how is APPLE coded?
*Answer:* +2 shift → **CRRNG**

**Q2.** If 1234 = ROAD and 5678 = STOP, what is 15 coded as?
*Answer:* R + S = **RS**

**Q3.** In a code, COMPUTER = RFUVQNPC. Find the pattern and decode MOUSE.
*Answer:* Identify the pattern and apply.

## 🔑 Key Points Summary
- Identify the pattern type first before solving
- Letter shifting is the most common pattern
- Opposite letter coding: A↔Z (sum = 27)
- Practice increases speed significantly`,

  "syllogism": `## 📚 Introduction
Syllogism is a form of logical reasoning where a conclusion is drawn from two given statements (premises). It uses Venn diagrams to determine which conclusions logically follow.

## 📐 Key Rules

> **Syllogism Rules**
> 1. **All A are B** → A is completely inside B
> 2. **Some A are B** → A and B overlap (at least partially)
> 3. **No A are B** → A and B don't overlap at all
> 4. **Some A are not B** → Part of A is outside B

### Definite vs Possibility
- **Definite conclusions** must be true in ALL possible Venn diagrams
- **Possibility conclusions** ("Some A may be B") need only ONE valid diagram
- **"All A are B" implies "Some A are B"** (always true)
- **"No A are B" implies "Some A are not B"** (always true)

### Quick Rules Table
| Statement 1 | Statement 2 | Conclusion |
|------------|------------|------------|
| All A are B | All B are C | Some A are C ✅, All A are C ✅ |
| All A are B | No B are C | No A are C ✅ |
| Some A are B | All B are C | Some A are C ✅ |
| Some A are B | No B are C | Some A are not C ✅ |
| Some A are B | Some B are C | No definite conclusion |

## ✅ Solved Examples

### Type 1: Basic Syllogism
**Statements:** All dogs are animals. All animals are living beings.
**Conclusions:**
I. All dogs are living beings. → **True** ✅ (A⊂B, B⊂C → A⊂C)
II. Some living beings are dogs. → **True** ✅ (Reverse of conclusion I)

### Type 2: Negative Premises
**Statements:** No cat is a dog. All dogs are pets.
**Conclusions:**
I. No cat is a pet. → **False** ❌ (cats COULD be pets through another path)
II. Some pets are dogs. → **True** ✅

### Type 3: Possibility
**Statements:** Some birds are parrots. All parrots are green.
**Conclusions:**
I. All birds are green. → **False** (only SOME birds are parrots)
II. All birds being green is a **possibility**. → **True** ✅

## 💡 Shortcut Tips
- Draw ALL possible Venn diagrams — if conclusion fails in even one, it's false
- "Some" means "at least one" — it includes "all"
- Two "Some" statements → No definite conclusion
- Two "No" statements → No definite conclusion
- Possibility is true if you can draw even ONE valid diagram

## 📝 Practice Questions

**Q1.** Statements: All roses are flowers. Some flowers are red.
Conclusions: I. Some roses are red. II. Some red are flowers.
*Answer:* I → Not definite. II → True ✅

**Q2.** Statements: No pen is pencil. All pencils are erasers.
Conclusions: I. No pen is eraser. II. Some erasers are not pens.
*Answer:* I → Not definite. II → True ✅

## 🔑 Key Points Summary
- Venn diagrams are the most reliable method
- Check all possible configurations
- "Some" includes the possibility of "All"
- Two particular premises give no conclusion`,

  "direction-problems": `## 📚 Introduction
Direction Sense problems test your ability to track movement and determine the final position or direction. You need to understand the four cardinal directions and turning rules.

## 📐 Key Concepts

> **Direction Basics**
> - **North** (↑), **South** (↓), **East** (→), **West** (←)
> - **Clockwise turning**: N → E → S → W → N
> - **Anti-clockwise**: N → W → S → E → N
> - **Right turn from North** = Face East
> - **Left turn from North** = Face West
> - **Opposite of North** = South
> - **90° right** = next clockwise direction
> - **180° turn** = opposite direction

### Shadow Rules
- **Morning (before noon)**: Shadow falls towards **West** (sun in East)
- **Evening (after noon)**: Shadow falls towards **East** (sun in West)
- **Noon**: No shadow (or very short, towards North in Northern Hemisphere)

### Distance Calculation
- Use **Pythagoras theorem** for displacement: √(x² + y²)
- Track x-displacement (East-West) and y-displacement (North-South) separately

## ✅ Solved Examples

### Type 1: Simple Direction
**Question:** Ram walks 5 km North, turns right, walks 3 km, turns right, walks 5 km. Which direction is he facing?
**Method:**
5km N → Right (East) → 3km E → Right (South) → 5km S
**Answer:** Facing **South**, 3 km East from start ✅

### Type 2: Shadow-Based
**Question:** One morning, Sita was walking. Her shadow fell to her right. Which direction was she facing?
**Method:** Morning shadow = West. Shadow to right means West is to her right.
If West is right → She faces **North** ✅

### Type 3: Displacement
**Question:** A man walks 3km North, 4km East, 3km South. How far is he from the start?
**Method:** N-S cancel (3-3=0). Only 4km East remains.
**Answer:** **4 km** East ✅

## 📝 Practice Questions

**Q1.** A person walks 10m South, turns left, walks 5m, turns left, walks 10m. Direction from start?
*Answer:* 5m East of start, facing **North**

**Q2.** In evening, a man's shadow falls to his left. He is facing?
*Answer:* Evening shadow = East. East is to his left → Facing **North**

## 🔑 Key Points Summary
- Always draw the diagram
- Track x and y displacements separately
- Remember shadow rules for morning/evening
- Right turn = clockwise, Left turn = anti-clockwise`,

  "seating-arrangement": `## 📚 Introduction
Seating Arrangement involves placing people in a linear or circular arrangement based on given conditions. It tests your ability to process multiple constraints simultaneously.

## 📐 Types of Arrangements

> **Arrangement Types**
> 1. **Linear (Row)**: People sit in a straight line, facing North or South
> 2. **Circular**: People sit around a round table
> 3. **Rectangular**: People sit around a rectangular table
> 4. **Double Row**: Two rows facing each other

### Key Rules
- **Linear facing North**: Left = West, Right = East
- **Linear facing South**: Left = East, Right = West
- **Circular facing center**: Left = Clockwise, Right = Anti-clockwise
- **Circular facing outward**: Left = Anti-clockwise, Right = Clockwise

## ✅ Solved Examples

### Type 1: Linear Arrangement
**Question:** 5 friends A, B, C, D, E sit in a row facing North. B sits to the right of A. C sits at one end. D is not adjacent to C. E sits between A and D.
**Method:**
Step 1: Try C at leftmost: C _ _ _ _
Step 2: B right of A: ... A B ...
Step 3: E between A and D: ... D E A B ...
Step 4: C at left end: C D E A B
Check: D not adjacent to C? D IS adjacent to C ❌
Step 5: Try C at right end: _ _ _ _ C
Step 6: B right of A, E between A and D: D E A B C
Check: D not adjacent to C ✅
**Answer:** D E A B C ✅

### Type 2: Circular Arrangement
**Question:** 6 people sit around a circular table facing the center. A sits opposite to D. B is to the left of A. C is between D and E.
**Method:** Draw circle, place A and D opposite. B to A's left (clockwise from A). Place C between D and E.

## 💡 Shortcut Tips
- Start with the person who has the most definite position
- Use elimination for "not adjacent" conditions
- In circular: opposite person is at position + n/2
- Always verify ALL conditions after placing everyone

## 📝 Practice Questions

**Q1.** 7 people in a row. P is 3rd from left. Q is 3rd from right. R is between P and Q. How many people between P and the right end?
*Answer:* Work out positions: P at 3, Q at 5, R at 4. People to P's right = **4**

## 🔑 Key Points Summary
- Read ALL conditions before starting
- Start with definite positions
- Verify every condition after solving
- Practice both linear and circular types`,
};
