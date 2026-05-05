---
layout: ../../layouts/MarkdownPostLayout.astro
title: "The Chinese remainder theorem and the Fourier transform"
pubDate: 2026-05-05
---

I'd recommend skimming the [previous post](/posts/abstract-nonsense.html) if you have not yet done so, which discusses the Chinese remainder theorem in a purely linear-algebraic light, along with a bunch of notions we use. It's neat, though we don't say anything that is terribly surprising.

That's, instead, what this post is for.

As a quick reminder, the somewhat abstract-nonsense-y Chinese remainder theorem is the following: let $V$ be a vector space over a field $\mathbf{F}$ and let $W_1, \dots, W_k \subseteq V$ be subspaces of $V$. If, dimensionally, we have
$$
\dim(V / \bigcap_i W_i) = \sum_{i} \dim(V / W_i),
$$
(where all dimensions are defined) then we can decompose $V$ in the following way
$$
V/ \bigcap_i W_i \simeq \prod_i (V / W_i),
$$
where the invertible map $\pi: V/ \bigcap_i W_i \to \prod_i (V / W_i)$ is the product $\pi = \pi_1 \times \dots \times \pi_k$ of natural maps into $V / W_i$:
$$
\pi_j\left(x + \bigcap_i W_i\right) = x + W_j,
$$
for $j=1, \dots, k$.

### The abstract Fourier transform

Ok, with that, we can start with the "general" Fourier transform over fields.

Let $V$ be the vector space of polynomials over some field $\mathbf{F}$ and let $p \in V$ be any nonzero polynomial which decomposes into $p = q_1q_2\cdots q_k$ with $q_1, \dots, q_k \in V$ mutually coprime. Define $W_p$ to be the set of all polynomials in $V$ that are divisible by $p$. This means, from the [previous post](/posts/abstract-nonsense.html), that we have the equivalence:
$$
V / W_p \simeq \prod_i V / W_{q_i}
$$
where the coordinate-wise map is the “obvious” one:
$$
\pi_i(x + W_p) = x + W_{q_i}.
$$
which is (again!) the Chinese remainder theorem over the $\{q_i\}$.

Now, if $p$ _splits_ over $\mathbf{F}$ and has no repeated root, that is, if $p$ satisfies
$$
p(x) = \alpha_0(x - \alpha_1)(x - \alpha_2)\cdots (x - \alpha_n)
$$
for $\alpha_0, \dots, \alpha_n \in \mathbf{F}$ with $\alpha_1, \dots, \alpha_n$ distinct, then we can set $q_i(x) = x - \alpha_i$ for $i=1, \dots, n$. (Easy check: what must $n$ be here, in terms of $p$?) Note that the $q_i$ are indeed mutually coprime and $\bigcap_i W_{q_i} = W_p$, so the conditions are satisfied and, from before, we have
$$
V / W_p \simeq \prod_i V / W_{q_i},
$$
via the simple map above.  Finally, note that $\dim(V / W_{q_i}) = \deg(q_i) =1$ for each $i$, so $V / W_{q_i}$ can be described by exactly one field element $\mathbf{F}$. Indeed, [from the previous post](/posts/abstract-nonsense.html), one such description is that $f \in V / W_{q_i}$ is equivalent to taking the remainder of $f$ modulo $q_i$, which is simply the value of $f$ at $\alpha_i$.[^1]

In other words, there is a simple invertible linear mapping between a polynomial (modulo $p$) and its evaluation on points $\alpha_1, \dots, \alpha_n$, which are the roots of $p$. That is to say for each polynomial $f$ modulo $p$, there is an equivalence $f \to \hat f$ between the polynomial modulo $p$, $f + W_p$, and its evaluations $f(\alpha_1), \dots, f(\alpha_n)$.

This leads us to the last appetizer course.

#### The abstract convolution theorem

This is almost an immediate application of the above. In particular, let $f, g \in V$ be two polynomials, then we have that
$$
fg + W_p \quad \leftrightarrow \quad ((fg)(\alpha_1), \dots, (fg)(\alpha_n))= (f(\alpha_1)g(\alpha_1), \dots, f(\alpha_n)g(\alpha_n)).
$$
Or, in polynomial notation:
$$
fg \mod p \quad \leftrightarrow \quad (f(\alpha_1)g(\alpha_1), \dots, f(\alpha_n)g(\alpha_n)),
$$
and the map is exactly the evaluation of the product at the points $\alpha_1, \dots, \alpha_n$.

Again, note on the left hand side we are doing multiplication _as polynomials_. That is to say, we are convolving the coefficients of $f$ and $g$ and then reducing them modulo $p$, whereas on the right, we are doing pointwise multiplication of the evaluations of $f$ and $g$ over the points $\alpha_i$.

Indeed, this is exactly where the structure of $p$ splitting over $\mathbf{F}$ is useful. Note that the original abstract Chinese remainder theorem requires that $\bigcap_i W_{q_i} = W_p$. Now the dimensions of the map $V / W_p \simeq \prod_i V / W_{q_i}$, of course, make sense without this requirement when $\deg(p)=n$, so we in general have a relationship between $f$ modulo $p$ and its evaluations over the $\alpha_i$, but the "natural" quotient map $x + W_p \mapsto x + W_{q_i}$ only makes sense when $W_p \subseteq W_{q_i}$, or, equivalently, when $q_i$ divides $p$. So, if we were to take $fg + W_p$, then the output of such a map will not necessarily be of the form $fg+W_{q_i}$, so the abstract convolution theorem above would not hold.

### The usual discrete Fourier transform (DFT)

Ok, now let's finally get to the "usual" DFT. Let $\alpha_1, \dots, \alpha_n$ be the $n$th roots of unity over some field $\mathbf{F}$, such that they are the roots of the polynomial $p(x) = x^n - 1$. That is to say, the polynomial $p$ splits over $\mathbf{F}$, with the roots of unity $\{\alpha_i\}$ as its factors. (This goes both ways: $\alpha_i$ is an $n$th root of unity over some field if, and only if, it is a root of $x^n - 1$ over this field.) We can also take any $n$th primitive root of unity $\omega$ (that is, one in which $\omega^i \ne 1$ when $i=1, \dots, n-1$) and write $\alpha_i = \omega^i$ for $i=1, \dots n$ up to relabelling of the indices.

Note that the field $\mathbf{F}$ can be anything that has $n$th roots of unity—we have made no assumptions about the field anywhere other than $0 \ne 1$, implicitly, in our proof. For example, taking our field $\mathbf{F}= \mathbf{C}$, the complex numbers, we could have, for any $n$, $\alpha_i = \exp(-\mathbf{i}2\pi i/n)$, where $\mathbf{i}^2 = -1$. On the other hand, in the Fermat prime field $|\mathbf{F}| = 2^{16} + 1$, we can take $\alpha_i = 3^{i} \mod 2^{16} + 1$ and $n = 2^{16}$. Any of these (and many more, of course!) are perfectly valid options.

Now, let's go back to our equivalence.

We previously said, taking $p(x) = x^n - 1$, that
$$
f \mod (x^n - 1) \quad \mapsto \quad (f(\alpha_1), \dots, f(\alpha_n)),
$$
is invertible over $\mathbf{F}$. This is the usual (discrete) Fourier transform. In particular, we may take $f \mod (x^n - 1)$ to be of degree $\le n-1$ since any element of degree $m \ge n$ will have $x^m = x^{m \mod n}$. The mapping is just the "forward" Fourier transform:

$$
f(\alpha_i)= \sum_{j=1}^n f_j \alpha^{j-1}_i,
$$
where $f_1, \dots, f_n$ are the $n$ coefficients of $f \mod (x^n-1)$. In terms of a primitive $n$th root $\omega$, we have that $\alpha_i = \omega^i$ (again, up to relabeling of the $\{\alpha_i\}$) so
$$
f(\omega^i)= \sum_{j=1}^n \omega^{i(j-1)} f_j.
$$
This is the standard DFT equation.
#### Circular convolution to products

Now, let $f, g \in V$ both be polynomials, then we also have, from our more abstract version of the convolution theorem above, that
$$
fg \mod (x^n - 1) \quad \mapsto \quad (f(\alpha_1)g(\alpha_1), \dots, f(\alpha_n)g(\alpha_n)).
$$
As mentioned before, the multiplication $fg$ is multiplication as polynomials. That is, the coefficients of the polynomial $fg$ are the coefficients of the polynomial $f$ convolved with those of $g$, then reduced by $x^n - 1$. But this reduction simply maps all terms $x^{m} \to x^{m \mod n}$. In other words, the coefficients of $fg \mod (x^n - 1)$ are exactly the coefficients resulting from a circular convolution of the coefficients of $f$ with those of $g$ !

Equivalently, this gives the "vectorial form", when $f$ and $g$ are assumed to be of degree $\le n-1$:
$$
f * g \quad \mapsto \quad \hat f \circ \hat g.
$$
Here, we write $f * g$ for the circular convolution of the coefficients of $f$ and $g$ and write $\hat f_i = f(\alpha_i)$ and similarly for $g$, with $\circ$ being the elementwise (Hadamard) product. From before, the forward map between the convolution and the product is the evaluation map $f \mapsto \hat f$. (A simple exercise is to write out what the matrix $F \in \mathbf{F}^{n \times n}$ such that $\hat f = Ff$ looks like!)

### The "additive" Fourier transform

Finally, we note that there are a bunch of other possible types of Fourier transform, including the so-called "additive" Fourier transform, which works over fields of characteristic two. (It really works for any finite field of nonzero characteristic, but small-characteristic fields are the most practical; we'll go through the characteristic-two case here and leave the rest as an exercise.) This type of transform is incredibly useful in a number of succinct proofs, see, _e.g._, [Binius](https://eprint.iacr.org/2023/1784), [ZODA](https://eprint.iacr.org/2025/034), or [Ligerito](https://eprint.iacr.org/2025/1187).

Let $\mathbf{F}$ be a finite field with $|\mathbf{F}|=2^m$ for some positive integer $m$, then note that $\mathbf{F}$ is a vector space over $\mathbf{F}_2 = \{0,1\}$ of dimension $m$. (Why?) Let $e_1, \dots, e_m$ be any basis of this vector space and let $n \le m$. In what follows, $2^n$ will be the number of evaluation points of the polynomial $f$ modulo a particular polynomial $p$ we will choose carefully.

With that, let $p$ be a polynomial that vanishes on any $x$ which is in the span of $e_1, \dots, e_n$ (not $m$) over $\mathbf{F}_2$. Call this the $\mathbf{F}_2$-vector space $A$. Explicitly, $p$ can be, for example
$$
p(x) = \prod_{\beta \in \{0, 1\}^n} (x - \beta_1e_1 - \dots - \beta_n e_n) = \prod_{\alpha \in A} (x - \alpha).
$$
so $\ker p = A$. Note that $p$ splits exactly over all points in $A$ (and therefore splits over $\mathbf{F}$) satisfying the conditions for the abstract Fourier transform above.

From our abstract Fourier transform theorem above, this has the immediate implication that there is an invertible map, for any polynomial $f$ over $\mathbf{F}$ between
$$
f + W_p \quad \mapsto \quad (f(\alpha))_{\alpha \in A},
$$
and this map is the obvious one: $f + W_p \to f(\alpha)$ for each $\alpha \in A$. (Quick one: why is this injective, again?) This looks just like a simple application of the above, but it has some very special structure.

#### A teensy dessert

As a little bit of a cliffhanger, it is not hard to show by induction that $p$ satisfies $p(x + y) = p(x) + p(y)$ for any $x, y \in \mathbf{F}$, as does any polynomial of that form.

We can then split $A$ into two disjoint cosets $A = A' \cup (u + A')$, for some $u\in \mathbf{F}$ and some $A' \subseteq A$ which also a vector space over $\mathbf{F}_2$. Set $q$ to be the polynomial that vanishes over $A'$, in the same way as $p$ above, then $p(x)=q(x)q(x - u) = q(x)(q(x) + q(u))$, since $a - b = a+b$ in characteristic two. From before, $q$ and $q+q(u)$ split over $\mathbf{F}$, yet share no roots since they vanish over $A'$ and $u + A'$ respectively, which share no common elements. This means they are mutually coprime and, by the abstract Chinese remainder theorem above, we have
$$
f + W_p \quad \mapsto \quad (f+W_q, f+W_{q+q(u)}).
$$
Of course, we can continue decomposing $A'$ and therefore $q$ itself into the product of two polynomials, mutually coprime, and so on...

Which suggests, maybe, that there's a faster algorithm for evaluating $(f(\alpha))_{\alpha \in A}$, than just naively evaluating $f$ at every point of $A$.

And, maybe, just maybe, a very similar observation also holds for the "usual" Fourier transform.

Until next time!


---

[^1]: There is a "nearly-purely-linear-algebraic proof" instead by noting that the evaluation-at-$\alpha_i$ map $V \to \mathbf{F}$ has kernel containing $W_{q_i}$ since any $f \in W_{q_i}$ evaluates to zero under this map (why?). We can therefore consider it as a map $V / W_{q_i} \to \mathbf{F}$, but the map is also not zero everywhere (since obviously the constant polynomial $1 \in V$ is not zero at $\alpha_i$) and so must be surjective—and therefore invertible—by dimension counting since $\dim(V / W_{q_i}) = 1 = \dim(\mathbf{F})$.
