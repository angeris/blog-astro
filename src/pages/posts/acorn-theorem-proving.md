---
layout: ../../layouts/MarkdownPostLayout.astro
title: Acorn and the future of (AI?) theorem proving
pubDate: 2025-08-29
---
Here's how mathematical proofs generally work.

You start with some statement. Say, something like:

> Let $G$ be a finite group. For all $x \in G$, there is some positive number $k \le |G|$ such that $x^{k} = 1$.

A standard mathematical proof is then a list of statements with the last one following from the previous ones:

1. If $G$ is a finite group, then consider the set $S = \{1, x, \dots, x^{|G|}\}$.
2. Note that this set $S$ is contained in the set of elements of $G$, which has size $|G|$
3. Since there are $|G| + 1$ powers of $x$ in $S$, then there are at least two distinct powers in $S$, namely $x^n$ and $x^m$ with $m < n$ which must be equal in value, $x^n = x^m$
4. Therefore, $x^{n - m} = 1$
5. Since $0\le m \le n \le |G|$ then $n -m \le |G|$ so $k = n - m \le |G|$ works and we have $x^k = 1$

Now, someone might say, wait, hold on, why does step 2 imply 3? And then you might break it down slightly and say

1. Since $|S| \le |G|$ but our definition of $S$ contains $|G|+1$ powers of $x$, there are only $|G|$ possible values that $x^m$ can take on (for $m \in \{0, \dots, |G|\}$)
2. But this must mean that at least two of these powers must match! Hence 3.

And so on, until everyone agrees that, actually, the proof is good and we can accept the conclusion.

### Proofs in Lean
Ok, here's how proofs work in Lean. (I'll be taking the next example directly from the standard library.)

To prove that an element has finite order in a finite order group, we start with
```lean
variable [Finite G]

lemma isOfFinOrder_of_finite (x : G) : IsOfFinOrder x := by
  by_contra h; exact infinite_not_isOfFinOrder h <| Set.toFinite _
```
which reads something like "Assume $G$ is a finite group. We would like to prove this by contradiction: if there is an element $y$ not of finite order in $G$, then the set of powers of $y$ is not finite, so this set can't be contained in $G$. This implies that any element $x \in G$ must be of finite order." 

Ok, fair enough, but that's pretty much almost assuming the claim via `infinite_not_isOfFinOrder`. Let's unpack what that is:
```lean
theorem infinite_not_isOfFinOrder {x : G} (h : ¬IsOfFinOrder x) :
    { y : G | ¬IsOfFinOrder y }.Infinite := by
  let s := { n | 0 < n }.image fun n : ℕ => x ^ n
  have hs : s ⊆ { y : G | ¬IsOfFinOrder y } := by
    rintro - ⟨n, hn : 0 < n, rfl⟩ (contra : IsOfFinOrder (x ^ n))
    apply h
    rw [isOfFinOrder_iff_pow_eq_one] at contra ⊢
    obtain ⟨m, hm, hm'⟩ := contra
    exact ⟨n * m, mul_pos hn hm, by rwa [pow_mul]⟩
  suffices s.Infinite by exact this.mono hs
  contrapose! h
  have : ¬Injective fun n : ℕ => x ^ n := by
    have := Set.not_injOn_infinite_finite_image (Set.Ioi_infinite 0) (Set.not_infinite.mp h)
    contrapose! this
    exact Set.injOn_of_injective this
  rwa [injective_pow_iff_not_isOfFinOrder, Classical.not_not] at this
```
Oh.

### Observations
Unless you're already familiar with Lean or other interactive theorem proving languages, this probably looks like nonsense.

First off, and perhaps most importantly, there's a bunch of names for theorems! Things like `isOfFinOrder_iff_pow_eq_one` and `Set.not_injOn_infinite_finite_image` and so on. But this is kind of weird: human mathematicians don't generally have a bunch of names for really trivial theorems.

In particular, it emulates a poor model for how human mathematics works. Humans aren't dictionaries of (maybe unnamed) theorems, we simply know that some statements are true based on previous things we have proven at some point or read. Of course, really complicated statements and theorems are sometimes named, which is ok, but that's not the "majority" of theorems we care about and use constantly. Certainly I don't have a name for the theorem that "two positive things multiplied yield a positive number", for example.

Second, Lean really looks more like a _programming language_ than anything else. For example, it is not hard to see that the line
```lean
Set.not_injOn_infinite_finite_image (Set.Ioi_infinite 0) (Set.not_infinite.mp h)
```
looks more like a function call than a statement.[^1] Here, `Set.not_injOn_infinite_finite_image` is essentially a function operating on arguments `Set.Ioi_infinite 0` and `Set.not_infinite.mp h`.

## On Acorn
One (very nice) approach to this problem is [Kevin Lacker](https://x.com/lacker)'s [Acorn theorem prover](https://acornprover.org), which I have been [having some fun with lately](https://github.com/acornprover/acornlib/pull/24).

For example, here's the proof that all elements of a finite group of cardinality $|G|$ have order at most $|G|$:
```
theorem all_elements_have_order_at_most_G<G: FiniteGroup>(g: G) {
    exists (n: Nat) {
        n > 0 and n <= G.order and g.pow(n) = G.1
    }
} by {
    // Proof idea: apply pigeonhole. G has |G| elements, take n = |G|+1 powers
    // of g, [1, g, ..., g.pow(n)], which means two elements at some indices i <
    // j match. Then `g.pow(i) = g.pow(j)` so we must have `g.pow(j - i) = G.1`,
    // or that the order is <= j - i <= |G|.
    let n = G.order + 1
    let cyclic_subgroup = map(n.range, g.pow) // n.range is the list [0,1,...,n-1]

    cyclic_subgroup.length = n
    cyclic_subgroup.unique.length <= G.elements.length

    let (i: Nat, j: Nat) satisfy {
        i < j and j < cyclic_subgroup.length and
        g.pow(i) = g.pow(j)
    }
    j < n

    g.pow(i) = g.pow(j)
    g.pow(j - i) = G.1

    let m = j - i
    m < n

    // Conclusion
    m <= G.order
    g.pow(m) = G.1
}
```
If you were to type this in into Acorn (maybe with a little bit of prover help, but we'll get to that) the IDE would show a little "checkmark" next to `theorem` indicating that, indeed, the claim has been proven.

### Observations
First off, note that the function signature only contains the type information of variables `G` which is a `FiniteGroup` and `g: G` which is any element of `G`. Compare this with Lean where the type signature contains the complete hypothesis.

The theorem to be proven is written in as "close" to the way one might think about it:
```
exists (n: Nat) {
	n > 0 and n <= G.order and g.pow(n) = G.1
}
```
That is, "there exists some $n \in \mathbf{N} \cup \{0\}$ such that $0 < n \le |G|$ and $g^n = 1$" as we would expect. So it's very clear what we've proven, rather than having to unroll definitions all the way down and make sure each is right. (We do have to assume things like `G.order` and `g.pow` are properly defined, but these are operations that are relatively common and basic in how they are defined.)

Another thing to note is that every line, other than lines with `let`, are _declarative statements_, not operations on hypotheses (like Lean). Indeed, there is no notion of a "hypothesis as an object" in Acorn. When we type
```
cyclic_subgroup.length = n
```
we really do mean "we are claiming that the length of `cyclic_subgroup` is the same as `n`" which is a thing that needs to be proven. (We'll get to this in a second, too.) 

Finally, there is an interesting `let` line
```
let (i: Nat, j: Nat) satisfy {
	i < j and j < cyclic_subgroup.length and
	g.pow(i) = g.pow(j)
}
```
This line has a `satisfy` statement, which translates directly to: "there exists `i, j: Nat` such that `i < j and j < cyclic_subgroup.length and g.pow(i) = g.pow(j)`" (as one would expect) and assign these values to `i` and `j`. Note that this, too, is a claim (which is essentially pigeonhole principle when used in this context) and it has to be "proven" to the computer.

Finally, note that there are no proofs here in the Lean sense and certainly no names for a bunch of theorems. Here, we just have a sequence of claims or definitions that are true and follow from the previous ones! Much like the "standard proof" of the claim we made at the beginning. (Note also the similarities between the Acorn proof and the "human readable" proof above.)

### Proving as dialogue
The perspective that Acorn takes on proofs is the following: when a statement is made, the Acorn "engine" (which uses a simple ML model under the hood) essentially searches for a proof of the statement, given all of the previous statements that have been made. Concretely, let's take the last line
```
let n = G.order + 1
let cyclic_subgroup = map(n.range, g.pow) // n.range is the list [0,1,...,n-1]

cyclic_subgroup.length = n
cyclic_subgroup.unique.length <= G.elements.length // <---- This one
```
as the statement to evaluate.

There are two possibilities here. First is the happy case, where it finds a proof of the statement, and the unhappy case, where it underlines the statement and says "sorry I can't find a proof of this, need help." I'll go through both here.

#### Happy case
The happy case is the easiest. In this particular example, using the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=acornprover.acornprover), you can put your cursor on the claim (the last line of the block above) and the status of the theorem prover is displayed on the right hand side. In my case, it reads:
```
cyclic_subgroup.unique.length <= G.elements.length

---

  
The proposition follows trivially.  

  
The full proof has 7 steps:  
  
Clause 0, depth 0, from negating the goal:  
not cyclic_subgroup.unique.length <= G.elements.length  
Clause 104, depth 0, from the 'unique_is_smallest_containing_list' theorem:  
not List.contains<G>(x0, s75(x1, x0)) or Nat.lte(List.length<G>(List.unique<G>(x1)), List.length<G>(x0))  
Clause 193, depth 1, by resolution:  
not List.contains<G>(FiniteGroup.elements<G>, s75(cyclic_subgroup, FiniteGroup.elements<G>))  using clause 104 as long resolver:  
not List.contains<G>(x0, s75(x1, x0)) or Nat.lte(List.length<G>(List.unique<G>(x1)), List.length<G>(x0))  using clause 0 as short resolver:  
not cyclic_subgroup.unique.length <= G.elements.length  
Clause 462, depth 0, from the 'List.contains_every<G>' definition:  
forall(x0: List<G>, x1: G) { not x0.contains_every or x0.contains(x1) }  
An unactivated clause, depth 0, from the 'FiniteGroup.all_group_elements_in_elements' axiom:  
G.elements.contains_every  
An unactivated clause, depth 2, by resolution:  
not G.elements.contains_every  using clause 462 as long resolver:  
forall(x0: List<G>, x1: G) { not x0.contains_every or x0.contains(x1) }  using clause 193 as short resolver:  
not List.contains<G>(FiniteGroup.elements<G>, s75(cyclic_subgroup, FiniteGroup.elements<G>))  
Contradiction, depth 2, by passive contradiction.  
  using clause:  
G.elements.contains_every  using clause:  
not G.elements.contains_every
```
It's not super important what this _exactly_ says, but I'll just note that, to prove this claim, the prover has done nontrivial amounts of work. It has found the right theorems (which have been previously proven elsewhere in the library) and applied them to prove this claim. In particular, it has taken the `unique_is_smallest_containing_list` theorem, which proves that, for a given list `L` then any list that contains every element in `L` must have length at least as large as `L.unique` (which is a deduplicated list of the elements of `L`). It has also taken a bunch of other theorems around `Nat.lte` (less than or equal to for the natural numbers) the `List` and the definition of `FiniteGroup` and so on and proved the claim using these.

Note that, very importantly, _we didn't have to know any of this_! The prover just happily looked up the theorem names, hypotheses, and previously-made claims, and so on and just put it all together for us to prove that, indeed `cyclic_subgroup.unique.length <= G.elements.length`.

#### Unhappy case
If we were to "paste this" theorem as stated into Acorn (as it is today), the theorem prover would underline the following line with a bunch of yellow squiggles:
```
g.pow(i) = g.pow(j)
g.pow(j - i) = G.1

let m = j - i
m < n // <----- Squiggles here

// Conclusion
m <= G.order
g.pow(m) = G.1
```
This means that the Acorn theorem prover was unable to find a proof of the claim given the previous statements. Equivalently, much like a mathematician might, the theorem prover needs "help" to see why this statement is true (if it is, indeed, true).

In this case, we might first tell it that, as we've defined it, `m + i = j`. Note that this claim is not obvious already, since `m` is a `Nat` and so can't be negative. Since we want `a-b` to always return a `Nat` number, it is defined to be 0 if `b >= a`.[^2]

(As a side note, in the current example, the theorem above is fully in the Acorn standard library. This means, technically, that copy-pasting the theorem into a file and running Acorn on it means that Acorn will one-shot the theorem since it will recognize that this theorem statement has already been proven somewhere in the standard library.)

After adding this additional claim, the Acorn prover might either continue down the happy path (_i.e._, no more squiggles are shown and the theorem has been proven) or draw some additional squiggles in the next line. You can then continue this process until there are enough statements that are "reasonably easy to prove" for the prover which result in the final claim.

## Observations on each path
Unlike Lean's `sorry`, which says that you have a claim which has not been proven, the notion that a statement hasn't been proven in Acorn is rather more similar to that of a paper: you have made a statement whose justification is not obvious to the reader (or, more specifically, it is not obvious to the Acorn theorem prover itself). More generally, this dialogue-like approach feels like a very natural way to explain proofs "rigorously" to a computer.

Also, in the happy case, it is extremely important to note that essentially no named theorems were stated at any point. Having such encyclopedic knowledge is exactly the type of thing that humans are very bad at, yet computers (including modern AI assistants) are extremely good at. Either way, this is substantially a more natural way of interacting with a theorem prover than Lean's philosophy, which feels far more akin to a nice programming language with some type theory tidbits than, in my opinion, how mathematics and computing _should interact_.

## Broader questions
I think that this is probably enough to get the sense of what is very interesting about Acorn's philosophy on theorem proving. But I'd like to ask a more general question, which is: what are other fields/tasks/etc. for which this type of human-AI interaction is much more natural than we currently have today? At the moment, I feel like AI mostly acts as "fancy executor" or "fancy autocomplete" or "fancy chatbot (with a little bit of agency)."

This is very cool! It lets you do all sorts of interesting stuff already, since LLMs have a surprising amount of knowledge and ability to execute tasks!

But it also feels like there are many common tasks for which this "implicit" dialogue-type interaction creates a far more useful outcome than any of the above individually might. Some sufficient conditions for this seem to be, for example: 

1. The task can be broken down into subtasks which can be individually verified
2. The verification of each subtask should be automatic or require very little human effort (mostly, if not only, computational effort)
3. These subtasks should be ~ mutually exclusive

Obviously, we have a natural version of this with "standard" programming, once the API/function signature/behavior has been fully specified. Indeed, having agents perform PRs on specific features is an (imo bad, but nevertheless an) approximation to the above.

But are there fields that have very natural versions of these? One example might be, _e.g._, experimental design: building a device that meets some spec. Point 1 might be: if I were to have XXX and YYY (sub)devices that achieved ZZZ outputs, I could combine these devices to get the larger device. Running, say, a simulation of this bigger device on the inputs we care about should guarantee that the output satisfies the desired spec.

Either way, I look forward to the future where our AI overlords interact seamlessly with the stuff we do on the day to day, rather than feeling like a very cool and personalized textbook (with some small amount of agency) that we get to query.

---

[^1]: Of course, by Curry–Howard, we know that functions indeed are implications, but I would make the argument that this is more of a very nice _accounting tool_ than it is a primary definition. Unless you're a constructivist, in which case, fine, you can _take it as a definition_ but I think this is one of those cases where the abstraction is being retrofitted to a tool rather than worked with directly.

[^2]: This ideally can be fixed by adding an `Option` type in the type system directly. See the discussion [here](https://github.com/acornprover/acornlib/pull/25#discussion_r2283517565).
