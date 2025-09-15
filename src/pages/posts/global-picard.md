---
layout: ../../layouts/MarkdownPostLayout.astro
title: A global Picard iteration
pubDate: 2025-07-25
---
[Lutz Lehmann has a lovely trick](https://math.stackexchange.com/questions/837792/an-application-of-banach-fixed-point-theorem-for-initial-value-problem) for making Picard iterations converge globally. (That is, without needing to "stitch together" solutions for different small intervals of time.)

Specifically, we wish to solve the ODE $$y'(t) = f(t, y(t))$$from $0 \le t \le T \le \infty$, where $f(t, \cdot)$ is Lipschitz with constant $L$ for all $t$ and $y \in \mathbf{R}^n$, say. Then, pick your favorite norm $\|\cdot\|$ over $\mathbf{R}^n$ and you can easily show that the Picard operator $\Phi$, defined
$$
\Phi(y)(t) = \int_0^t f(t, y(t))\,dt
$$
is contractive with respect to the (complete, of course) norm $\|\cdot\|_L$ defined
$$
\|y\|_L = \sup_{0 \le t \le T} e^{-Lt}\|y(t)\|.
$$
By Banach, this converges globally, and we're done. The link has it only for the linear case, but the extension is fairly obvious. 

The inspiration here seems to come from Gronwall's inequality when $f$ is uniformly Lipschitz in its second argument. This bounds the growth of $\|y\|$ (if a solution $y$ to the ODE exists) as roughly $\propto \exp(Lt)$ when $f(t, 0)$ is not too large over $t$.

It reminds me a lot of the Chernoff bound trick which is used to "strengthen" Markov's inequality to a much stronger one when the function is relatively nice. (Here, we are "strengthening" Banach by picking an appropriate norm over which the operation is contractive, since Banach works over any complete norm.)