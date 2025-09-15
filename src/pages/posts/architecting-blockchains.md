---
layout: ../../layouts/MarkdownPostLayout.astro
title: Have we been building blockchains wrong?
pubDate: 2025-05-09
---
Probably the first in a small series of short-to-medium essays outlining some _weird_ but provocative thoughts about the current state of affairs in how we're doing things.

---

A lot of what I will write here is a combination of a bunch of little tidbits from many places, including but certainly not limited to [protocols that already exist](https://celestia.org), [papers we've written](https://angeris.github.io/papers/da-construction.pdf), [twitter](https://x.com/ercwl/status/1918938164929962268), [forum posts](https://forum.celestia.org/t/use-das-to-speedup-consensus-throughput/1810), [papers we haven't written](https://eprint.iacr.org/2024/1586), [random conversations with people much smarter than I](https://x.com/recmo), [musings after a few glasses of wine](https://x.com/GuilleAngeris/status/1906381309913751652), etc. I claim no original thoughts, but sometimes it's good to just write it all down in some vaguely-readable way, so here we are.

# What we do now
Ok. Let's say we're on one of the most decentralized networks in the world, which I will leave unspecified. And I'd like to access my account balance from my phone to make a transaction.

What do?

Well, naturally, we connect to some random AWS server, which claims it has the latest state of the chain, then download that state onto your phone. Ideally that balance is right (who knows, no real way to check) but whatever, let's say it's good.

Now I'd like to make a transaction. What do?

Well, you (generally) blindly sign a transaction that gets sent out in the open. This transaction, readable to anyone, may or may not be incorporated into a block (depending on a number of incredible factors, up to, but not excepting, whether it will net _someone else_ money). If it _is_ incorporated into a block, well congratulations, now every single person who wants to verify the whole chain has to... read that one transaction you made that one time and then make sure to update your account balance given not just your transaction, but also the transactions that everyone else has made at some point in the chain's history. Most importantly, everyone who wants to verify the chain has to do this _for the rest of time_.

Ok, amazing. Let's say you _do_ want to check the chain! I mean why not, it's a decentralized system after all, right? Ok, so you boot up your raspberry pi, get your 100MB/s internet connection, and... wait a few weeks for the whole chain to download, check each and every transaction (including some fun slowdowns once you reach late 2016) and then, every 12 seconds, receive a block that is hopefully no larger than a few hundreds of KB (otherwise how are _other_ raspberry pis going to be able to catch up?) and then... check every transaction there, for the rest of time.

If you don't want to do this, well, tough luck: go trust the AWS server out there to tell you the truth.

I mean, wtf are we doing here? I don't think a single part of this process sparks joy.

Here is a (short, but hopefully informative) list of problems from the above:
1. Why do we have to trust _anyone_, much less a random AWS server here to know our current state?
2. Why does everyone need to check each individual transaction ever, like an artisanal hand-crafted, free-range, calculated-by-hand balance?
3. Why do we even have to download the whole chain to be able to verify its current state?
4. Do we really expect the Financial System of the Future™ to run on a few hundred KB per block? Ok, let's even make it 32MB, today: do we _really_ expect the Financial System of the Future™ to run on 32MB every 12 seconds or so?
5. Why do we need a server running at home (an rpi!) with enough bandwidth? We have essentially pocket supercomputers! If we solved the whole "don't download the entire blockchain every time to verify it" then, well, we've solved a few other problems as well.

Ok, it's neat and all to complain about problems, but it's also just too easy. So let's talk some solutions.

# Proposals

Here are some desiderata for a Blockchain Of The Future™:

1. Your phone should be able to know the state of the chain is valid at essentially all times when it has an internet connection
2. You should not need to trust anyone in order to get whatever data is needed; or, at least, need at most a few honest parties _somewhere out there_
3. You should not need to download the entire latest block every 12 or so seconds to be able to do this (especially as blocks become larger than a few MB)
4. When sending a transaction, you should be able to optionally disclose the contents of the transaction

Funnily enough, a well-architected system that does the first three will essentially get the fourth point for free. It will also scale the complete construction here: if your phone doesn't need to download the whole block... then people in consensus also do not need to download the whole block to verify stuff. In turn, this allows for much larger blocks without doing all sorts of fancy stuff (like special connections directly to a handful of validators and so on).

A stretch point we will set for ourselves, for fun is:

5. Nodes who participate in consensus and propose blocks should also be able to run on modern laptops and a good home connection (say, fiber, which can 'peak' at ~1 GB/s but sustain at around 200 MB/s or so) even when the blocks are on the order of 100s of MB to 1 GB. Right now there's talk of full 4U server racks and multiple GPUs to propose blocks, but, imo, this is insane overkill.

I'll give a "rough" architecture for something that mostly achieves these goals below.

## Making it all work (sketch)

### Propagating blocks
First, if we take the last point as given—that nodes need to run on standard connections and modern laptops—then certainly it cannot be the case that block proposers need to send the complete block to everyone else in consensus (which would completely blow through the bandwidth budget) or even a small number of people.

This means that we need to somehow perform some encoding and 'shard' the block, passing it down to many parties such that the total communication for any one node is at most ~ the size of a block. Note that [encoding is pretty fast on modern hardware](https://github.com/catid/leopard) so even the upper end of our range, ~1GB or so, should be easily done on a modern laptop (think M1 pro mbp) in a few seconds, no problem.

Ok, that's neat, but it's also silly. It turns out we don’t need everyone to download the whole block at all!

We know that by performing this encoding and then passing the block down to people... we're essentially [constructing a nearly-general succinct proof over the transactions in the block](https://angeris.github.io/papers/accidental-computer.pdf). (In _fancy_ terms: by downloading small parts of the block, anyone can check that the received encodings are good and the state transition function is satisfied. Ideally this transition function is also simple enough that, like encoding, it can be proven on a laptop even for big blocks.)

If enough people in consensus can download these parts of the block, then we're chillin': we know the block has gone out to enough places that it can always be reconstructed from people's individual parts, even if no one person has the whole block.[^block-proof] So, for free, the amount of bandwidth needed to participate in consensus is much lower than the bandwidth requirement to even send a block.

Said in other words, the amount that any one person needs to download is small, relative to the size of the block, which in turn means that anyone participating in consensus (or, more generally, verifying the latest block) doesn't need to download the whole 1 GB block. The actual amount will turn out to be quite small.

### Verifying blocks
What's cool about the above is that now we've roughly decoupled the _size of the block_ from the _bandwidth needed to verify the block_. In fact the data needed to verify the block is actually quite small—small enough that for a 32MB size block, with current techniques, you need ~2MB to verify its correctness, or for a 1GB sized block, you need ~15MB. Obviously, the goal would be to get this even smaller (< 1MB for a 1GB block would be ideal) but that now is looking more like an engineering challenge rather than a pipe dream.[^proof-size] This is _also_ now well within striking distance of a phone over 3g (~1MB/s) for 32MB blocks today.

By construction, this solves problems 2, 3, and 5, at least for the, uh, at-the-moment-stretch-goal of 32MB, but the path to 1GB is also extremely clear here.[^recursion]

A second super-neat part of this is that, by being able to verify the state of the chain at all points in time, you do not need to trust the server relaying your bank account balance. If, for some reason, you do not have your current balance, the server can provide the balance along with a very short proof that it has been correctly computed from the latest state of the chain. This, in turn solves problem 1, so only point 4 remains.

### Privacy as a (near) side-effect of succinct verifiability
What's also very cool here is that nobody is _actually reading transactions anymore_, they're now just verifying proofs that the transactions netted out correctly and so on. Which means that all we need, instead of a fancy transaction, is a proof that the transaction doesn't do something sketchy (_i.e._, spend more than the available balance of the account).

So, instead of simply using standard succinct proofs, why not make them zero-knowledge?[^zk] Yes, this will require that the clients keep some amount of state on their end (though there are [solutions for this in other ways](https://penumbra.zone)) but that's probably ok. If not, we can use the idea with the server above, perhaps inside of a TEE, using a viewing key.

# Conclusion and acks
Anyways, this is all maybe a long way of saying: the future of 1GB per block, fully-verifiable-on-your-phone, private, and fast blockchains really isn't so far, but we've got to dream a little bigger. (And maybe retire the poor raspberry pis, they can go back to retro-gaming duty.)[^more-notes]

Also: a big thanks to Parth Chopra for reading this before it went out.

---

[^block-proof]: The even neater part is that everyone has a proof that is easy to verify that the received parts of the block are good so you don't need to trust them, either. 

[^proof-size]: With techniques such as [Ligerito](https://angeris.github.io/papers/ligerito.pdf), it's possible that other (bigger) nodes can construct even smaller proofs for nodes that are very bandwidth limited, without needing the overhead of standard recursion. This is still an active research area, though, so no concrete answers here.

[^recursion]: I'm cheating a little bit here of course: anyone who wants to check the chain now needs to download parts of all historical blocks, which, while better, is not great. Instead we can recursively verify the proof: when proving that block $t+1$ is "correct", include, as part of the correctness point, the requirement that the proof of block $t$ is correct. (The fancy parlance for this is "recurse" the proof of block $t$ into the proof of block $t+1$.) Checking block $t+1$'s proof then tells you that block $t$ is good, which in turn tells you that block $t-1$ is good, and so on.

[^zk]: This is somehow simultaneously as easy and as hard as it sounds, for better or worse.

[^more-notes]: We are also missing stuff about how to make the blockchain itself simple to prove while maintaining the ability for complex applications to exist (provable rollups, roughly), managing state (getting gud, mostly), and client-side proving (already on-its-way to being solved, kinda). But like, ok, this is a post not a tome.