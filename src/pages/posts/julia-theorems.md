---
layout: ../../layouts/MarkdownPostLayout.astro
title: Proving theorems using Julia's types (or, a mini-Lean in Julia)
pubDate: 2025-07-08
---
Tl;dr, I didn't really understand exactly how Lean worked, or what 'statements as types' meant, so, well, I went and implemented a really basic interactive theorem proving system using Julia's types. (It only works for first-order Peano arithmetic, but that's ok!)

[There's a livestream of me doing this](https://x.com/i/broadcasts/1ZkKzYeOkbLxv) on twitter if that's more of your jam, but here's a simple-ish written version of it. (It's possible I'll turn it into a tutorial PDF sometime, so it can get passed around, but this will do for now.) This post is also a slight simplification of what's on the livestream, since I've removed some of the less essential stuff for ~ the same result.

Though (somewhat) helpful, I will assume no knowledge of Lean, but I will assume some amount of knowledge of types in modern programming languages. Weirdly enough, I found Curry–Howard rather difficult to understand in "standard" terms, but, if you're familiar with type systems from basic programming languages, this gets you pretty far in understanding the correspondence.

# Julia's types and basic type stuff
I will use Julia's syntax for types (so you can follow along and paste this in a Julia REPL, for example). It will be helpful to note that, in Julia, variables and function names are lowercase while types are in UpperCase and I will follow this convention here.

In Julia, there are only `abstract types` and `structs` (I will call these "concrete types", as that is more suggestive than "struct"). There is a very simple notion of "inheritance" which is that types (both abstract and concrete) can be defined as subtypes of abstract types.

As a quick example, we might declare a "Natural" type
```julia
abstract type Natural end
```
which we use to state that a _thing_ is a Natural number. (Specifically, we define a _thing_ as a natural number if it is a subtype of `Natural`.)

We can then use this to define the `Zero` type
```julia
struct Zero <: Natural end
```
which is a concrete type that is a subtype of `Natural` with no other properties. (We will use [Peano's definition of the natural numbers here](https://en.wikipedia.org/wiki/Peano_axioms), not super important, but again nice to know.) We can then recursively define the natural numbers in the following way:
```julia
struct Succ{T <: Natural} 
	pred::T
end
```
The notation here simply says that `Succ` takes in a type argument of type `T`, which can be anything, so long as it is a natural number (a subtype of `Natural`). It will then return a struct with type `Succ{T}` for whatever natural number `T` you gave it.

How does this correspond to the natural numbers we know and love? Well, $0$ here is the (unique) object of type `Zero`, namely `n_zero = Zero()`. On the other hand $1$ is _defined_ as the successor of $0$: `n_one = Succ(n_zero)`. Similarly $2$ is the successor of $1$: `n_two = Succ(n_one)` and so on.[^1]

Finally, the only other bit of Julia type stuff to know is that we can check if something is a subtype of another via the `isa` function:
```julia
Zero() isa Natural # returns `true`
Zero() isa Succ # returns `false`
```

# Statements as types and proofs as constructions
The high level idea of Curry–Howard (and Lean) is to define _mathematical statements_ as _types_. A statement is then true if we can construct an object of that type. (In the Lean parlance, a statement is true/a number exists/etc., if the type corresponding to that statement/number/etc. is _inhabited_.)

Hopefully this idea will be slightly more clear when we define what it means for two things to be equal.
## Defining equality
We will define the type `Eq` in the following way:
```julia
struct Eq{L, R}
	lhs::L
	rhs::R
end
```
That is, `Eq` is a struct that corresponds to the claim that the type on the left and the type on the right are equal.

Now, we have to define the rules by which we can construct equalities. The rules here will be functions that take in some objects (that have been constructed) and spit out new objects (that are logical consequences thereof). These rules will be the axioms we use, which we can apply on objects we have, to get new (true) statements about these objects.

The simplest one is that, definitionally, a thing is always equal to itself, also known as the _reflexive_ property of equality:
```julia
refl(x) = Eq(x, x)
```
The function `refl` takes in any input `x` of type `T` and spits out the claim that `T = T`.[^2] Note that "spits out the claim" here means that, given an object `x` of some type `T` it _constructs_ a new object of type `Eq{T, T}`, which claims that "`T` is equal to `T`".

We also know that equality is symmetric, which can be written as the function
```julia
symm(x::Eq) = Eq(x.rhs, x.lhs)
```
this is the claim that we can "reverse" the equality and it still remains true. That is, if `T = U` (or, equivalently, we have `Eq{T, U}`) then `U = T` (or, equivalently, we have `Eq{U, T}`).

Another rule will be the transitive property of equality:
```julia
trans(l::Eq{T, U}, r::Eq{U, V}) where {T, U, V}  = Eq(l.lhs, r.rhs)
```
This rule takes the two claims that if `T = U` and `U = V` and then constructs the new claim that `T = V`.

Finally, we will have that, to any two equal things, we can apply a function to both sides and the result maintains equality:
```julia
apply_fun(f::Function, eq::Eq{U, V}) = Eq(f(eq.lhs), f(eq.rhs))
```

Note that these rules/functions here are what in standard math we would call implications: for example `symm` corresponds exactly to the mathematical implication that
$$
x = y \quad \implies \quad y = x.
$$
for any $x, y$. (Indeed, this equivalence between functions operating on types and mathematical implications was one of the [major observations of Haskell Curry in the mid '30s](https://pmc.ncbi.nlm.nih.gov/articles/PMC1076489/?page=1).)

These rules, taken together, completely define equality between objects.[^3]

## Proving 1 + 1 = 2
### Defining addition
Much like equality, we have to define what addition is and what we can do with it. In our case, addition will be represented by a struct (again) which takes two types and is also of type `Natural` (since adding two natural numbers results in another):
```julia
struct Add{L <: Natural, R <: Natural} <: Natural
	l::L
	r::R
end
```
Peano's axioms define that addition has two important properties. The first is that adding a natural number $n$ to zero gives you the number itself, $n + 0 = n$:
```julia
add_zero(n::Natural) = Eq(Add(n, Zero()), n)
```
and that adding a number $a$ to a successor $S(b)$ is the same as taking the successor of the sum of each $a + S(b) = S(a + b)$:
```julia
add_succ(a::Natural, b::Succ) = Eq(Add(a, b), Succ(Add(a, b.pred)))
```
(here, remember, `b.pred` is the predecessor number to $b$).

Note that both of these functions take in natural numbers and return statements of equality.

### Proof
Ok, with that, we can now prove that $1+1 = 2$, or, more formally, that $S(0) + S(0) = S(S(0))$. First, as before, define the numbers $0, 1, 2$:
```julia
n_zero = Zero()
n_one = Succ(n_zero)
n_two = Succ(n_one)
```
and their associated types:
```julia
Zero
One = Succ{Zero}
Two = Succ{One}
```
Our _statement_ (or, in Lean parlance, our _goal_) will be to construct an object whose type is "(Add (One One)) = Two" or, in the types we've constructed:
```julia
GoalType = Eq{Add{One, One}, Two}
```
In other words, we want to construct an object `final_goal` of type `GoalType` such that `final_goal isa GoalType` is true, which means that we have proven the claim by definition: we have used the rules of addition and equality to take objects we know exist and prove the final claim.

To do this, we can apply the rules we have above!
```julia
add_one_eq_succ_add_zero = add_succ(n_one, n_one) # S(0) + S(0) = S(S(0) + 0)
```
Remember, `add_succ` takes a `Natural` $a$ and a `Succ` $S(b)$ and spits out the statement $a + S(b) = S(a + b)$. Applying this to $1 + 1 = S(0) + S(0)$ gives $S(0) + S(0) = S(S(0) + 0)$.

I won't bore you with the rest of the details, but see the comments in line here for what statement each line is constructing:
```julia
one_plus_zero_eq_one = add_zero(n_one) # S(0) + 0 = S(0)
succ_one_plus = apply_fun(x -> Succ(x), one_plus_zero_eq_one) # S(S(0) + 0) = S(S(0))
```
Finally, note that the first line and the last line combined give us the result:
```julia
final_goal = trans(add_one_eq_succ_add_zero, succ_one_plus) # S(0) + S(0) = S(S(0))
```
as expected, if you now type
```julia
final_goal isa GoalType # returns true
```
you get the result that, indeed, we have proven the final goal.

## Some danger
It is of extreme importance that the "bare" constructor for `Eq` (or `Add`) is never provided to the user! If it were, then the user could define _any two things they can construct_ to be equal:
```julia
struct Tiger end
struct Lion end

wtf = Eq(Tiger(), Lion()) # ???
```
This is where a purpose-specific language like Lean really shines: its sole purpose is to prevent users accidentally constructing invalid claims. Julia, of course, was not built to prove theorems in this way, though it is possible to prevent (some) footguns here by not exporting constructors from modules.

# Conclusion
I mean, there's not much here of interest, but some final notes for the nerds.

First, unfortunately Julia's type system is only strong enough (as far as I can tell?) to prove first-order arithmetic over Peano. Universal quantifiers are out (in spite of my slip up in the livestream!) and you'd have to actually start running code/"enriching" the type system via some metaprogramming approaches.

Two is that the ergonomics are ok, but not phenomenal right now. For example, it would be very nice if we could overload notation such as 1 and 2 to mean both the types and the fact that these types are inhabited. (In Lean-like languages, distinguishing between 1, which is a thing of type `One` is very silly, since there's only one possible thing that could be of type `One`. In Julia, or Rust, or whatever, it is of course extremely useful!)

Hopefully this also gives some color to what people mean when they say that "type checking is theorem proving." Indeed, if something type checks, you have indeed proven something (which depends on the mechanics of the type system) about the underlying structures! It is just surprising that a "strong enough" type system suffices to be able to prove/verify any mathematical statement one might want.

---
[^1]: Lean has a very nice thing here in that it does not distinguish between the _type_ of a number and the _number itself_, if it can be constructed, but alas, we are programming in Julia so we have to be explicit. Also, technically, the `Succ` struct can also be an empty struct, taking only type information, but, due to Julia's type inference, it will be very convenient to have it take `pred` as a variable. A fun exercise is to rewrite all of the `struct`s to be empty structs and fix the corresponding code to work with these! (You'll have to make liberal use of `typeof` and type constraints in function calls. I just wanted to keep this post as clean as possible.)

[^2]: Note that Julia's type inference here is doing some of the work so we don't have a bunch of `T`s everywhere.

[^3]: Lean generally uses rewriting rules instead of equality rules like these for the most part (via the tactic `rw`) which generally leads to shorter proofs. Either way works, though.
