---
layout: ../../layouts/MarkdownPostLayout.astro
title: There are exponentially many vectors with small inner product
pubDate: 2025-07-09
---
An interesting observation that [Alex](https://x.com/alexhevans) stumbled across while reading some of [Anthropic's work on LLM interpretability](https://transformer-circuits.pub/2022/toy_model/index.html#motivation) is the following

> Although it's only possible to have $n$ orthogonal vectors in an $n$-dimensional space, it's possible to have $\exp(n)$ many "almost orthogonal" ($\varepsilon$ cosine similarity) vectors in high-dimensional spaces. See the [Johnson–Lindenstrauss lemma](https://en.wikipedia.org/wiki/Johnson%E2%80%93Lindenstrauss_lemma).
 
While the JL lemma does indicate that this might be true (ish, in a certain sense) it is not obvious that this statement directly translates to the one given here. (I won't comment on the content on the rest of the linked post, some of which I find somewhat, uh, loose in construction, but I'll focus specifically on this point.)

## Why should this not be true?
For example, a simple fact from linear algebra is that, given $m$ vectors $x_1, \dots, x_m \in \mathbf{R}^n$ in $n$ dimensional space each of which has nonpositive inner product with any other vector $x_i^T x_j \le 0$ for $i \ne j$, we have that $m \le 2n$. In other words: no more than $2n$ vectors can have pairwise nonpositive inner products with any other. (The fact that this is tight is very easy to show: pick the unit vectors and their negatives.) A very simple argument also shows that, if we restrict further to have $x_i^Tx_j \le -\varepsilon < 0$ (note the negative!) and normalize the $x_i$ to have $\|x_i\| = 1$, then:
$$
m \le \frac{1}{\varepsilon} + 1.
$$
(Of course, this bound is useless if $\varepsilon \le 1/(2n-1)$ since it tells us nothing more than what we already knew from the previous bound.[^1])

On the other hand, if the original statement—that we can have exponentially many vectors with slightly positive inner product—is true, it would indicate a _phase transition_ in the number of possible vectors we are allowed to have from $\varepsilon$ negative, to zero, to positive. There aren't that many things that undergo dramatic phase transitions like this, but, every once in a while, it does happen!

## Idea and proof
Anyways, I'm sure the title of this post gave away the punchline, but indeed the following is true: for any $\varepsilon > 0$ there exists a list of $m$ normalized vectors $x_1, \dots, x_m \in \mathbf{R}^n$ in $n$ dimensions such that $x_i^Tx_j \le \varepsilon$ (for $i \ne j$) where $m$ satisfies
$$
m \ge \exp\left(\frac{n \varepsilon^2}{4}\right).
$$
A [volumetric argument](https://mathoverflow.net/questions/386966/choosing-maximum-number-of-separated-points-on-a-sphere-surface) shows that this is tight on $n$ up to constants in the exponent, but that's less fun.

### Basic proof sketch
As usual, we will provide a (very silly) randomized construction for the normalized vectors. Pick $m$ vectors $\tilde x_1, \dots, \tilde x_m \in \{\pm 1\}^n$ uniformly at random (with $m$ no larger than the bound we gave) and set $x_i = \tilde x_i/\sqrt{n}$.

Clearly the $x_i$ are normalized, by construction. The only thing left to show is that, with some nonzero probability, these vectors will have small inner product; _i.e._, $x_i^Tx_j \le \varepsilon$.

Of course, we know that (bounded) independent random variables with mean zero have very strong concentration phenomena in the sense that their sum is $\lesssim \sqrt{n}$ with very high probability. (Indeed, the sum really is [around that size too](https://lmao.bearblog.dev/simple-proof-rademacher/).) This, in turn, implies that $(1/n) \tilde x_i^T \tilde x_j = x_i^T x_j > \varepsilon$ with very _low_ probability for any one $i \ne j$. Adding everything up then bounds the probability that any one pair fails to satisfy $x_i^T x_j \le \varepsilon$ which gives the result.

### Full(ish) proof
Ok, with that idea, the details are now mostly mechanical, but let's write them out anyways. Here are two simple observations of uniform $\pm 1$ random variables, also known as _Rademacher random variables_.

1. The product of two independent Rademacher random variables is also Rademacher
2. Expectations of Rademacher variables and functions thereof are very simple to compute

Our goal will now be to show that the probability that any two vectors $i \ne j$ have inner product larger than $\varepsilon$ is small. Since $x_i = \tilde x_i/\sqrt{n}$ then
$$
\Pr(x_i^Tx_j > \varepsilon) = \Pr(\tilde x_i^T \tilde x_j > n\varepsilon).
$$
Let $Z_1, \dots, Z_n \sim \{\pm 1\}$ be uniform and independent. From our observations, note that
$$
\Pr(\tilde x_i^T \tilde x_j > n\varepsilon) = \Pr(Z_1 + \dots + Z_n > n\varepsilon).
$$
We can multiply by a nonnegative constant $\lambda \ge 0$ and take the exponential of both sides to get
$$
\Pr\left(\exp(\lambda(Z_1 + \dots + Z_n)) > \exp(\lambda n\varepsilon)\right) \le \frac{\mathbf{E}[\exp(\lambda(Z_1 + \dots + Z_n))]}{\exp(\lambda n \varepsilon)}.
$$
(The right hand side inequality is [Markov's inequality](https://en.wikipedia.org/wiki/Markov%27s_inequality).) Since the $Z_i$ are independent and identical, note that
$$
\mathbf{E}[\exp(\lambda(Z_1 + \dots + Z_n))] = \left(\mathbf{E}[\exp(\lambda Z_1)]\right)^n = \left(\frac{e^{\lambda} + e^{-\lambda}}{2}\right)^n.
$$
Finally, it is not hard to show an upper bound on the right hand side,
$$
\frac{e^{\lambda} + e^{-\lambda}}{2} \le \exp\left(\frac{\lambda^2}{2}\right),
$$
and, using this upper bound and putting everything together, gives that, for any $\lambda \ge 0$,
$$
\Pr(x_i^Tx_j > \varepsilon) \le \exp\left(n\left(\frac{\lambda^2}{2} - \lambda \varepsilon\right)\right).
$$
Setting $\lambda = \varepsilon$ gives the result
$$
\Pr(x_i^Tx_j > \varepsilon) \le \exp\left(- \frac{n\varepsilon^2}{2}\right).
$$
Since there are $m(m-1)/2$ possible pairs of $i, j$ with $i \ne j$, we then have that the probability that any one of the pairs $i,j$ has inner product larger than $\varepsilon$ is bounded from above by
$$
\frac{m(m-1)}{2}\exp\left(- \frac{n\varepsilon^2}{2}\right) < m^2 \exp\left(- \frac{n\varepsilon^2}{2}\right) \le 1,
$$
where the right hand side inequality holds for any $m \le \exp(n\varepsilon^2/4)$ .

Equivalently, there is nonzero probability that a given sampled set of normalized $m$ vectors $x_1, \dots, x_m$ has _all_ inner products no larger than $\varepsilon$ for any choice of $m \le \exp(n\varepsilon^2/4)$. So, choose $m = \exp(n\varepsilon^2/4)$ (or the largest integer no larger than this bound).

Since the resulting probability is nonzero, then there exists at least one such set of vectors for which the claim is true, which proves the desired result.

## Twitter discussion after posting
[Damek](https://x.com/damekdavis/status/1943103962221040004) pointed out that Terry Tao has [some notes](https://terrytao.wordpress.com/2013/07/18/a-cheap-version-of-the-kabatjanskii-levenstein-bound-for-almost-orthogonal-vectors/) in the case where we want the inner product to lie in a band between $-\varepsilon$ and $\varepsilon$; the bounds are essentially the same in this case for the same reasons as above. (Terry points out slightly better packings using some neat algebraic geometric tricks.)

[GaussianProcess](https://x.com/GaussianProcess/status/1943118408561860627) points out that there is a slightly better construction in certain regimes of $\varepsilon$ [using Reed–Solomon codes](https://arxiv.org/pdf/1206.5725). One (simple) version of this is to note that there is a near-equivalence between our vectors $v_i$ and codes over binary fields, where the inner product is "almost" the Hamming distance between two binary vectors. (The linked paper mentions but does not use this construction directly, but it, too, would suffice!) [0xWave](https://x.com/0xWave/status/1943100406055473602) and others also point out that this is linked to codes, and yes, similar constructions are used as both possibility and impossibility results including in the [Johnson bound and Plotkin bounds](https://cse.buffalo.edu/faculty/atri/courses/coding-theory/lectures/lect16.pdf), etc.

Both [Nick White and Nick Yoder](https://x.com/nickwh8te/status/1943112283598786743) point out that this might be (or is?) related to Johnson–Lindenstrauss, and, while I agree that it is _related_, I don't think these statements obviously map one-to-one. In particular, I see JL as a possibility result on the necessary number of dimensions needed to faithfully represent some number of vectors (that live in some higher dimensional space). This, on the other hand is a possibility result that there exist some number of vectors in a low dimensional space that are, in some sense, maximally faithfully representable. I would love if there is some mapping between the two statements, but this is not obvious to me! (Though they do result from the same "asymptotic"/high-dimensional behavior.)

---

[^1]: A proof of this is very easy by considering the nonnegative quantity $0 \le \left\|\sum_i x_i\right\|^2$.
