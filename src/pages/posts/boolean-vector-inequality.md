---
layout: ../../layouts/MarkdownPostLayout.astro
title: A lovely counting inequality
pubDate: 2025-08-25
---
I stumbled upon this very nice inequality bounding the number of Boolean vectors of length $n$ which have no more than $\rho n$ nonzero entries. (This has some applications to [data availability sampling](https://arxiv.org/abs/1809.09044), and, in particular to [ZODA](https://angeris.github.io/papers/da-construction.pdf), which I might write about soon.)

Let $n$ be any number and set $0 < \rho \le 1/2$. Assume, for simplicity, that $\rho n$ is an integer (though the general case is obvious with some floors). Then, the following is true:
$$
\sum_{i=0}^{\rho n} \binom{n}{i} \le 2^{nh_2(\rho)},
$$
where $h_2$ is the binary entropy function, defined
$$
h_2(\rho) = -(\rho \log_2(\rho) + (1-\rho)\log_2(1-\rho)).
$$
An alternative form is
$$
\sum_{i=0}^{\rho n} \binom{n}{i} \le \exp(nh(\rho)),
$$
where $h$ is the natural entropy function (_i.e._, $h_2$ except replacing the $\log_2$ with the natural log.)

The only proof I knew of this was via an argument using the moment generating function and a Chernoff bound. On the other hand, I was [reading chapter 12 of Cover's information theory](https://www.cs.upc.edu/~jgarriga/papers/TypesTheory.pdf) and discovered a more elementary proof, which can be seen as a relatively straightforward extension/strengthening of Cover's version in the book.
## Proof
Note that (via Binomial expansion)
$$
1 = (\rho + (1-\rho))^{n} = \sum_{i=0}^{n} \binom{n}{i}\rho^i(1-\rho)^{n-i}.
$$
Certainly, clipping the tail of the right hand side to $\rho n$ means that
$$
\sum_{i=0}^{\rho n} \binom{n}{i}\rho^i(1-\rho)^{n-i} \le 1.
$$
Now, note that, since $\rho \le 1/2$ we have that $\rho^{\rho n}(1-\rho)^{(1-\rho) n} \le \rho^i(1-\rho)^{n-i}$ for all $i \le \rho n$ since $\rho \le 1-\rho$. From here, the punchline is obvious, but worth writing anyways:
$$
\rho^{\rho n}(1-\rho)^{(1-\rho) n} \sum_{i=0}^{\rho n} \binom{n}{i} \le \sum_{i=0}^{\rho n} \binom{n}{i}\rho^i(1-\rho)^{n-i} \le 1.
$$
Moving the constant $\rho^{\rho n}(1-\rho)^{(1-\rho) n}$ to the right hand side gives the result that
$$
\sum_{i=0}^{\rho n} \binom{n}{i} \le \rho^{-\rho n}(1-\rho)^{-(1-\rho) n} = 2^{-n(\rho \log_2(\rho) + (1-\rho)\log_2(1-\rho))} = 2^{n h_2(\rho)},
$$
as required.