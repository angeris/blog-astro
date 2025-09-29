---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Hamilton–Jacobi–Bellman is just linear duality'
pubDate: 2025-09-15
---

This is, I suspect, a very well known result but it's worth writing anyways. (It is certainly a "folk" theorem in the sense that I am familiar with in that, _e.g._, Stephen Boyd has mentioned something similar in spirit in at least one lecture I've attended.) This blogpost was inspired by [Matt Lorig's latest note on the Hamilton–Jacobi–Bellman equation](https://arxiv.org/abs/2509.01744), which is a fun little read if you're interested in the stochastic case!

Ok, let's get to it. 

## Set up

In our scenario, we have some system evolving through time $t = 1, \dots, T$. At each time $t$, the system is in one of $m$ states, and, after observing this state, we can then take one of $n$ possible actions.[^1] In other words, there are $mn$ possible _state-action_ pairs. We will say a state-action pair is _executed_ if the system is in the state represented by the state-action pair and we perform the action represented by the same pair.

It will be very convenient to define the "sum-over-actions" matrix $S \in \mathbf{R}^{m \times mn}$, defined as, for $i=1, \dots, m$ and $j=1, \dots, mn$,
$$
S_{ij} = \begin{cases}
1 & \text{state $i$ is part of state-action pair $j$}\\
0 & \text{otherwise}.
\end{cases}
$$
So, if, for example, we have a vector $y \in \mathbf{R}^{mn}$ over the $mn$ state-action pairs, then $Sy$ is an $m$-vector whose $i$th entry denotes the sum over all actions for that particular state $i$. In other words, if we think of $y$ as a probability distribution over state-action pairs, the matrix $S$ marginalizes out the actions, leaving the (marginal) distribution over states.

For each state-action pair and time $t=1, \dots, T-1$, we have an associated _transition matrix_ $M_t \in \mathbf{R}^{m \times mn}$. This matrix will map a state-action pair (one of the $mn$ possible ones) to a probability distribution over the $m$ states of the system. In particular, if the system is in some state and takes some action, such that the state-action pair is represented by the index $j$ with $1 \le j \le mn$, then the $j$th column of $M_t$ denotes the resulting probability distribution over states of the system after the state-action pair $j$ has been executed. (As an example, if the system has deterministic dynamics, then each column of $M_t$ is a single unit basis vector. The one nonzero entry of this column denotes the state that the system lands in after executing the state-action pair $j$.)

Finally, at each time step $t=1, \dots, T$, we will assign a _loss_ $\ell_t \in \mathbf{R}^{mn}$ at time $t$. The $j$th entry of this vector $(\ell_t)_j$ denotes the loss we eat from executing the state-action pair $j=1, \dots, mn$.

The natural question is: ok, we have this system that we can control, how do we choose our actions in order to minimize the total loss across all time steps? This is, of course, a _control problem_ and we specify it next.

## Control problem
From before, we would like to control the system such that the total loss is minimized, so let's write that all as a simple optimization problem.

Assuming the system's initial state is picked from some distribution $p_1 \in \mathbf{R}^{m}$, This is just a linear programming problem:
$$
\begin{aligned}
& \text{minimize} && \sum_{t=1}^T x_t^T\ell_t\\
& \text{subject to} && Sx_{t+1} = M_t x_t, \quad t = 1, \dots, T-1\\
&&& Sx_1 = p_1, \quad x_t \ge 0, \quad t = 1, \dots, T.
\end{aligned}
$$
Here, the variables are the distributions $x_t \in \mathbf{R}^{mn}$ over the state-action pairs for $t=1, \dots, T$. This problem essentially writing down everything we just mentioned in the previous paragraphs, but let's go through it step-by-step

First, the objective. At each time step $t=1, \dots, T$, the expected probability that we execute state-action pair $j$ is given by $(x_t)_j$. The loss incurred from doing that is $(\ell_t)_j$, so take the inner product and sum that over all possible times $t=1, \dots, T$ to get the loss.

Let's start with the last two constraints. Obviously since $x_t$ is a probability distribution, it should be nonnegative, which is just being enforced here for all times $t$. On the other hand, we know that the initial state of the system (no matter what actions we take) will have probability distribution $p_1$, by assumption. So, we must have that $Sx_1 = p_1$, as required.

Finally, the first constraint is simply encoding the dynamics we talked about in the previous section. The matrix $M_t$ maps the state-action pairs at time $t$ to the distribution over states at time $t+1$. But the distribution over states at time $t+1$ is, by definition, the sum over all possible actions, for each state, which is simply $Sx_t$. We enforce this for each time $t = 1$ all the way to $t = T-1$ (since the final state is $x_T$.)

We can solve this problem directly, of course, using just a standard linear programming solver and be done with life. But, like many things, the dual problem often has a lovely interpretation. (And, in some important cases, as in this one, it will be much easier to solve!)

As a side comment, note that we do not need the constraint that $\mathbf{1}^T x_t = 1$ (_i.e._, that $x_t$ is normalized) since this is implied by the fact that $Sx_1 = p_1$, which means that its marginal is normalized by definition. (The rest of the time steps $t=2, \dots, T$ are normalized by definition of $M_t$.)

## Dual problem
To solve the dual problem, let's introduce the following dual variables: $\nu_1$ will correspond to the second-to-last constraint, $Sx_1 = p_1$, while $\nu_{t+1}$ will correspond to the $t$th constraint $Sx_{t+1} = M_t x_t$. (The constraint that $x_t \ge 0$ will simply relax some equalities to inequalities, so I won't include it here, but you can introduce additional multipliers for this, if it helps the bookkeeping.)

The resulting Lagrangian is, for $x_t \ge 0$,
$$
L(x, \nu) = \sum_{t=1}^T \ell_t^Tx_t + \sum_{t=1}^{T-1} \nu_{t+1}^T(M_t x_t - Sx_{t+1}) + \nu_1^T(p_1 - Sx_1).
$$
Rearranging gives
$$
L(x, \nu) = \sum_{t=1}^{T-1} (\ell_t + M_t^T\nu_{t+1} - S^T\nu_{t})^Tx_t + (\ell_T - S^T\nu_T)^T x_T + p_1^T\nu_1.
$$
Finally, minimizing over $x_t \ge 0$ gives the dual optimization problem
$$
\begin{aligned}
& \text{maximize} && p_1^T\nu_1\\
& \text{subject to} && S^T\nu_t \le \ell_t + M_t^T\nu_{t+1}, \quad t = 1,\dots, T - 1\\
&&& S^T\nu_T \le \ell_T.
\end{aligned}
$$
If you're familiar with the HJB equation, well, the second constraint is pretty much it. If not, don't worry, we'll go through it in a second.

## Analyzing the dual
As a matter of tradition, the vector $\nu_t$ is called the _value function_ or _cost-to-go_ at time $t$. (We will refer to it as cost-to-go here.) This is a great observation from Bellman who discovered the fact that the original problem we had satisfies a dynamic programming principle, which, in turn, enables this value function to be easily constructed and later used to solve the original problem. (Though, of course, we discovered it here purely mechanically from just taking the dual problem.)

As a side note, the matrix $S^T$ has a nice interpretation we will use throughout. For each state $i$, the value $(S^T)_{ji}$ is one if state-action pair is over state $i$ and zero otherwise. In other words, the $i$th row of $S^T$ is the Boolean vector consisting of all state-action pairs corresponding to state $i$.

Ok, now onto the problem. First, note that, since $p_1 \ge 0$ is nonnegative, the objective is nondecreasing in all variables. Additionally, since $M_t \ge 0$ is also nonnegative, then the right hand side of the constraint is nondecreasing in $\nu_{t+1}$, as is the left hand side, since $S$ is also nonnegative. This means that, so long as we continue to satisfy the constraints of the problem, we can increase $\nu_t$ as much as we want and it will not decrease the objective value, for any $t$. (In general, it might even increase it, which would be great.)

Let's start from $\nu_T$, the value function at the last time step.

What's the maximum we can increase $\nu_T$? Well, we can increase $(\nu_T)_i$ as much as possible, until $(\nu_T)_i$ is equal to the lowest loss state-action pair $j$ containing state $i$. Equivalently: over all possible actions we can take in state $i$, we can make $(\nu_T)_i$ equal to the one with smallest loss. Writing it out:
$$
(\nu_T)_i = \min_\text{$j$ contains $i$} (\ell_T)_j.
$$
This is true for all states $i=1, \dots, m$ and this is the largest possible we can hope to make $\nu_T$.

Now, consider $\nu_t$ for $t = 1, \dots, T-1$. Assume we have $\nu_{t+1}$ (since we have $\nu_T$, this is fine) then, using the same reasoning as before, we can take
$$
(\nu_t)_i = \min_\text{$j$ contains $i$} (\ell_t + M_t^T\nu_{t+1})_j.
$$
The first term of the sum is the same as the previous, except over time $t$. On the other hand $M_t^T\nu_{t + 1}$ can be interpreted as follows. For each state-action pair $j$, the value $(M_t^T\nu_{t + 1})_j$ is the _expected cost-to-go_ if we were to execute $j$. In particular, if we execute $j$, then the $j$th row of $M_t^T$ (equivalently, the $j$th column of $M_t$) tells us the probability of landing in each of the possible $m$ states of the system, and $(M_t^T \nu_{t+1})_j$ is exactly the expectation of $\nu_{t+1}$, the cost-to-go at the next time period, with respect to that distribution.

Finally, since the objective is nondecreasing and we have made $\nu_t$ as large as possible for all $t$, then it must be the case that $p_1^T\nu_1$ is maximized, so this choice of $\nu_t$ is optimal and we are finished.

Note that this equation is _exactly_ the [stochastic Bellman equation](https://en.wikipedia.org/wiki/Bellman_equation#In_a_stochastic_problem) (which I'm cheating and calling the HJB equation) as required!

### Recovering the solution
The final question is: ok, we have the value functions $\nu_t$. How do we use these to solve for the original $x_t$?

Here's a simple one, which I will leave to the reader to prove is a maximizing point. Let's assume we have $x_{t}$ for now. Let $j$ be any state-action pair containing state $i$ for which
$$
(\nu_t)_i = (\ell_t + M_t^T\nu_{t+1})_j.
$$
(That is, the state-action pair $j$ is a minimizer for state $i$ at time $t$.) Set $(x_{t+1})_j = (M_t x_t)_i$ and set all other state-action pairs which contain state $i$ to zero. Do the same for all possible states $i$ and so on for all $t=1, \dots, T$, then this will result in a feasible set of $x_t$. Can you show this is optimal? (The simplest way is essentially the Bellman approach. The second simplest is via complementary slackness.)[^2]

## General thoughts
It is also possible to take some limits (under certain assumptions over the operators, etc) and recover the "true" HJB equation in the continuous limit, similar to the one that Matt posted. This is a little more annoying than the "standard" approach, but can be made fully rigorous, though I won't do so here.

Overall, this is probably a slightly more complicated way to derive the construction than the standard Bellman approach. Of course, once you recognize that a value function of the form above can be constructed, the rest is just mechanical. What's interesting about this _particular_ approach, though, is that it is simply duality + basic observations.

---

[^1]: In our setting, the number of states of the system can depend on the time $t$ and the actions that we are allowed to take can depend not just on the time  but also on the actual state. For simplicity, we will ignore this, but the generalization is essentially immediate from the set up here, there's just more indices. It is still informative to note that this "generalization" can be included in the setting we're considering by expanding the set of states and actions.

[^2]: Another observation is that there may be many optimal $x_t$ for the original problem. In particular, if there are many state-action pairs $j$ for which $(\nu_t)_i$ is the minimizer at state $i$, then any probability distribution over these minimizing state-action pairs $j$ will suffice. (In other words, for all minimizing pairs $j$ for state $i$, the only constraint we need is that the sum of $(x_t)_j$ over the minimizing pairs $j$ of state $i$ is equal to $(M_tx_t)_i$.)
