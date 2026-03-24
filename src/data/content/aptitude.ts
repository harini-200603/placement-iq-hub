export const aptitudeContent: Record<string, string> = {
  "number-system": `## 📚 Introduction
Number System is the foundation of quantitative aptitude. It deals with the properties and types of numbers — natural numbers, whole numbers, integers, rational and irrational numbers, prime numbers, and composite numbers. Almost every aptitude exam has 3–5 questions from this topic.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 3–5 questions | Easy–Medium |
| Infosys | 2–4 questions | Medium |
| Wipro | 2–3 questions | Easy |
| Cognizant | 3–4 questions | Medium |
| Accenture | 2–3 questions | Easy–Medium |

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. **Sum of first n natural numbers** = n(n+1)/2
> 2. **Sum of squares of first n natural numbers** = n(n+1)(2n+1)/6
> 3. **Sum of cubes of first n natural numbers** = [n(n+1)/2]²
> 4. **Number of prime numbers from 1 to 100** = 25
> 5. **Divisibility by 2** → Last digit is even (0,2,4,6,8)
> 6. **Divisibility by 3** → Sum of digits divisible by 3
> 7. **Divisibility by 4** → Last two digits form a number divisible by 4
> 8. **Divisibility by 5** → Last digit is 0 or 5
> 9. **Divisibility by 6** → Divisible by both 2 and 3
> 10. **Divisibility by 8** → Last three digits form a number divisible by 8
> 11. **Divisibility by 9** → Sum of digits divisible by 9
> 12. **Divisibility by 11** → Difference of sum of digits at odd and even places is 0 or divisible by 11

### Core Concepts Explained

- **Natural Numbers**: 1, 2, 3, 4, ... (counting numbers)
- **Whole Numbers**: 0, 1, 2, 3, ... (natural numbers + 0)
- **Integers**: ..., -3, -2, -1, 0, 1, 2, 3, ...
- **Even Numbers**: Divisible by 2 → 2, 4, 6, 8, ...
- **Odd Numbers**: Not divisible by 2 → 1, 3, 5, 7, ...
- **Prime Numbers**: Numbers with exactly 2 factors → 2, 3, 5, 7, 11, 13, ...
- **Composite Numbers**: Numbers with more than 2 factors → 4, 6, 8, 9, ...
- **Co-prime Numbers**: Two numbers whose HCF is 1 → (8, 15)
- **HCF (Highest Common Factor)**: Largest number that divides both numbers
- **LCM (Least Common Multiple)**: Smallest number divisible by both numbers
- **HCF × LCM = Product of two numbers**

### Unit Digit Concepts
| Number ending in | Powers cycle |
|-----------------|-------------|
| 0 | Always 0 |
| 1 | Always 1 |
| 2 | 2, 4, 8, 6 (cycle of 4) |
| 3 | 3, 9, 7, 1 (cycle of 4) |
| 4 | 4, 6 (cycle of 2) |
| 5 | Always 5 |
| 6 | Always 6 |
| 7 | 7, 9, 3, 1 (cycle of 4) |
| 8 | 8, 4, 2, 6 (cycle of 4) |
| 9 | 9, 1 (cycle of 2) |

### Remainder Theorem
- **(aⁿ)/(a-1)** → Remainder is always **1** (when n is any positive integer)
- **(aⁿ)/(a+1)** → Remainder is **1** if n is even, **a** if n is odd

## ✅ Solved Examples (Type-wise)

### Type 1: Divisibility
**Question:** Is 4,83,296 divisible by 8?
**Shortcut Method:**
Step 1: Check last 3 digits → 296
Step 2: 296 ÷ 8 = 37 → Exactly divisible
**Answer:** Yes, 4,83,296 is divisible by 8 ✅

### Type 2: Finding Remainders
**Question:** What is the remainder when 7²³ is divided by 4?
**Shortcut Method:**
Step 1: 7 mod 4 = 3 (or -1)
Step 2: (-1)²³ = -1 → Remainder = 4 - 1 = **3**
**Answer:** Remainder = 3 ✅

### Type 3: HCF and LCM
**Question:** Find HCF and LCM of 12, 18, and 24.
**Detailed Method:**
Step 1: Prime factorization:
- 12 = 2² × 3
- 18 = 2 × 3²
- 24 = 2³ × 3
Step 2: HCF = Take minimum powers = 2¹ × 3¹ = **6**
Step 3: LCM = Take maximum powers = 2³ × 3² = **72**
**Answer:** HCF = 6, LCM = 72 ✅

### Type 4: Unit Digit
**Question:** Find the unit digit of 7³⁵⁶.
**Shortcut Method:**
Step 1: 7 has a cycle of 4 → (7, 9, 3, 1)
Step 2: 356 ÷ 4 = 89 remainder 0
Step 3: Remainder 0 → take the last element of the cycle = **1**
**Answer:** Unit digit = 1 ✅

### Type 5: Sum of Series
**Question:** Find the sum of all even numbers from 1 to 100.
**Shortcut Method:**
Step 1: Even numbers = 2, 4, 6, ..., 100
Step 2: Count = 50
Step 3: Sum = n/2 × (first + last) = 50/2 × (2 + 100) = 25 × 102 = **2550**
**Answer:** Sum = 2550 ✅

## 💡 Shortcut Tips
- To check divisibility by 11: alternate add-subtract digits from right
- Product of n consecutive integers is always divisible by n!
- Sum of two odd numbers is always even
- Square of any prime number > 3 leaves remainder 1 when divided by 12
- A number is a perfect square only if it has an odd number of factors

## ⚠️ Common Mistakes
- Confusing HCF and LCM formulas
- Forgetting that 1 is neither prime nor composite
- Mixing up divisibility rules for 4 and 8
- Errors in unit digit cycles — always check the remainder first
- Forgetting that 2 is the only even prime number

## 📝 Practice Questions

**Q1.** What is the unit digit of 3⁶⁷ × 6³⁹ × 7⁵³?
*Answer:* Unit digit of 3⁶⁷ = 3 (cycle: 3,9,7,1; 67%4=3 → 7... wait, 67÷4=16 r 3, third in cycle = 7). Unit digit of 6³⁹ = 6. Unit digit of 7⁵³ = 7 (53÷4=13 r 1 → 7). Product: 7 × 6 × 7 = 294 → unit digit **4**

**Q2.** Find the largest 4-digit number exactly divisible by 12, 15, and 18.
*Answer:* LCM(12,15,18) = 180. Largest 4-digit = 9999. 9999 ÷ 180 = 55.55. So 180 × 55 = **9900**

**Q3.** How many prime numbers are there between 1 and 50?
*Answer:* 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47 → **15 primes**

**Q4.** The HCF of two numbers is 12 and their LCM is 360. If one number is 60, find the other.
*Answer:* HCF × LCM = Product → 12 × 360 = 60 × x → x = **72**

**Q5.** What is the remainder when 2⁵⁶ is divided by 7?
*Answer:* 2³ = 8 ≡ 1 (mod 7). 56 = 3×18 + 2. So 2⁵⁶ = (2³)¹⁸ × 2² ≡ 1 × 4 = **4**

## 🔑 Key Points Summary
- Number system is the base of all arithmetic
- Master divisibility rules — they save time in exams
- HCF × LCM = Product of two numbers (only for two numbers)
- Unit digit problems follow repeating cycles
- Practice remainder theorem for competitive exams
- Focus on Types 1–4 for TCS and Infosys exams`,

  "percentages": `## 📚 Introduction
Percentages represent a number as a fraction of 100. The word "percent" means "per hundred." This is one of the most fundamental topics in aptitude — it connects to profit & loss, interest, data interpretation, and more.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 3–5 questions | Easy–Medium |
| Infosys | 2–4 questions | Medium |
| Wipro | 2–3 questions | Easy |
| Cognizant | 3–4 questions | Medium |
| Accenture | 2–3 questions | Easy–Medium |

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. **Percentage** = (Value / Total) × 100
> 2. **x% of y** = (x/100) × y = **y% of x**
> 3. **Percentage Increase** = [(New - Old) / Old] × 100
> 4. **Percentage Decrease** = [(Old - New) / Old] × 100
> 5. **If a value increases by x%, new value** = Original × (1 + x/100)
> 6. **If a value decreases by x%, new value** = Original × (1 - x/100)
> 7. **Successive increase** of a% and b% = a + b + (ab/100)%
> 8. **If price increases by x%, reduce consumption by** [x/(100+x)] × 100% to keep spending same
> 9. **Population after n years** = P × (1 + r/100)ⁿ

### Fraction-Percentage Equivalents (Must Memorize!)
| Fraction | Percentage |
|----------|-----------|
| 1/2 | 50% |
| 1/3 | 33.33% |
| 1/4 | 25% |
| 1/5 | 20% |
| 1/6 | 16.67% |
| 1/7 | 14.28% |
| 1/8 | 12.5% |
| 1/9 | 11.11% |
| 1/10 | 10% |
| 1/11 | 9.09% |
| 1/12 | 8.33% |

## ✅ Solved Examples (Type-wise)

### Type 1: Basic Percentage Calculation
**Question:** What is 35% of 800?
**Shortcut Method:**
Step 1: 35% of 800 = 10% × 3 + 5% = 80×3 + 40 = **280**
**Answer:** 280 ✅

### Type 2: Percentage Increase/Decrease
**Question:** A shirt's price increased from ₹500 to ₹600. Find the percentage increase.
**Method:**
Step 1: Increase = 600 - 500 = ₹100
Step 2: % increase = (100/500) × 100 = **20%**
**Answer:** 20% increase ✅

### Type 3: Successive Percentages
**Question:** A product's price increases by 20% then decreases by 10%. What is the net change?
**Shortcut Formula:** a + b + ab/100 = 20 + (-10) + (20×(-10))/100 = 20 - 10 - 2 = **+8%**
**Answer:** Net increase = 8% ✅

### Type 4: Price and Consumption
**Question:** If the price of rice increases by 25%, by how much should a family reduce consumption to maintain the same expenditure?
**Shortcut:**
Reduction = [25/(100+25)] × 100 = (25/125) × 100 = **20%**
**Answer:** Reduce consumption by 20% ✅

### Type 5: Population Problems
**Question:** The population of a city is 50,000. It increases by 10% annually. What will it be after 2 years?
**Method:**
Population = 50000 × (1 + 10/100)² = 50000 × 1.21 = **60,500**
**Answer:** 60,500 ✅

## 💡 Shortcut Tips
- x% of y = y% of x (e.g., 8% of 50 = 50% of 8 = 4)
- To increase a number by 10%, multiply by 1.1
- To decrease by 20%, multiply by 0.8
- Memorize fraction-percentage table — saves 30+ seconds per question
- For successive changes, use the formula: a + b + ab/100

## ⚠️ Common Mistakes
- Using the new value instead of original value as the base for percentage change
- Forgetting the cross-term in successive percentage changes
- Confusing "percentage of" with "percentage more/less than"
- Not converting fractions to percentages properly

## 📝 Practice Questions

**Q1.** 40% of a number is 160. What is the number?
*Answer:* x × 40/100 = 160 → x = **400**

**Q2.** If A's salary is 30% more than B's, by what % is B's salary less than A's?
*Answer:* (30/130) × 100 = **23.08%**

**Q3.** A number is first increased by 20% and then decreased by 20%. What is the net change?
*Answer:* 20 + (-20) + (20×(-20))/100 = 0 - 4 = **-4% (decrease)**

**Q4.** In an election between two candidates, 70% of voters voted and the winning candidate got 60% of votes. If he won by 1400 votes, find the total number of voters.
*Answer:* Let total = x. Voted = 0.7x. Winner = 0.6(0.7x), Loser = 0.4(0.7x). Difference = 0.2(0.7x) = 0.14x = 1400 → x = **10,000**

**Q5.** The price of an article decreased by 10% and then increased by 10%. What is the final price if the original was ₹1000?
*Answer:* 1000 × 0.9 × 1.1 = **₹990** (net loss of ₹10 or 1%)

## 🔑 Key Points Summary
- Percentage is the most connected topic in aptitude
- Master fraction-percentage equivalents for speed
- Always use original value as base for increase/decrease
- Successive percentage formula is a huge time-saver
- This topic directly feeds into Profit & Loss and Interest problems`,

  "profit-loss": `## 📚 Introduction
Profit and Loss deals with commercial mathematics — buying and selling of goods. It covers cost price, selling price, profit, loss, markup, discount, and how businesses calculate earnings. This is a high-frequency topic in placement exams.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 2–4 questions | Medium |
| Infosys | 2–3 questions | Medium |
| Wipro | 1–3 questions | Easy–Medium |
| Cognizant | 2–3 questions | Medium |
| Accenture | 1–2 questions | Easy |

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. **Profit** = SP - CP (when SP > CP)
> 2. **Loss** = CP - SP (when CP > SP)
> 3. **Profit %** = (Profit / CP) × 100
> 4. **Loss %** = (Loss / CP) × 100
> 5. **SP** = CP × (100 + Profit%) / 100
> 6. **SP** = CP × (100 - Loss%) / 100
> 7. **CP** = SP × 100 / (100 + Profit%)
> 8. **Discount** = Marked Price - Selling Price
> 9. **Discount %** = (Discount / MP) × 100
> 10. **SP = MP × (100 - Discount%) / 100**
> 11. **If two items sold at same SP**, one at x% profit and other at x% loss → **Always net loss = (x²/100)%**

### Key Concepts
- **Cost Price (CP):** The price at which an article is purchased
- **Selling Price (SP):** The price at which an article is sold
- **Marked Price (MP):** The label price / listed price
- **Discount** is always calculated on **Marked Price**
- **Profit/Loss** is always calculated on **Cost Price**

## ✅ Solved Examples (Type-wise)

### Type 1: Basic Profit/Loss
**Question:** A shopkeeper buys a book for ₹200 and sells it for ₹250. Find the profit percentage.
**Method:**
Step 1: Profit = 250 - 200 = ₹50
Step 2: Profit% = (50/200) × 100 = **25%**
**Answer:** 25% profit ✅

### Type 2: Finding SP from CP and Profit%
**Question:** An article is bought for ₹800 and sold at 15% profit. Find the selling price.
**Shortcut:**
SP = 800 × (100+15)/100 = 800 × 1.15 = **₹920**
**Answer:** ₹920 ✅

### Type 3: Discount Problems
**Question:** An item has MP = ₹1000. A discount of 20% is given. If the shopkeeper still makes 10% profit, find CP.
**Method:**
Step 1: SP = 1000 × 0.8 = ₹800
Step 2: CP = 800 × 100/110 = **₹727.27**
**Answer:** ₹727.27 ✅

### Type 4: Successive Discounts
**Question:** Two successive discounts of 20% and 10% on an item of MP ₹500. Find the final SP.
**Method:**
Step 1: After 20% → 500 × 0.8 = ₹400
Step 2: After 10% → 400 × 0.9 = **₹360**
**Single equivalent discount** = 20 + 10 - (20×10)/100 = 28%
**Answer:** ₹360 ✅

### Type 5: Same SP with Profit and Loss
**Question:** Two articles are sold at ₹600 each. One at 20% profit and other at 20% loss. Find overall gain or loss.
**Shortcut:**
Net loss% = x²/100 = 400/100 = **4% loss**
**Answer:** 4% loss ✅

## 💡 Shortcut Tips
- Profit/Loss is ALWAYS on CP, Discount is ALWAYS on MP
- Two items sold at same price, one profit x% other loss x% → Always loss = x²/100 %
- Successive discounts of a% and b% = a + b - ab/100 (single discount)
- If a dishonest dealer uses false weights: Gain% = (True weight - False weight)/False weight × 100

## ⚠️ Common Mistakes
- Calculating profit % on SP instead of CP
- Confusing Marked Price and Cost Price
- Not applying successive discounts correctly
- Forgetting that selling at same SP with equal profit% and loss% always results in loss

## 📝 Practice Questions

**Q1.** A man buys an article for ₹450 and sells at a loss of 10%. What is the SP?
*Answer:* SP = 450 × 0.9 = **₹405**

**Q2.** By selling 33 meters of cloth, a shopkeeper gains the SP of 11 meters. Find gain%.
*Answer:* Gain on 33m = SP of 11m. Let SP/m = s. CP = 33s - 11s = 22s for 33m. Gain% = 11s/22s × 100 = **50%**

**Q3.** MP = ₹600, Discount = 15%, Profit = 20%. Find CP.
*Answer:* SP = 600 × 0.85 = 510. CP = 510/1.2 = **₹425**

**Q4.** A shopkeeper marks goods 40% above CP and gives 20% discount. Find profit%.
*Answer:* Let CP = 100. MP = 140. SP = 140 × 0.8 = 112. Profit = **12%**

**Q5.** A dealer uses a false weight of 900g instead of 1kg. Find his gain%.
*Answer:* Gain% = (1000-900)/900 × 100 = **11.11%**

## 🔑 Key Points Summary
- Always identify what is given — CP, SP, or MP
- Profit and loss are on CP; discount is on MP
- Master the formula for dishonest dealer problems
- Same SP equal profit-loss always = net loss
- Successive discount formula is a huge time-saver`,

  "time-work": `## 📚 Introduction
Time and Work problems deal with the rate at which people or machines complete a task. The core concept is: if a person can complete a job in 'n' days, they do 1/n of the work per day. This is a must-prepare topic for all placement exams.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 3–5 questions | Medium |
| Infosys | 2–4 questions | Medium–Hard |
| Wipro | 2–3 questions | Medium |
| Cognizant | 2–3 questions | Medium |
| Accenture | 1–2 questions | Easy–Medium |

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. If A can do a work in **n** days → A's 1 day work = **1/n**
> 2. If A's 1 day work = 1/n → A can finish in **n** days
> 3. A and B together: **1/A + 1/B = 1/T** (T = time together)
> 4. **T = (A × B) / (A + B)** for two people
> 5. If A is **x** times efficient as B, and B takes **n** days → A takes **n/x** days
> 6. **Ratio of efficiencies is inverse of ratio of time**
> 7. **Pipes & Cisterns**: Filling = positive work, Emptying = negative work
> 8. If pipe fills in A hrs and empties in B hrs → Net = 1/A - 1/B

### LCM Method (Fastest for competitive exams!)
Instead of using fractions, take LCM of all time values as total work units.
- If A does work in 10 days, B in 15 days → LCM = 30 units
- A's rate = 30/10 = 3 units/day, B's rate = 30/15 = 2 units/day
- Together = 5 units/day → Time = 30/5 = **6 days**

## ✅ Solved Examples (Type-wise)

### Type 1: Basic Combined Work
**Question:** A can do a job in 12 days, B can do it in 18 days. How long together?
**LCM Method:**
Step 1: LCM(12, 18) = 36 units (total work)
Step 2: A = 36/12 = 3 units/day, B = 36/18 = 2 units/day
Step 3: Together = 5 units/day → 36/5 = **7.2 days = 7 days 4 hours 48 min**
**Answer:** 7.2 days ✅

### Type 2: A and B work together, then one leaves
**Question:** A and B can do a work in 12 days and 15 days respectively. They work together for 4 days, then A leaves. How many more days will B take?
**LCM Method:**
Step 1: LCM(12,15) = 60 units
Step 2: A = 5 units/day, B = 4 units/day
Step 3: Together for 4 days = 9 × 4 = 36 units done
Step 4: Remaining = 60 - 36 = 24 units
Step 5: B alone = 24/4 = **6 more days**
**Answer:** 6 days ✅

### Type 3: Efficiency Ratio
**Question:** A is twice as efficient as B. Together they finish in 12 days. How long would B take alone?
**Method:**
Step 1: Let B's efficiency = 1, A's efficiency = 2
Step 2: Combined = 3 units/day
Step 3: Total work = 3 × 12 = 36 units
Step 4: B alone = 36/1 = **36 days**
**Answer:** B takes 36 days ✅

### Type 4: Pipes and Cisterns
**Question:** Pipe A fills a tank in 6 hours, Pipe B empties it in 8 hours. If both are opened, how long to fill?
**LCM Method:**
Step 1: LCM(6,8) = 24 units
Step 2: A fills = +4 units/hr, B empties = -3 units/hr
Step 3: Net = +1 unit/hr → 24/1 = **24 hours**
**Answer:** 24 hours ✅

## 💡 Shortcut Tips
- Always use LCM method — avoids messy fractions
- Efficiency and time are inversely proportional
- Pipes filling = positive work, pipes emptying = negative work
- If work is done on alternate days, calculate 2-day combined work first
- "Wages are distributed in ratio of work done" — use efficiency ratios

## ⚠️ Common Mistakes
- Forgetting to subtract work already done when someone leaves
- Mixing up efficiency ratio with time ratio
- Not considering negative work for emptying pipes
- Adding times directly instead of adding rates (1/A + 1/B ≠ 1/(A+B))

## 📝 Practice Questions

**Q1.** A can do work in 10 days, B in 20 days, C in 40 days. All together?
*Answer:* LCM = 40. Rates: 4+2+1 = 7 units/day. Time = 40/7 = **5 5/7 days**

**Q2.** A does a job in 15 days. B is 50% more efficient. How long does B take?
*Answer:* B = 15/1.5 = **10 days**

**Q3.** Two pipes fill in 10 and 15 minutes. An outlet empties in 20 minutes. All open — when full?
*Answer:* LCM = 60. Rates: 6+4-3 = 7 units/min. Time = 60/7 = **8 4/7 min**

**Q4.** A and B together finish in 6 days. A alone takes 10 days. B alone?
*Answer:* B's rate = 1/6 - 1/10 = 1/15. B alone = **15 days**

**Q5.** 12 men finish a work in 18 days. How many men needed to finish in 12 days?
*Answer:* Men × Days = constant. 12 × 18 = x × 12 → x = **18 men**

## 🔑 Key Points Summary
- LCM method is the gold standard for Time & Work
- Rate of work = 1/Time taken
- Combined rate = Sum of individual rates
- Pipes & cisterns is just Time & Work with filling/emptying
- Efficiency ratio = Inverse of time ratio`,

  "time-speed-distance": `## 📚 Introduction
Time, Speed and Distance problems test your ability to work with motion. The core formula is **Distance = Speed × Time**. This topic extends to trains, boats & streams, relative speed, and races.

## 🎯 Importance in Placements
| Company | Questions Asked | Difficulty |
|---------|----------------|------------|
| TCS | 3–5 questions | Medium |
| Infosys | 2–3 questions | Medium–Hard |
| Wipro | 2–3 questions | Medium |
| Cognizant | 2–4 questions | Medium |
| Accenture | 2–3 questions | Easy–Medium |

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. **Distance = Speed × Time**
> 2. **Speed = Distance / Time**
> 3. **Time = Distance / Speed**
> 4. **1 km/hr = 5/18 m/s**
> 5. **1 m/s = 18/5 km/hr**
> 6. **Average Speed** (same distance) = **2S₁S₂ / (S₁ + S₂)**
> 7. **Relative Speed** (same direction) = S₁ - S₂
> 8. **Relative Speed** (opposite direction) = S₁ + S₂
> 9. **Train crossing a pole** → Distance = Length of train
> 10. **Train crossing a platform** → Distance = Length of train + Length of platform
> 11. **Two trains crossing each other** → Distance = Sum of lengths
> 12. **Boats**: Downstream speed = (u + v), Upstream speed = (u - v)

### Unit Conversions
- km/hr to m/s → multiply by 5/18
- m/s to km/hr → multiply by 18/5
- 36 km/hr = 10 m/s

## ✅ Solved Examples (Type-wise)

### Type 1: Basic Speed-Distance-Time
**Question:** A car covers 450 km in 6 hours. Find its speed.
**Method:** Speed = 450/6 = **75 km/hr**
**Answer:** 75 km/hr ✅

### Type 2: Average Speed
**Question:** A person goes from A to B at 40 km/hr and returns at 60 km/hr. Find average speed.
**Shortcut:** Average = 2 × 40 × 60 / (40 + 60) = 4800/100 = **48 km/hr**
**Answer:** 48 km/hr ✅
*Note:* Average speed ≠ average of speeds!

### Type 3: Trains
**Question:** A 200m train traveling at 72 km/hr crosses a platform of 300m. Find the time.
**Method:**
Step 1: Total distance = 200 + 300 = 500m
Step 2: Speed = 72 × 5/18 = 20 m/s
Step 3: Time = 500/20 = **25 seconds**
**Answer:** 25 seconds ✅

### Type 4: Boats and Streams
**Question:** A boat's speed in still water is 15 km/hr. River current = 3 km/hr. Find time for 36 km upstream.
**Method:**
Step 1: Upstream speed = 15 - 3 = 12 km/hr
Step 2: Time = 36/12 = **3 hours**
**Answer:** 3 hours ✅

### Type 5: Relative Speed
**Question:** Two trains of 150m and 250m run at 40 km/hr and 32 km/hr in opposite directions. Time to cross?
**Method:**
Step 1: Total distance = 150 + 250 = 400m
Step 2: Relative speed = 40 + 32 = 72 km/hr = 20 m/s
Step 3: Time = 400/20 = **20 seconds**
**Answer:** 20 seconds ✅

## 💡 Shortcut Tips
- Always convert to same units before calculating
- Average speed for equal distances = Harmonic mean (not arithmetic mean)
- For trains: draw a diagram to visualize what distance is being covered
- Boats upstream = slow, downstream = fast
- If speed ratio = a:b, time ratio = b:a (for same distance)

## ⚠️ Common Mistakes
- Using arithmetic mean instead of harmonic mean for average speed
- Forgetting to add train length when crossing platforms
- Not converting km/hr to m/s when answer is in seconds
- Confusing upstream and downstream formulas

## 📝 Practice Questions

**Q1.** A man walks at 5 km/hr for 6 hrs and 4 km/hr for 12 hrs. Average speed?
*Answer:* Total dist = 30 + 48 = 78 km. Total time = 18 hrs. Avg = 78/18 = **4.33 km/hr**

**Q2.** A 300m train at 90 km/hr passes a man running at 6 km/hr in same direction. Time?
*Answer:* Relative speed = 84 km/hr = 70/3 m/s. Time = 300/(70/3) = 900/70 = **12.86 sec**

**Q3.** Speed of boat in still water = 10 km/hr, stream = 2 km/hr. Time for 48 km downstream?
*Answer:* Downstream = 12 km/hr. Time = 48/12 = **4 hours**

**Q4.** A car covers first half at 30 km/hr and second half at 70 km/hr. Average speed?
*Answer:* 2×30×70/(30+70) = 4200/100 = **42 km/hr**

**Q5.** Two trains 200m each, speeds 30 km/hr and 24 km/hr, same direction. Crossing time?
*Answer:* Relative = 6 km/hr = 5/3 m/s. Dist = 400m. Time = 400×3/5 = **240 sec = 4 min**

## 🔑 Key Points Summary
- D = S × T is the fundamental equation
- Convert units: km/hr ↔ m/s
- Average speed for same distance = 2ab/(a+b)
- Train problems = distance includes train length(s)
- Boats: downstream = add, upstream = subtract`,

  "ratio-proportion": `## 📚 Introduction
Ratio and Proportion is about comparing quantities. A ratio a:b compares two quantities, while a proportion states that two ratios are equal (a:b = c:d). This topic extends to mixtures and alligation — heavily tested in placements.

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. **Ratio a:b** = a/b
> 2. **Proportion**: a:b = c:d → a×d = b×c (cross multiply)
> 3. **Componendo**: (a+b)/b = (c+d)/d
> 4. **Dividendo**: (a-b)/b = (c-d)/d
> 5. **Duplicate ratio** of a:b = a²:b²
> 6. **Sub-duplicate ratio** of a:b = √a:√b
> 7. **Triplicate ratio** of a:b = a³:b³
> 8. **Mixture**: If two items of price a and b are mixed in ratio x:y, average price = (ax+by)/(x+y)
> 9. **Alligation Rule**: Ratio = (Higher - Mean) : (Mean - Lower)

## ✅ Solved Examples

### Type 1: Basic Ratio
**Question:** Divide ₹720 in the ratio 2:3:4.
**Method:** Total parts = 9. Values = 720/9 × 2 = ₹160, ₹240, ₹320
**Answer:** ₹160, ₹240, ₹320 ✅

### Type 2: Proportion
**Question:** If 2:5 = 6:x, find x.
**Method:** 2×x = 5×6 → x = **15**
**Answer:** 15 ✅

### Type 3: Alligation
**Question:** Mix rice of ₹40/kg and ₹60/kg to get ₹45/kg. Find the ratio.
**Alligation:** (60-45):(45-40) = 15:5 = **3:1**
**Answer:** 3:1 (cheap:expensive) ✅

## 💡 Shortcut Tips
- Always reduce ratios to simplest form
- For age problems with ratios, take ages as kx and ky
- Alligation works for all mixing problems — prices, percentages, averages

## 📝 Practice Questions

**Q1.** A:B = 3:4, B:C = 5:6. Find A:B:C.
*Answer:* A:B:C = 15:20:24

**Q2.** ₹1500 divided among A, B, C such that A:B = 5:4 and B:C = 3:2. Find each share.
*Answer:* A:B:C = 15:12:8. A=15×1500/35=₹642.86, etc.

## 🔑 Key Points Summary
- Ratio compares quantities; proportion equates ratios
- Alligation is the fastest method for mixture problems
- Cross multiplication is the key tool for proportions`,

  "simple-compound-interest": `## 📚 Introduction
Interest is the cost of borrowing money. Simple Interest (SI) is calculated on the original principal only, while Compound Interest (CI) is calculated on principal + accumulated interest. This topic is vital for placement exams and real-world finance.

## 📐 Important Formulas & Concepts

> **Formula Box**
> 1. **SI** = P × R × T / 100
> 2. **Amount (SI)** = P + SI = P(1 + RT/100)
> 3. **CI** = P[(1 + R/100)ⁿ - 1]
> 4. **Amount (CI)** = P(1 + R/100)ⁿ
> 5. **Difference between CI and SI for 2 years** = P(R/100)²
> 6. **Difference for 3 years** = P(R/100)² × (3 + R/100)
> 7. **If CI is compounded half-yearly**: Rate = R/2, Time = 2n
> 8. **If CI is compounded quarterly**: Rate = R/4, Time = 4n
> 9. **Effective Rate** = (1 + R/n)ⁿ - 1 (where n = compounding frequency)

## ✅ Solved Examples

### Type 1: Simple Interest
**Question:** Find SI on ₹5000 at 8% per annum for 3 years.
**Method:** SI = 5000 × 8 × 3 / 100 = **₹1200**
**Answer:** ₹1200 ✅

### Type 2: Compound Interest
**Question:** Find CI on ₹10,000 at 10% for 2 years.
**Method:**
Amount = 10000 × (1.1)² = 10000 × 1.21 = ₹12,100
CI = 12100 - 10000 = **₹2,100**
**Answer:** ₹2,100 ✅

### Type 3: Difference between CI and SI
**Question:** Find the difference between CI and SI on ₹8000 at 5% for 2 years.
**Shortcut:** Diff = P(R/100)² = 8000 × (5/100)² = 8000 × 0.0025 = **₹20**
**Answer:** ₹20 ✅

### Type 4: Finding Rate
**Question:** A sum doubles in 8 years at SI. Find the rate.
**Method:** 2P = P + P×R×8/100 → R = **12.5%**

### Type 5: Half-Yearly Compounding
**Question:** CI on ₹6000 at 10% for 1 year compounded half-yearly.
**Method:** Amount = 6000(1 + 5/100)² = 6000 × 1.1025 = ₹6615
CI = **₹615**
**Answer:** ₹615 ✅

## 💡 Shortcut Tips
- SI: Amount grows linearly. CI: Amount grows exponentially
- For "doubles in n years" → Rate = 100/n (SI)
- CI - SI for 2 years shortcut saves major time
- Rule of 72: Money doubles in approx 72/R years (CI)

## ⚠️ Common Mistakes
- Using CI formula for SI and vice versa
- Forgetting to adjust rate and time for half-yearly/quarterly compounding
- Not subtracting principal from amount to get interest

## 📝 Practice Questions

**Q1.** SI = ₹4000, R = 10%, T = 5 years. Find Principal.
*Answer:* P = 4000 × 100 / (10 × 5) = **₹8000**

**Q2.** A sum becomes ₹4840 in 2 years at 10% CI. Find the sum.
*Answer:* P = 4840/(1.1)² = 4840/1.21 = **₹4000**

**Q3.** CI on ₹20,000 at 10% for 3 years.
*Answer:* A = 20000 × 1.331 = 26620. CI = **₹6620**

## 🔑 Key Points Summary
- SI is straightforward: P×R×T/100
- CI uses power formula: P(1+R/100)ⁿ
- CI > SI always (for more than 1 year)
- Know the CI-SI difference formula for 2 and 3 years
- Master half-yearly and quarterly compounding conversions`,
};
