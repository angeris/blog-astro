---
layout: ../../layouts/MarkdownPostLayout.astro
title: Linear algebra over field extensions
pubDate: 2025-08-21
---
A common occurrence in succinct proofs is the need to work in two different finite fields. In general, we work mostly over a _base field_ $\mathbf{F}$ (I will mostly call this the "little field") and over some _extension field_ $\mathbf{F}'$ (ditto "big field") which is a field that is also a superset of the base field $\mathbf{F}' \supseteq \mathbf{F}$. (Technically, the extension $\mathbf{F}'$ need not be an _actual_ superset of $\mathbf{F}$; rather, it needs to have a subset that is equivalent/isomorphic to $\mathbf{F}$, we will make use of this later.)

Most of the operations in a given succinct proof that uses codes (_e.g._, in [Ligero](https://eprint.iacr.org/2022/1608)/[ZODA](https://eprint.iacr.org/2025/034)/[Ligerito](https://eprint.iacr.org/2025/1187)) will be done over the base field  and a few (mostly involving random linear combinations) will be over the "big field" . As we will see, most of these operations will take the form of something like the following: let $G \in \mathbf{F}^{m \times n}$ be a matrix in the "little field" and $x \in \mathbf{F}'^n$ a vector over the "big field", then we want to compute $Gx \in \mathbf{F}'^{m}$.

The tl;dr will be that it's all linear algebra in the end and we can simply perform $Gy_i$ for some $y_1, \dots, y_k \in \mathbf{F}^n$ in the little field and pack the elements back together to get the result $Gx$. More specifically, since $\mathbf{F}'$ is a field extension, then $\mathbf{F}' \simeq \mathbf{F}^k$. Set $x \leftrightarrow (y_1, \dots, y_k)$ where $y_1, \dots, y_k \in \mathbf{F}^n$, then $Gx \leftrightarrow (Gy_1, \dots, Gy_k)$.

## First attempt
One way of dealing with this is to first define the field extension $\mathbf{F}'$ and then construct a subset $\mathbf{F} \subseteq \mathbf{F}'$ of this field $\mathbf{F}'$ that (a) contains $\{0,1\}$ and (b) is closed under multiplication and addition—in other words, $\mathbf{F}$ itself is a field. Since the little field is literally a subset of the big field $\mathbf{F} \subseteq \mathbf{F}'$ in the proper sense of the word "subset", the operations can easily be performed since any subfield operation in $\mathbf{F}$ is just the same as operating over $\mathbf{F}'$.

This is slightly annoying for two reasons. Number one is that $\mathbf{F}'$ is often "large" in the sense that representing an element of the big field $\alpha \in \mathbf{F}'$ often takes far more bits than representing an element of the little field $\beta \in \mathbf{F}$. A concrete example from ZODA, _e.g._, is that $\mathbf{F}$ has $2^{16}$ elements and so an element can be represented by a 16-bit integer while $\mathbf{F}'$ has $2^{128}$ elements and so requires a 128-bit integer to represent. While asymptotically this doesn't matter, in practice it's very important: in a standard ARM register, which is 64 bits, we can fit 4 "little field" elements and only half of a "big field" element, which kills performance if we represent every "little field" element using the "big field" representation.

### Slight improvement
One obvious version of this is to "compress" the representation of $\mathbf{F}$: simply represent elements in the little field $\mathbf{F}$ using 16-bit integers and then "upcast" them on the fly to their 128-bit representation in $\mathbf{F}'$ during computation.

This is fine and, indeed, is what we do (for now) implicitly in [`CryptoUtilities.jl`](https://github.com/bcc-research/CryptoUtilities.jl/blob/main/BinaryFields/src/binaryfield.jl#L157) but it's a little annoying: the conversion actually takes a nontrivial amount of operations since the mapping from the "compressed" representation of $\mathbf{F}$ to the "big field" representation in  requires 16 "big field" additions.

(There's also some secondary annoyance since we would like the representations to be "consistent" in that multiplication in the "compressed" representation should correspond to multiplication in the "big field" representation, but that's a different story for a later day. See, e.g., [here](https://github.com/bcc-research/CryptoUtilities.jl/blob/main/BinaryFields/src/binaryfield.jl#L135) for how we deal with this.)

## General construction
Another way to construct this pair of fields $\mathbf{F}$ and $\mathbf{F}'$ is in "reverse". In particular, we can _define_ $\mathbf{F}'$ as a degree $k$ extension of $\mathbf{F}$ by setting
$$
\mathbf{F}' = \mathbf{F}[X]/(f),
$$
where $f$ is an irreducible polynomial over $\mathbf{F}$ of degree $k$. (Funnily enough, $f$ itself won't be used anywhere else in this construction, it just matters that one exists, which we know a-priori.)

This means that an element of the big field $\mathbf{F}'$ and a $k$-vector over the little field $\mathbf{F}$ are equivalent in that one can be mapped to the other and vice versa. That is,
$$
\mathbf{F}' \simeq \mathbf{F}^k
$$
in the obvious way: $x \in \mathbf{F}'$ is a polynomial of degree $<k$, so interpret the  coefficients as a $k$-vector, or, conversely, the $k$-vector can be interpreted as a polynomial of degree less than $k$, which gives the bijective mapping. Note that $0 \in \mathbf{F}$ is the zero polynomial in $\mathbf{F}'$, or, equivalently, the zero vector in $\mathbf{F}^k$. (Exercise: what should the 1 element be in $\mathbf{F}'$ and therefore in $\mathbf{F}^k$ using this map?) Most importantly, note that this map is linear in the little field $\mathbf{F}$ and preserves that structure.

In general, given an element $\beta \in \mathbf{F}'$ we will write its "tilde" version $\tilde \beta \in \mathbf{F}^k$ to be its version as a $k$-vector.

### Breaking it down
The first question to ask then is, given two elements, $\alpha \in \mathbf{F}$ in the little field and $\beta \in \mathbf{F}'$ in the big field, what is $\alpha \beta$? Since $\beta \in \mathbf{F}'$ then set $\tilde \beta \in \mathbf{F}^k$ to be the corresponding $k$-vector. It is not hard to show that $\widetilde{\alpha\beta} = \alpha \tilde \beta$; in other words, multiplication of a big field element by a little field element is just scalar multiplication of the underlying vector representation of the big field element.

Now, we can ask the next question: given a vector in the little field $x \in \mathbf{F}^n$ and a scalar in the big field $\beta \in \mathbf{F}'$, what is the (big field) $\mathbf{F}'^n$ vector $\beta x$? Well, from before, note that $\tilde\beta \in \mathbf{F}^k$, and we know the $i$th entry of $\beta x$ should be equal to $\beta x_i$, which we know from before. This, in turn, is equivalent in the vector representation of the big field to $x_i \tilde \beta$, which is a $k$-vector over $\mathbf{F}$. Finally, define the _matrix representation_ of a vector $y \in \mathbf{F}'^n$ in the big field to be the matrix $\tilde y \in \mathbf{F}^{n \times k}$ over the small field where the $i$th row of $\tilde y$ is the $k$-vector representation of the $i$th element $\widetilde{(y_i)} \in \mathbf{F}^k$. A little work shows that $\beta x$ is then, in this matrix representation:
$$
\widetilde{\beta x} = x\tilde \beta^T.
$$

Finally, we can put all of this together for the general case. Given a matrix $G \in \mathbf{F}^{m \times n}$ in the little field and a vector $x \in \mathbf{F}'^n$ in the big field, we'd like to compute $Gx \in \mathbf{F}'^m$ (which is a vector in the big field, representable as an $m\times k$ matrix over the little field). Of course, we know that, by definition
$$
Gx = \sum_{i=1}^n x_i g_i,
$$
where $g_i \in \mathbf{F}^m$ is the $i$th column of $G$ (in the little field) and $x_i$ is a scalar (in the big field). We can use our previous scalar-vector product representation to note that
$$
\widetilde{x_ig_i} = g_i \widetilde{(x_i)}^T
$$
and add these together to get
$$
\widetilde{Gx} = \sum_{i=1}^n g_i\widetilde{(x_i)}^T = G\tilde x.
$$
In other words, applying any linear operation whose elements are always in the little field to a vector in the big field is equivalent to applying the linear operation to each column of the matrix representation of the big-field vector.

This means that, if we have an efficient procedure to compute $Gz$ for any vector $z$ in the little field, we can simply use the efficient procedure as a black box to compute $Gx$ when $x$ is in the big field by applying it to each column of the matrix representation of the big-field vector $x$.