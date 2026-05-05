---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Fun with polynomials and linear algebra; or, slight abstract nonsense"
pubDate: 2026-04-30
---

This is mostly a bunch of notes to myself (with some slight expansion) and is a combination/extension/simplification of theorems/ideas/constructions from a bunch of texts, including Wistbauer's "Foundations of Module and Ring Theory" and Fuhrmann's "A Polynomial Approach to Linear Algebra", along with others that at this point I don't recall.

While most of the things here are pretty standard (indeed, many of these are just slightly generalized definitions given in introductions to linear algebra over arbitrary fields!) there is some stuff here that might be weird and surprising unless you're already quite well-versed in the language of module theory. (We won't be discussing modules here, though, even if many statements have natural module-theoretic generalizations.)

This document/post is more of an exercise to see just how many "standard" constructions can be done purely in the linear-algebraic language. In a sense, this document is an "any% speedrun" of some theorems (Chinese remainder theorem, _e.g._) and tidbits that most of us associate with different parts of math. It will also have some small exercises littered throughout, which are fun one-or-two-liners for those interested.

Anyways, onwards.

## Basic facts

Let $V$ be a vector space over a field $\mathbf{F}$ in what follows. If $V'$ is a vector space over the same field, we say
$$
V \simeq V'
$$
if there exists any invertible linear map between $V$ and $V'$. It is pretty easy to see that this is an equivalence relation.

Given a linear map $T: V \to V$ note that $T$ is injective (one-to-one) only when $Tx = 0$ implies that $x = 0$ (why?). Equivalently, it is when the kernel $\ker(T) = \{x \mid Tx = 0\}$ is trivial, _i.e._, $\ker(T) = \{0\}$. These are, of course, identical statements, but the latter is sometimes nicer when dealing with quotients, which we define later.

Now, let $W$ be a subspace of $V$, that is $W \subseteq V$ and $W$ is itself a vector space. We say that $W$ is _finite-dimensional_ and that $\dim(W)$ is the dimension of the subspace if
$$
W \simeq \mathbf{F}^{\dim(W)}.
$$
That is, if there exists some invertible linear map $W \to \mathbf{F}^{\dim(W)}$. (For those familiar with linear algebra, this is identical to saying that that there exists a finite number of $w_1, \dots, w_{\dim(W)} \in W$ which span the space and are linearly-independent; this is easy to see via the map $\phi: \mathbf{F}^{\dim(W)} \to W$ with $\phi(e_i) = w_i$.)

Note that $\dim(W)$ is unique (if it exists) so does not depend on the mapping. This means that if we have another subspace $U \subseteq V$ with $\dim(U) = \dim(W)$, then $U \simeq W$ since $U \simeq \mathbf{F}^{\dim(U)} = \mathbf{F}^{\dim(W)} \simeq W$.

In general, given two finite-dimensional vector subspaces $U$ and $W$ (or, slightly more generally, two vector spaces over the same field) then $U \simeq W$ exactly when $\dim(U) = \dim(W)$. The former often conveys slightly more information in practice since the mappings between $U$ and $W$ are fairly natural when constructed, but if we only know that $\dim(U) = \dim(W)$ then the map $U \to W$ may be fairly arbitrary and potentially complicated (though it will be, of course, linear).

It is also pretty easy to see from this definition that $\dim(U \times W) = \dim(U) + \dim(W)$ when $U$ and $W$ are finite-dimensional. (Consider the "obvious" map $U \times W \to U \to \mathbf{F}^{\dim(U)}$ and similarly for $W$.)

One useful observation is that if $n=\dim(U) = \dim(W)$ with both quantities defined, then any linear map $T: U \to W$ that is either injective or surjective (onto) must also be invertible. The "non-gentleman's proof"[^1] in the injective case is by noting that any basis $u_1,\dots, u_n$ in $U$ is a basis $Tu_1, \dots, Tu_n$ in $W$ if $T$ is injective. (Note that this is not true in the non-finite case; why?) This is helpful since, as we will soon see, it allows us to take "natural" maps $T$ which are easily seen to be injective and immediately show that they are invertible by dimension-counting.

Finally, it's useful to note that for some linear map $T: U \to W$, the preimage of this map $T^{-1}(w) = \{u \in U\mid Tu = w\}$ can be written as $T^{-1}(w) = u' + \ker(T)$ for any $u' \in U$ satisfying $Tu' = w$.

### Quotients by spaces

Given some subspace $W \subseteq V$ then (much like in standard abstract algebra) we can set
$$
V / W = \{v + W \mid v \in V\},
$$
where $v + W$ is defined elementwise; _i.e._, $v + W = \{v + w \mid w \in W\}$. The notion of a coset for vector spaces is identical to the one of Abelian groups, except that we work with subspaces which are the natural analogue to subgroups in the standard setting.

Note that $V / W$ is itself a vector space under the standard operations (again, applied elementwise) with the zero element $0$ equivalent to $0 + W$. (In what follows, it will be worth it to use $0$ as $0+W$ and vice versa, but the "type" of zero should be clear from context.) To see that $V/W$ is a vector space, let $v + W$ and $v' + W$ be any "vectors" in $V / W$ and let $\alpha, \beta \in \mathbf{F}$ be any elements of the field which $V$ is over, then
$$
\alpha (v + W) + \beta (v' + W) = \alpha v + \beta v' + W \in V / W.
$$
As an exercise it is worth parsing the left hand side _very_ carefully. This means that, like with any vector space, there is a notion of dimension, when the space $V / W$ is finite-dimensional.

Now, let $W, U \subseteq V$ be subspaces of $V$ with $\dim(U)$ and $\dim(V /W)$ defined, then note that if
$$
\dim(U) = \dim(V / W)
$$
and $U \cap W = \{0\}$, then $V = U \oplus W$. Since $\dim(U)$ and $\dim(V / W)$ are finite then $V / W \simeq U$ is equivalent to $\dim(U) = \dim(V / W)$.

The proof of this is pretty simple: let $\phi: U \to V / W$ giving $\phi(u) = u + W$. Then $\phi(u) = 0$ implies that $u+W = 0$, so $u=0$ since $W \cap U = \{0\}$ and so $\phi$ is injective. But an injective linear map between two spaces of the same dimension is invertible. Take $v \in V$ then note that $\phi^{-1}(v + W) = u \in U$. Finally, applying $\phi$ to both sides gives $u + W = v + W$, so $u - v \in W$, which means that there is some $w \in W$ such that $v = u + w$. (Another way of stating this is that $\phi$ defines a natural projection from $v \in V$ to $U$ via $v \mapsto \phi^{-1}(v + W)$.)

## Polynomial fun

Consider the vector space of polynomials over some field, denote it $V$. (It may be useful to consider $V$ instead to be the set of polynomials of degree $\le N$ for some $N$, in which case $V$ would have finite dimension, but what we'll talk about here holds in general, even when $V$ is not finite-dimensional.) Let $p \in V$ be a polynomial over the same field and set $W_p \subseteq V$ to be the set of polynomials divisible by $p$.

Note that $W_p$ is a perfectly reasonable subspace of $V$ since adding polynomials divisible by $p$ and multiplying them by constants does not change the fact that they are divisible by $p$.

This view leads to a bunch of nice results.

For example, it is reasonable to ask: what do the vector subspaces $W_p + W_q$ correspond to, for some polynomials $p$ and $q$? Writing out definitions, this is just the set of polynomials that can be written as $a p + bq$ for $a, b \in V$, by definition of $W_p$ and $W_q$. Using Bezout's lemma, this is the same as $W_{(p, q)}$ where $(p, q)$ is the (polynomial) greatest common divisor of $p$ and $q$. Similarly, you should work out what $W_p \cap W_q$ is. (If you're familiar with ideals, this is, for now, just a rewriting of the standard theorems there, hence the use of parenthesis notation!)

Additionally, note that the set of vectors in $V$ modulo $W_p$ (in the linear algebraic sense) is exactly the same as the set of polynomials modulo $p$ (in the polynomial sense). We will show that, indeed, quotienting $V$ by the space $W_p$ is the same as quotienting general polynomials by the polynomial $p$, in that
$$
V / W_p \simeq R_p,
$$
where $R_p \subseteq V$ is the set of polynomials with degree $< \deg(p)$. That is, the set of vectors in $V$, modulo $W_p$ (or, equivalently, polynomials modulo the polynomial $p$) is identical to the set of polynomials of degree $< \deg(p)$. From our little structure theorem above, this immediately shows that the polynomials decompose uniquely into $W_p$ and a remainder part in $R_p$:
$$
V = W_p \oplus R_p.
$$
In this sense, the vector space $W_p$ captures a lot of the structure of the polynomial $p$.

### Proof

Ok, to start, note that a polynomial $q \in V / W_p$ if and only if $q \in r + W_p$ for some polynomial $r$ in $V$, or, equivalently, $q = ap + r$ for some polynomials $a, r \in V$. This should already be quite reminiscent of the division theorem.

It is not hard to show that $\dim (V / W_p) \le \deg(p)$ for $p$ nonzero. In fact, this is the only polynomial fact we need to prove the theorem: let $q$ be a polynomial with $\deg(q) \ge \deg(p)$, then $q + W_p = q - ap + W_p$ for any polynomial $a \in V$. It is easy to set $a$ such that $\deg(q - ap) < \deg(q)$ (why?) so we may assume in general that $\deg(q) < \deg(p)$ by applying this observation repeatedly. This implies that the monomials $\{1, \dots, x^{\deg(p)-1}\} + W_p$ span $V / W_p$ so $\dim(V / W_p) \le \deg(p)$, as required. It is easy to see that $\dim(V / W_p) \ge \deg(p)$ by comparing degrees, which gives the final claim that

$$
\dim(V / W_p) = \deg(p).
$$

Of course, this exactly matches the degree bound for polynomial division and therefore the dimension of $R_p$ hence $R_p \simeq V / W_p$. Finally, since $R_p \cap W_p = \{0\}$ (why?) and $\dim(R_p) = \deg(p)$ we have the result $V = W_p \oplus R_p$ by the mini-structure theorem above.

## Abstract nonsense-ish Chinese remainder theorem

Now, we can get to a result that generalizes the case of ideals.

An interesting observation from Wistbauer's 1991 textbook is the following very lovely construction (let's say over vector spaces, but it holds in general over modules with a slightly different condition).

Let $W_1, \dots, W_n \subseteq V$ be vector subspaces of $V$ such that $V / \bigcap_i W_i$ is finite-dimensional, then

$$
V / \bigcap_i W_i \simeq \prod_i \left(V / W_i\right),
$$
exactly when
$$
\dim(V / \bigcap_i W_i) = \sum_i \dim(V / W_i).
$$
This just follows from our definition of "dimension" and the surrounding discussion.

In other words, it is possible to decompose a quotient over an intersection of subspaces into a product of individual quotients with each subspace, exactly when the dimensions match.

### Canonical map

In fact, the dimension equality implies the canonical map $V / \bigcap_i W_i \to \prod_i (V / W_i)$ is also invertible. To see this, let $\pi_i: V \to V / W_i$ be the map for the $i$th component, such that $\pi = \pi_1 \times \dots \times \pi_n$ is the "obvious" map. That is,
$$
\pi_i(x) = x + W_i,
$$
for $x \in V$. Now, note that $\pi = g \circ f$ where $f: V \to V / \ker \pi$ and $g: V / \ker \pi \to \prod_i (V / W_i)$, where $f$ is the canonical map $f(x) = x + \ker \pi$ and $g$ is the (induced!) injective map $g(x + \ker \pi) = \pi(x)$. (You should check that this is, indeed, injective.) It is clear that $\ker \pi = \bigcap_i \ker \pi_i = \bigcap_i W_i$, and the dimension equality then tells us that the space $g$ maps from, $V / \ker \pi = V / \bigcap_i W_i$, has the same dimension as the output space $\prod_i (V / W_i)$ and hence $g$ is not just injective, but invertible.

As a special case, if $V$ is finite-dimensional and $\bigcap_i W_i = \{0\}$, then we get that there is a natural invertible map
$$
V \to \prod_i (V / W_i),
$$
exactly when $\dim(V) = \sum_i \dim(V / W_i)$.

### Back to the theorem

After all of this, we might ask: why is this the Chinese remainder theorem?

As before, let $V$ be the vector space of polynomials over some field $\mathbf{F}$ and let $p_1, \dots, p_n$ be polynomials with coefficients in $\mathbf{F}$ that are mutually coprime, such that a least-common multiple of them is $p_1p_2\cdots p_n$. Then recall that $V / W_{p_i}$ is exactly the set of remainders modulo $p_i$ (in the polynomial sense).

By the division argument above, we have that $\dim(V / W_{p_i}) = \deg(p_i)$ while $\bigcap_i W_{p_i}$ is $W_{q}$ where $q$ is any least-common multiple of the $p_i$. So, again from above, $\dim(V / \bigcap_i W_{p_i}) = \deg(p_1p_2\cdots p_n) = \deg(p_1) + \dots + \deg(p_n)$, so the left hand side and right hand side match and we can decompose any polynomial $f$ modulo $p_1p_2\cdots p_n$ into the polynomial $f$ modulo each $p_i$ uniquely and vice versa, which is exactly the Chinese remainder theorem.

Indeed, the map above lets us do the decomposition in a straightforward way since it tells us how the two spaces are related via the $\pi_i$ (and $g$).

Given the product description $\pi = \pi_1 \times \dots \times \pi_n$ it is natural to consider elements of the form $(0, \dots, x_j + W_j, \dots, 0)$ for some index $j$ with $x_j \in V$. Since any element in $\prod_i (V / W_i)$ can be written as the sum of elements of this form, finding an inverse for this type of element suffices to find inverses for any element because $g$ (and therefore $g^{-1}$) is linear.

Now, since $g$ is invertible, let $y + \bigcap_i W_{p_i} = g^{-1}((0, \dots, x_j + W_{p_j}, \dots, 0))$ for some $y \in V$ and, by definition of $g$ we have $y - x_j \in W_{p_j}$. But note that $y \in W_{p_k}$ for each $k\ne j$, by definition, so $y \in \bigcap_{k \ne j} W_{p_k}$. Since we know that $\bigcap_{k \ne j} W_{p_k}= W_{q_j}$ where $q_j = q / p_j = p_1\cdots p_{j-1}p_{j+1} \cdots p_n$ then this tells us exactly what we need to find the inverse: find some polynomial $y$ such that $y$ has the same remainder as $x_j$ (modulo $p_j$) but is a multiple of the polynomial $q_j$, then take the remainder over the big polynomial $q$.

If we want to go back to "polynomial land" then this follows directly from Bezout's lemma using the fact that $q_j$ and $p_j$ are coprime. Of course, we can give a linear-algebraic description here too, using the definitions and discussion above regarding the equivalence between polynomials, greatest common divisors, and the vector subspaces generated by them.

To see this, note that we have $W_{p_j} + W_{q_j} = W_{(p_j, q_j)} = W_{(1)} = V$, so any $x_j \in V$ can be written in the form $x_j = z + y$ with $z \in W_{p_j}$ and $y \in W_{q_j}$. (Again, this is Bezout's lemma in a funny hat, but the point is that it's all just vector spaces once you have the equivalence.) It is then pretty immediate that (a) $y + W_{p_j} = x_j + W_{p_j}$, (b) by definition $y$ is a multiple of $q_j$ since $y \in W_{q_j}$, and, finally, (c) we may take $y + \bigcap_i W_{p_i}$ as required.

### The basis view

In the case that $V$ is finite-dimensional, the equivalence has a very simple interpretation in terms of stacked matrices.

For now, take the subspaces to satisfy $\bigcap_i W_i = \{0\}$, as it will make our lives slightly easier.

Since $V$ is finite dimensional, say of dimension $m$, then $V \simeq \mathbf{F}^m$ so we have an invertible map $\phi: \mathbf{F}^m \to V$. This also means that $V / W_i$ is of finite dimension (why?), call it $m_i = \dim(V / W_i)$. Now let $T_i: \mathbf{F}^m \to \mathbf{F}^{m_i}$ be any linear map (representable as a matrix of size $m_i \times m$) satisfying $\phi(\ker T_i) = W_i$. In other words, the nullspace of $T_i$ is $W_i$ in the basis given by $\phi$. Then the condition
$$
\dim(V)= \sum_i \dim(V / W_i),
$$
is exactly the condition that the dimensions of the matrices $T_i$ add up: $m = m_1 + \dots + m_n$, and the condition that $\bigcap_i W_i = \{0\}$ is similarly the condition that they share no elements that are mapped to zero simultaneously. Equivalently, it is the condition that the stacked matrix
$$
T = \begin{bmatrix}
T_1\\
T_2\\
\vdots\\
T_n
\end{bmatrix}
$$
has $\ker T = \{0\}$ or is, in other words, invertible.

There's all sorts of additional simple consequences of this view. For example, this means that the rows of the $T_i$ must all be linearly independent, or, given a system with outputs over $V$, any linear measurements $T_1, \dots, T_n$ can reconstruct the output unambiguously.

As a final exercise: what's the interpretation of $T$ and the dimension conditions in the case that the subspaces do not satisfy $\bigcap_i W_i = \{0\}$?

---

Edits: thank you to [seanhunter](https://news.ycombinator.com/item?id=48010630) for pointing out silly mistakes!

---

[^1]: A "gentleman's proof" is one which is not basis-dependent. There is such a proof of this statement by noting that a proper subspace $TU = \{Tu \mid u \in U\} \subsetneq W$ has at least one (nonzero) element $x \in W \setminus TU$ and this element generates a subspace of dimension at least 1 making $TU \oplus \langle x \rangle \subseteq W$ so $\dim(U) = \dim(TU) < \dim(W)$ since $T$ is injective.