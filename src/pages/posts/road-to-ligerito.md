---
layout: ../../layouts/MarkdownPostLayout.astro
title: The (sometimes rocky) road to a paper
pubDate: 2025-09-04
---
While I see a lot of people write _explaining_ results, not a lot of researchers write about the _journey to get to a result_, at least not from their introduction to a field.

For fun, I'll do this here for one of our latest papers, [Ligerito](https://eprint.iacr.org/2025/1187), coauthored with [Andrija Novakovic](https://x.com/AndrijaNovakov6) which describes a succinct proof protocol that is, roughly speaking, an interesting set of optimizations on the [Ligero polynomial commitment scheme](https://eprint.iacr.org/2022/1608), resulting in concretely very small proofs with a prover that is essentially as fast as the standard Ligero prover (which, as far as I know, is the fastest, though not smallest, practical polynomial commitment scheme).

If you are not familiar with succinct proofs, don't worry about it too much, though the additional context (probably) won't hurt. I'll trace the perspective starting from being "outside" of the subfield of succinct proofs all the way to writing Ligerito.

## Timeline (prehistory)
In 2021, [Alex Evans](https://x.com/alexhevans) and I start discussing the fact that most succinct proofs "feel like" they only use, roughly, some basic linear structure of vector spaces and error correcting codes. (Sometimes additional structure is used, but it's very case-by-case and can often be encoded using standard generalizations of linear algebra such as module theory.) We sit on this idea for a while, collecting little tidbits of things here and there and rewrite results people tell us about in purely linear-algebraic terms, as a bit. Roughly speaking, most proofs boil down to a number of facts such as: a list of vectors all lie in a vector space only when a uniformly random linear combination of these vectors lies in same the vector space (with high probability).

In 2022, we start looking more seriously into succinct proofs since progress seems to be accelerating substantially. The field is, for an outsider, very complicated-seeming and papers are very hard to read (50+ pages for many state of the art papers). We are sometimes told that the complexity is necessary since cryptography is hard, etc. It starts becoming quite clear that ~ all of the structure used in these succinct proofs is linear algebraic (or module-theoretic) in nature. Additionally, as far as we can tell, there is almost no Cryptography™ in much of the papers: Cryptography™ is mostly used as a simple black box via a number of basic transforms (Fiat–Shamir, Merkle commitments, discrete-log, and so on). Almost all of the difficulty is concentrated in basic manipulations of essentially linear algebraic objects and codes along with keeping track of probability bounds and errors.

At the end of 2022 and 2023, after seeing enough things, Alex and I begin to write [Succinct proofs and linear algebra](https://eprint.iacr.org/2023/1478). This paper is mostly just a crystallization of the following three things that we had been informally discussing up to this point:

1. Simple notation for keeping track of probabilities and errors that resembles standard mathematical implications in almost all ways that matter (we call it "probabilistic implications" but surely there's a better name)
2. A very basic and slow introduction to a linear-algebraic/error correcting code perspective of the toolkit used in succinct proofs. This includes natural generalizations of the concepts to general error correcting codes
3. A "natural" purely linear-algebraic generalization of the FRI protocol for certain types of codes

The paper "cleans up" a lot of tools and puts them under one simple framework. On the other hand it only derived minor additional results and some generalizations of the "standard toolkit" for succinct proofs. Some people (especially those from outside the field who follow our work) found it interesting as a pedagogical/simple introduction to these techniques, but presenting the results at some conferences often received questions of "is this too general" or "is this useful" and so on. (Sometimes, the questions were less questions and more, uhh, _extended_ comments, but whatever, so it goes.)

We put the paper and this line of research on the shelf for a bit: we were, at this moment, happy to at least have our own version of understanding succinct proofs, which "felt" like it could be useful/powerful but unclear exactly how. If anything, it is at least a useful little toolbox to have for later.

## Zero-overhead data availability (ZODA)
The first "new" result, which I have no idea how to derive other than from a linear-algebraic perspective, is [ZODA](https://eprint.iacr.org/2025/034).[^1] This result comes from a number of conversations with Alex and [Nico Mohnblatt](https://nmohnblatt.github.io) and starts taking shape early-mid 2024. The tl;dr, is that, as far as I know, this is the first "common" computation that is done in other contexts for which constructing a proof of correctness is _zero overhead_ (or, at least in a practical setting, essentially zero overhead).

In particular, this paper shows that the work and size difference between (a) computing a tensor encoding by itself and (b) computing a tensor encoding with an attached proof, are negligible.[^2]

We begin to wonder if the techniques used in this paper can yield smaller proof sizes in other domains, though mostly we focus on trying to reduce the ZODA proof size even further by applying a variety of techniques. In particular, we focus on ensuring that the ZODA proof and variations are always very efficiently computable on a modern laptop.

## The road to Ligerito
Now begins the _real_ part of the specific Ligerito paper. The previous was all context, but here's where the meat of the subject gets developed.

### Attempt #1: tensor -> local tests
During the development of ZODA, the first set of questions we had were the following: given a tensor encoding, is it possible to somehow use the tensor property to reduce the proof sizes?

In a certain sense, yes. Tensor encodings are a special case of a locally-decodable encoding. This allows us to construct "local" queries which sample entries as opposed to the "larger" queries of ZODA which sample complete rows and columns. Unfortunately, this comes at a cost. In particular, this sampling method breaks our ability to do distributed reconstruction/local recovery of a small amount of data, requiring nodes to decode the whole block in the worst case. (ZODA has the very useful property that any one row can be decoded from columns and vice versa, so nobody has to have the whole block to reconstruct a specific row.)

Additionally, while it may seem useful in theory, this construction results in costs that are almost as expensive as the original ZODA proof (in practice) with all of the additional downsides mentioned above, so we scrapped it. This began a tangential line of questioning: can we push the techniques here to create new succinct proof schemes?

Just as a baseline, the proof size for this attempt, viewed as a polynomial commitment scheme is, like standard Ligero,
$$
O\left(\sqrt{N}\right)
$$
where $N$ is the number of coefficients of the polynomial in question. The total proving time is, assuming Reed–Solomon codes,
$$
O(N \log N),
$$
and is $O(N)$ assuming linear codes (not counting the Merkle tree generation time).

### Attempt #2: we heard you like tensors
In November of 2024, while writing ZODA, but before pushing it out, multiple people (notably [Dev Ojha](https://x.com/valardragon) and [Mustafa Al-Bassam](https://x.com/musalbas), though I'm sure there were others) proposed the following question: is there a natural generalization of ZODA to not just a matrix, but, indeed, more general tensors?

The answer, like the previous, turned out to be yes.

In particular, ZODA does something that can be seen as the following reduction:
let $G$ and $G'$ be codes, with randomness $r$ and $r'$, then ZODA reduces verifying that a tensor encoding is good to verifying that a random linear combination of the rows and a random linear combination of the columns are good. Slightly more "pictorially" we reduce
$$
G\tilde X G'^T \quad \to\quad G\tilde Xr, \quad G'\tilde X^Tr'.
$$
and check the result at a few places.

We can view the tensor product on the left hand side as a linear operation on the data matrix, $\tilde X$, viewed as a vector, which we will write as simply $x$. This operation can be written
$$
(G' \otimes G)x
$$
where $\otimes$ is the Kronecker product of $G$ and $G'$. The ZODA test then, roughly speaking, "pulls out the last matrix $G'$ and replaces it with randomness":
$$
(G' \otimes G)x \quad \to \quad (r'^T \otimes G)x \quad \to \quad (r' \otimes r)^Tx
$$
and checks the claimed results of each step at a few points.

The natural generalization here is, given $\ell$ such code matrices $G_1, \dots, G_\ell$, we can construct the Kronecker product of these $\ell$ matrices
$$
(G_\ell \otimes \dots \otimes G_1) x,
$$
and then perform the same "unwrapping" procedure at each step, replacing $G_i$ with randomness $r_i$ and checking consistency:
$$
(G_\ell \otimes \dots \otimes G_1) x \quad \to \quad (r_\ell^T \otimes \dots \otimes G_1) x \quad \to \quad \dots \quad \to (r_\ell \otimes \dots \otimes r_1)^T x.
$$
Each of these tests is just a standard Ligero proximity check (technically, one with [logarithmic randomness](https://eprint.iacr.org/2023/630)) so the result that this does the correct thing (soundness) follows essentially immediately.

The only question remaining is, if we abandon the need for reconstruction, what are the optimal dimensions and therefore minimal proof size that this construction enables?

The resulting optimization problem can be relaxed to a convex program, which can be shown to have optimal value bounded from below by
$$
\Omega\left(\exp\left(\sqrt{\log(N)}\right)\right),
$$
where $N$ is the number of entries (coefficients) of $x$. (This value is achievable with a simple rounding scheme.)

Anyways, that's pretty good! Note that $\exp(\sqrt{\log (N)})$ is smaller than any positive power of $N$. Unfortunately, it is also larger than any power of $\log(N)$, so it is subpolynomial (size $< N^{\varepsilon}$ for any $\varepsilon > 0$) but not poly-logarithmic (size $> \log^c(N)$ for all $c > 0$) in proof size.

Additionally, also unfortunately, the total proof time for this proof size is, using Reed–Solomon codes, $N\log^{3/2}(N)$ which in practice is probably ok, but definitely larger than we would like.

As a side note, after Andrija and I discovered this result, Nico pointed out that it was essentially a concretization of [Bootle, Chiesa, and Groth '20](https://eprint.iacr.org/2020/1426) via a Merkle commitment, rather than their "line queries" which are not obviously concretizable using standard schemes. The main problem here is that, as the number of codes $\ell$ grows, the amount of queries necessary for each round increases linearly, which precludes smaller proofs.

### Attempt #3: wait, it's all tensorizable?
In January of 2025, we note that attempt #2 gives the following observation.

The main property we made use of in constructing the previous "tests" was that we could test proximity to the code $G_\ell \otimes \dots \otimes G_1$. We do this by taking a random linear combination of columns of the provided matrix and then checking consistency. But the only thing we really used here is the property that these codes are tensor products of other codes, each of which is testable.

One very important fact about Reed–Solomon codes is that, for a generator matrix $G$, each row $g_i^T$ can be written as a tensor product of the form $(1, t_1) \otimes \dots \otimes (1, t_n)$ where $t_1, \dots, t_n$ are some numbers that depend on the row index $i$. Any code $G$ whose rows can be written in this way we will call _tensorizable_.

An obvious and immediate consequence is that, viewing the Ligero PCS/ZODA as a [general matrix-vector protocol](https://eprint.iacr.org/2024/1399), we can succinctly compute not just matrix-vector products, but, indeed, _any tensorizable product_. (The observation is very simple, if some vector $v$ is _tensorizable_ in that $v = w_1 \otimes w_2$ for some vectors $w_1$ and $w_2$, then $v^T x = w_1^T\mathrm{Mat}(x)w_2$, where $\mathrm{Mat}(x)$ is a matrix "reshaping" of $x$, column major, of the appropriate dimensions. The test already gives you $w_1^T\mathrm{Mat}(x)$ "for free" which is very useful, especially if $\mathrm{Mat}(x)$ is a very tall and skinny matrix.)

Because this is true, we can then have the prover "help" the verifier with the proximity test spot checks at indices $S$ (_i.e._, compute tensorizable products using the $S$ rows of $G$):
$$
(Xr)_S = G_S y_r,
$$
by using the Ligero proximity test itself as a matrix-vector product protocol. In other words, we can partially recurse the Ligero proximity test into itself, due to the matrix-vector product property, for tensorizable products. This, in turn, allows the verifier to not have to receive a single large vector ($y_r = \tilde X r$) but instead receive a bunch of "small" vectors (the results of the partial inner product computation $w_2^T\mathrm{Mat}(x)$ for each row of $G$ that it queries). We can carefully control the sizes of $\mathrm{Mat}(x)$—which, in turn, controls the sizes of these queries—to ensure the proof remains small.

Optimizing all the dimensions (again via a magical little convex optimization problem) shows that the best one can hope to do is
$$
\Omega(\log^2(N))
$$
in proof size. Again, this is achievable by a simple rounding scheme.

Note that this is really quite good already! (In fact, for all practical parameters, this already beats the golden standard, [FRI](https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf), in the unique decoding regime by a good margin.) It also has an encoding proof time of $O(N \log(N))$ for Reed–Solomon codes, which is also great.

Unfortunately, it was very close, but not quite state-of-the-art in the unique decoding regime. The reason for this is that there is no obvious way of "batching" the queries that the verifier makes, which means that every partial inner product must be sent over the wire. On the other hand, it was already state-of-the-art in proving-time/proof-size tradeoff, which is neat.

As far as I know, this result is new and we haven't really written it up. It might make for a nice note.

Anyways, while cool, we wanted more!

### Attempt #4 (and success): Sumchecks are inner products
The final key to the puzzle was a very nice flash of insight from Andrija that came in March of 2025: the checks the verifier performs are just a bunch of inner products with some (potentially unknown) vector $y_r$. (In particular, the verifier samples $S$ rows of $G$, like the previous, and needs to compute $G_S y_r$, which, in Ligerito, it delegates to the prover.) [The sumcheck protocol](https://people.cs.georgetown.edu/jthaler/sumcheck.pdf) allows us to perform _any_ inner products (not just tensorizable ones) and it is easy to merge this protocol with the proximity tests we are already doing. Additionally, unlike the previous partial products idea, Sumcheck queries _are_ batchable, such that only one proof has to be sent over the wire, as opposed to one proof for each query. This gives both smaller proof sizes, but also the ability to use any codes $G$ that we want, not just Reed–Solomon codes.

The details of the protocol are a little annoying (as this batching has to be done in each step and there's some partial evaluation nonsense that has to happen as a result of this) but the details are in the [Ligerito paper](https://eprint.iacr.org/2025/1187) which is only 14 pages. I encourage you to read it if you're interested!

It is not hard to show that the optimal proof size for given dimensions is at least as large as
$$
\Omega\left(\frac{\log^2(N)}{\log \log(N)}\right).
$$
As before, this too is achievable via a simple rounding scheme. Additionally, this was state-of-the-art, to our knowledge.

In concrete proof sizes Ligerito was also smaller than the best-known scheme, [WHIR](https://eprint.iacr.org/2024/1586), in the unique decoding regime for similar parameters, while also being around 10x or so faster than the benchmarks in the paper using our Julia implementation. This implementation took a bit of time, since we had to [write a bunch of hardware-optimized code and such for finite fields](https://github.com/bcc-research/CryptoUtilities.jl), none of which existed in the Julia libraries. It was a nice sidequest since we needed some good concrete timings for ZODA anyways, which we didn't have in the pre-print.

## Convergent evolution?
We sent a final draft of the Ligerito paper to [Remco Bloemen](https://x.com/recmo) and [Giacomo Fenzi](https://gfenzi.io) who pointed out that some of the encodings performed in the WHIR paper could be removed/shortened, making it look more like the protocol described in the Ligerito paper. This observation was [added to one of the WHIR codebases](https://github.com/tcoratger/whir-p3/pull/7/files) a week or so before we sent the final draft. Further optimizations of WHIR's codebase, after the Ligerito paper was released, removed some additional requirements that WHIR had. This essentially makes the "optimized" WHIR that exists in code (now somewhat different than is in the WHIR paper) and the Ligerito protocol as it is in the Ligerito paper, very similar. (WHIR, of course, works specifically in the special case of Reed–Solomon and uses the [DEEP-FRI quotienting trick](https://arxiv.org/abs/1903.12243) to work outside of the unique decoding regime. This reduces proof sizes substantially, so long as the logarithmic randomness results also hold outside of the unique decoding regime. Ligerito is explicitly code-agnostic.) Perhaps the combined protocol is WHIRgerito or Ligerito-WHIR or something :)

Anyways, it's interesting to point out because, while we were aware of WHIR as a general protocol that was state-of-the-art, we didn't know much about it nor the work that was going on under the hood and implementation, outside of the paper. Yet, clearly, something is in the water during the development of protocols and papers, which sometimes leads to convergent evolution!

## Conclusion
Anyways, this is the journey of a paper and how seemingly-unrelated things play out in weird ways.

It's also quite emblematic of our philosophy of learning new fields, which has become a bit of our "standard playbook." Specifically it goes something like:

1. We become interested in a field
2. Find smart people and ask a bunch of them a lot of stupid questions
3. Try to read the papers
4. ????
5. Rewrite some of the techniques and papers in the cleanest possible abstraction
6. Use this abstraction to explain a lot of basic results
7. By this point, we have a totally "weird" understanding of the field that is generally quite different from others (even if we all know the same underlying "facts")
8. Write the simplest, stupidest, cleanest possible paper about it
9. Let it all sit and mingle for a while
10. Someone brings up a random problem in/near/around the field
11. "Wait, isn't that just XXX or YYY from this perspective"
12. Write a paper about _that_
13. Goto 10 until diminishing returns hit

And that's... kind of all there is to it.

---

After reading this post, Alex said

> To the readers of these papers: I hope you have as much fun reading them as we've had writing them.

---
[^1]: At least, no idea how it could be derived de-novo without linear algebra. It has a number of "polynomial" interpretations in the special case of Reed–Solomon codes, but these are only obvious as special cases of the general linear-algebraic perspective, which is very simple.

[^2]: In fact, the _size_ difference is actually exactly zero, the computation is negligible. A more practical variation (the ZODA tensor variation) has negligible, but nonzero, size and computation differences.
