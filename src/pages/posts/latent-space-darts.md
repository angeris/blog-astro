---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Throwing darts in latent space'
pubDate: 2025-09-29
---

For this post, I would recommend having at least some passing familiarity with [sparse autoencoders](https://transformer-circuits.pub/2023/monosemantic-features), though it's not necessary to have a full one. I'll explain the high level idea here.

The tl;dr is that, like I talked a bit about in my [previous post](/posts/exponential-vectors/), we were somewhat skeptical of sparse autoencoders as actually doing anything explicitly meaningful over some much simpler techniques. Other people have similar skepticism, stated in different ways.

For example, [this paper](https://arxiv.org/pdf/2502.16681) finds that sparse autoencoders in general do not beat some (basic, but not completely trivial) baselines in a number of tasks you would expect SAEs would be good at. 

Possibly much more topically, [this paper](https://arxiv.org/abs/2501.17727) which shows that sparse autoencoders can "interpret" randomly initialized transformer models very similarly to trained transformer models. This (roughly) shows that the weights appear almost irrelevant in interpreting features, though there's a second potential possibility, which is more similar to what I will talk about below.

Either way, structurally, I've found sparse autoencoders (SAEs, from here on out) to feel less directly interesting and more "magical" both in _how they are explained_ and _why they work_. I will preface this post heavily with the fact that I have no current major data to back any of this up, though some small numerical experiments seem to point roughly, but not fully, in the right direction. (More specifically, observations were informed by some early data work that [Henry de Valence](https://x.com/hdevalence) and I did trying to understand SAEs, though this post expresses my opinions on the topic, which Henry need not share! Huge thanks to him for bearing with me and running some of these experiments.)

## Random vectors
First off, it'll be useful to explain some properties of random vectors. We will assume that we have a list of $m$ vectors $x_1, \dots, x_m \in \mathbf{R}^n$ which are constructed in the following way. For each index $i$, let $z_i$ be a vector with entries drawn, uniformly, from $\pm 1$ and define $x_i = z_i / \sqrt{n}$. In other words, $x_i$ is the normalized $z_i$ vector. For now, assume $m \gg n$ and $n$ here will be a constant. Then, [the following things are true](/posts/exponential-vectors/), even when $m$ is exponentially(!) large in $n$.

1. With high probability, $x_i^Tx_j$ is small for all $i \ne j$
2. For any fixed vector $y \in \mathbf{R}^n$, with high probability we have that, for each $i$, $x_i^T y > \tau \|y\|_2/\sqrt{n}$, where $\tau > 0$ is some fixed parameter. In particular, with _extremely high probability_ there is at least one $i$ for which this is true for $m$ large enough.[^2]
3. In fact, for $y$ where the entries "don't differ too much" from each other, the distribution of $x_i^Ty$ is nearly Gaussian, so very few of the vectors $x_i^Ty$ will be close to the maximum value. Almost all of them will actually cluster around zero with standard deviation $\sim \|y\|_2/\sqrt{n}$.[^3]

So, in a very general sense (a) the $x_i$ form a nearly-orthogonal, incredibly "over-complete" basis for $\mathbf{R}^n$ and (b) for any fixed vector $y$, there is sure to be _some_ $i$ which is nearly-collinear to $y$. That is, there is some $i$ such that $x_i$ and $y$ point in "almost" the same direction.

It's worth doing some numerical experiments here, just to see this. I personally recommend something like $n = 1024$ and $m = 32n = 32768$ or similar, but up to you. (In fact, I'd recommend messing around with $m$, making it range from $n$ to $32m$ and then compare the maximum absolute inner product.[^1])

## Random directions in latent space
Ok, let's say we do have some LLM trained on a bunch of data. Intermediate layer activations, also known as "residual streams", of the LLM essentially act a function which maps some complicated space of text into an $n$ dimensional representation of this text. (I'll call this $n$ dimensional output space the "latent space" as I guess that's kind of old-school-cool now.) It stands to reason that there are _some_ directions $y$ which are meaningful in that they map to concepts that are "interpretable".

Now, here's the rub.

Of course, when you have _exponentially many vectors_ $\{x_i\}$ at least one of those vectors will have very high inner product with such a $y$! Indeed, for any reasonable numbers of $y$, there will exist a (small, but nonzero) number of vectors $x_i$ with large inner product $x_i^T y$.

Here's a unicode plot for a simple numerical example I ran in Julia, where `y` is a vector with normal mean 0, variance 1 entries:
```
julia> histogram(X' * y)
                ┌                                        ┐ 
   [-4.5, -4.0) ┤▏ 4                                       
   [-4.0, -3.5) ┤▏ 8                                       
   [-3.5, -3.0) ┤▍ 46                                      
   [-3.0, -2.5) ┤█▎ 213                                    
   [-2.5, -2.0) ┤███▍ 623                                  
   [-2.0, -1.5) ┤████████▌ 1 545                           
   [-1.5, -1.0) ┤█████████████████▎ 3 157                  
   [-1.0, -0.5) ┤██████████████████████████▌ 4 858         
   [-0.5,  0.0) ┤████████████████████████████████▊ 6 026   
   [ 0.0,  0.5) ┤█████████████████████████████████  6 043  
   [ 0.5,  1.0) ┤██████████████████████████▎ 4 796         
   [ 1.0,  1.5) ┤████████████████▎ 2 960                   
   [ 1.5,  2.0) ┤████████▊ 1 606                           
   [ 2.0,  2.5) ┤███▍ 621                                  
   [ 2.5,  3.0) ┤█▎ 199                                    
   [ 3.0,  3.5) ┤▍ 48                                      
   [ 3.5,  4.0) ┤▏ 14                                      
   [ 4.0,  4.5) ┤▏ 1                                       
                └                                        ┘ 
                                 Frequency   
```
This nicely illustrates points 2 and 3 above.

## Interpretability?
Ok, so we now can make the following (weak) claim.

Given some text input, which has some interesting features (for example, a text about dogs) there will essentially always exist some direction $y$ which is highly correlated with whatever is in the latent space (in our example, probably with respect to "dogs"). From the previous discussion, there will be some $x_i$ (or a very small number of such $x_i$) which have large inner products with this $y$. In turn, this makes _those_ $x_i$ themselves interpretable.

But any meaningful text will have some direction $y$ in latent space, which in turn will be nearly collinear with some (very small!) number of vectors $x_i$.

But then... why do we need to train SAEs at all if this is the case?

Indeed, here's a simple "sparse autoencoder": take the top $k$ largest inner products $x_i^Ty$ with latent vector $i$, and zero the rest out. We will then say a "learned" feature $i$ is active if $x_i^Ty$ is in the top $k$ values, over all possible $i$. This forms the "activations" for the sparse autoencoder. The output mapping from these activations can really be anything, but one simple example is learning a least-squares approximation to the output given some input corpus.

In fact, I'm going to go slightly further and make the following (more annoying, but also harder to prove) claim that _almost all directions in latent space are probably meaningful_. In fact, there's probably enough of these meaningful directions that many, if not most, of the $x_i$ will themselves be interpretable. (This is much stronger than the previous claim that certainly there will be some $x_i$ that are interpretable.)

## Too many directions!
The problem, at least for the weak claim, comes down to this.

By virtue of our choice of random directions, we are putting out an exponential number of hypotheses $m$ about "meaningful" directions (the $x_i$) that are all ~ uncorrelated (by item 1 above). On the other hand, these hypotheses "live" in a much smaller number of dimensions $n \ll m$. We should be _extremely suspicious_ whenever we do this, since essentially _any_ direction in the latent space that is "meaningful" will be picked up by the $x_i$.

It is, in turn, not clear that doing additional training of the SAEs is doing what we expect, other than roughly "fitting the corpus to reasonable dimensions" but it's not even clear that this is necessary!

Surely someone has some basic data on this (even if just as the initialization for some SAE training run?) so I'd be curious to see if that confirms the claim. My suspicion is that the features from these random $x_i$ won't be _quite as interpretable_ as a "trained" SAE, but my guess is it's probably not as far off as one would expect. This seems at least slightly suggested by the second paper linked above, but, unfortunately, I guess we can't know until we try!

---

[^1]: A simple Julia one-liner for point 1 is `X = rand([-1,1], n, m) ./ sqrt(n); Z = X' * X; maximum(abs.(Z - I))`. Make sure to import `LinearAlgebra` to get `I` to work. Don't forget to also define `m` and `n`! Using the `n` and `m` given here takes around 10 or so seconds to run on my laptop.

[^2]: For the nerds: to see this, use Payley–Zigmund and the bound $\|y\|_4^4 \le \|y\|_2^4$.

[^3]: See, e.g., [here](https://en.wikipedia.org/wiki/Berry–Esseen_theorem#Non-uniform_bounds).
