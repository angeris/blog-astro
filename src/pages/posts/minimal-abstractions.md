---
layout: ../../layouts/MarkdownPostLayout.astro
title: The minimal amount necessary, but no less
pubDate: 2025-05-13
---
An interesting question I bump into is "what is the right level of abstraction for X" where, "X" takes on values from {theorems, papers, ideas, observations, explanations} and so on. The answer I think has far more to do with taste than it does with some general framework that can be applied, but, maybe with some examples, we can at least try to _vaguely_ point at the right thing.

In particular, an abstraction is _good_ if it illuminates why something is spiritually true, while abstracting away all mechanical details. I'll give two examples of this; one personal and one not.

## Convexity vs nonlinearity
The first major historical example I can think of is that of _convexity_. Originally, problems were divided into "linear" and "nonlinear" where "linear" roughly stood for "easy" while "nonlinear" stood for "hard." In a sense, linear problems were easy to solve, even if it took some effort, while nonlinear problems would have no hope, unless they could be "somehow linearized."

This was weird, because we know some nonlinear optimization problems really are pretty easy: for example, solving for the distribution with maximum entropy even under some additional constraints. The transition of going from "linear/nonlinear is easy/hard" to "convex/nonconvex is easy/hard" probably looked a little like this.

Take some linear optimization problem. That is, a problem where we seek to minimize a linear function, subject to linear constraints such as inequalities. A natural observation is: cool, ok, we can always continue adding linear constraints to this problem and the problem still remains "easy" to solve as it's still linear! (Perhaps it may take a little longer and so on, but that's fine.) What is the natural limit of such problems? What happens when you can add, say, an infinite number of constraints?

It turns out the answer of this limit is, in general, a convex problem. The observation is very simple: the set of all points that satisfy (any number of) linear constraints is always a convex set. (You should prove this, if you're not convinced; it's a two-line proof.) Fenchel's observation was that, in fact, the opposite _was also true_: any convex set can be represented by a (potentially infinite) family of linear constraints. A similar argument holds for the objective function, though it's a little trickier. But the point is that any optimization problem which seeks to minimize a convex function subject to convex constraints is also similarly as "easy" as a linear problem, for roughly the same mechanical reasons that linear problems are easy.[^1]

Convexity also has a bunch of nice downstream consequences, which cause it to roughly be the "correct" dividing line between computationally "hard" and computationally "easy", in a way that is hard to explain in a few lines. The idea is roughly: "convex" problems are easy, "nonconvex" problems are hard—unless there is "hidden convexity" in which case it is easy... because it's convex. Linear is "easy" because it is convex, but nonlinear need not be obviously hard or easy, since many convex things are not linear!

## Linear algebra in ZK/succinct proofs
Another, perhaps more personal, example is the whole [ZK/succinct proofs are (mostly) just basic linear algebra](https://angeris.github.io/papers/zk-linalg.pdf) bit. The high level idea was very simple. Most of the time, succinct proofs make use of two things. First, they take a bunch of vectors (polynomials, etc) and take a random linear combination of those things. And second, they use the fact that these random linear combinations are "valid" in some general sense. In other words, some operation over a random linear combination of vectors/data/etc. is, in some sense, the same as taking the operation over each vector/data/etc. first and then randomly combining the results of the operation. Naturally, this suggests that *linearity* is probably the most important property of these systems.

I mean, there's a whole field of that stuff and it even has an apt name: "linear algebra". So it's probably natural to look there.[^3]

This view works out nicely in many cases. For example, the 'slightly lower-level' view of polynomials will sometimes obscure the mechanics of what's going on. (_E.g._, are we dealing with evaluations or coefficients? What basis are we using? How do we evaluate these things efficiently?) The main point is that by virtue of being linear, the questions are completely sidestepped and the objects you work with are much more similar "to the ones in your head." This leads to [relatively simple observations](https://eprint.iacr.org/2024/1399) which can then be used to build even [more efficient protocols](https://angeris.github.io/papers/da-construction.pdf) that are not quite so obvious from the low-level perspective. (And potentially work with [more general codes than just Reed--Solomon](https://eprint.iacr.org/2024/1609), which may be faster/cheaper/better in whatever number of ways.)

While it is possible to generalize these protocols even further, it is not so obvious what the generality gains. For example, if we allow abstract operations (not just those that are linear over fields), much of the structure we care about is lost and it's not clear what can be said here other than, perhaps, some high level scaffolding about the structure of proofs.

In other words, linear algebra is sort of a “sweet spot” (like convexity) separating the useful from the too-general, while still pointing at and maintaining the major grain of truth.
## What is less than minimal
This kind of leads me to the "bad case" which is when an abstraction is _less than minimal_. In other words, it is so general that, in its attempt to capture everything, it explains almost nothing. This is also a classic pitfall of "frameworks" which appear to be helpful in spirit, but are generally not explanatory in any real sense.

Roughly speaking, an abstraction is _less than minimal_ if it removes the reason why certain statements must be "spiritually true." A good abstraction clarifies this, a bad abstraction hides the "spiritual truthfulness" of a statement in a reduction. For example, you should be suspicious of some abstraction X when most of the time is spent "reducing" a problem to X, rather than having X do the heavy lifting. One, perhaps naive, version of this to me is very much the category-theoretic knee-jerk reaction to "everything is just category theory". While it is true in a similar sense to "everything can be reduced to set theory", à la _Principia Mathematica_'s proof of 1+1=2, the work is mostly in the reduction which (to me) indicates that the abstraction is not "carrying its weight" for such statements.[^2]

Note that this is _very_ different and should be distinguished from an abstraction "hiding" the difficult parts of a proof by encapsulating them in a nice "interface". This is generally good, depending on your goals, since it clarifies the structure of the proof. (An example of this is if $A$ is a matrix and $x$ is a vector, writing $Ax$, while innocently looking like multiplication, hides an enormous amount of computational and functional complexity, while still "suggesting" what properties this operation has, such as associativity, linearity, and so on.)

## Other notes
In general, finding the abstraction that operates at the right level to say something useful is often almost all (if not all) of the work for most topics. Indeed, in my experience, something like 80% of the (non-writing) time of research is spent on _exactly this and almost nothing else_. Once the abstraction is clear, the result feels like it falls out as an inevitable conclusion.

If there's one heuristic to take away from this post, it is something like the following:

> If translating to the abstraction takes longer than finishing the proof without it, it’s overkill. A correct abstraction makes it obvious and unavoidable what the next step is and where the edges lie.

Or, in the words of Alex Evans,

> Finding the right abstraction is the hardest part of the work, but, conveniently, ends up being like 99% of the useful work when considering a project in hindsight.

May good abstractions be ever in your favor.

---

Would love to thank [Alex](https://x.com/alexhevans) (quoted above) for reading this essay ahead of time and suggesting the last paragraph!

---

[^1]: [One particular story](https://web.math.ucsb.edu/~crandall/math201b/vnminimax.pdf) I like about this "linearity obviously extends to convexity" is Johnny von Neumann's conception of convexity in the minimax theorem. Having proved the minimax theorem (for general quasiconcave/quasiconvex functions, though he didn’t call them that) for game theory via an (essentially insane) topological argument that is roughly equivalent to an extension of Brouwer's fixed point theorem in disguise, he and Morgenstein (also of Game Theory fame) discover Ville's simple-ish proof of the minimax theorem about 10 years later. From there, the two essentially construct a completely general convex argument for the minimax theorem in a few lines, but apply it only in the linear case (though the extension, at this point, is so obvious that it is left unsaid). Of the result, so obviously viewed as a convexity argument in hindsight, von Neumann himself states, "The theorem, and its relation to the theory of convex sets were far from being obvious.... It is common and tempting fallacy to view the later steps in a mathematical evolution as much more obvious and cogent after the fact than they were beforehand."

[^2]: It is possible I will eat crow when someone gives me a particularly nice proof of an important theorem that isn't better expressed in a "special case" via a category-theoretic treatment, but I've yet to come across this in any real sense.

[^3]: This was (rather entertainingly) quite divisive when it was first released! Some people argued it was just too general to say anything interesting that could not be said with "simpler" tools (like polynomials). Others argued it was just saying what everyone already knew but just didn't really bother to write down, though apparently it was neat that the proofs were (for some apparently unknown reason) shorter.