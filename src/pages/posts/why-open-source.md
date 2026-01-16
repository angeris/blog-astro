---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Why open source matters"
pubDate: 2026-01-15
---

We often discuss why open source matters in a general philosophical sense. This includes observations like economic advantages (commoditizing the complement), moral advantages, the ability to "opt out" of closed-source projects that attempt value capture, repairability and maintenance, and so on and so forth.

In this (short-ish) post, I hope to make a little bit of a different argument than the above (and other similar ones that I usually see presented). In this post I'm going to use "open source" in the Open Source™ sense (think Apache, MIT, maybe copy-left, but mostly the former two) although there will of course be points that apply more generally.

## Open source as a learning tool

Much like old writings in ancient libraries that are still recoverable, open source is an _artifact_ that we leave for future generations to understand, tinker with, and learn from, all without having to ask anyone for permission or pay anybody to do so. There's no need to be part of any particular group, have a university degree, or have some sort of affiliation to access open source software.

It might not seem super important; after all, what's wrong with paying for software? I mean, in general, it's not _that_ expensive, certainly relative to the hardware that we run it on.

But the point is that, when you're just starting out, any barrier (economic or otherwise) to tinkering, learning, etc., especially while exploring the vast space of "things available to you over the internet", can be a complete impediment to experimentation and learning.

These effects compound over time too: learning new things that are adjacent to your current knowledge is, of course, easier than learning completely new things in the first place, which leads to even more concentrated knowledge in or around this area. So, if this initial path to experimenting with open software is cut off, the downstream effects are much more unfortunate than "oh, some kid did not get to play with some software". (It is just much harder to see this counterfactual situation.)

## Open source as a historical artifact

Another important consequence of open source is that it functions as a historical artifact of best practices (or, at least, _common_ practices) of a given time. That is, open source functions as a "record" of the collective learnings of some of the most sophisticated[^1] groups of people involved in knowledge creation today.

Not only is this the case, but the historical artifact itself nicely charts what problems, frameworks, ideas, philosophies, and so on were important at any given time. Of course, there is no _guarantee_ that such things will be preserved for future generations, ad infinitum, but the fact that anyone can replicate it, remix it, reupload it certainly makes it infinitely more likely to remain.

(Indeed, [GitHub has a program attempting to do exactly this](https://archiveprogram.github.com/arctic-vault/) with major open source projects, but this is a planet-scale effort!)

## Open source as a Schelling point

Open source software/protocols/etc., after gaining enough popularity, become a de-facto standard which then gets used throughout, bringing more people into the ecosystem (and in turn improving the standard!) and so on.

I think the benefits of this are substantially downplayed in a number of ways: in effect, this roughly means that, in the long run, _open source software determines who wins_.

There's many arguments one might make against this. For example: a lot of hardware industries have horrible tooling that is both expensive and impossible to use.

But the past 10 years or so have seen a huge uptick in... [fixing exactly that](https://github.com/jfrimmel/ice40-env). In FPGAs, people have reverse engineered the [iCE40](https://www.latticesemi.com/ice40) and then created an open source ecosystem around it. This, in turn, exploded the popularity of this tiny, low-power FPGA in both education and in practice, and it has now become the standard FPGA that people use for both hobby projects and low to medium volume commercial projects.

Similarly, we see the same being true of the [Raspberry Pi Pico series](https://www.raspberrypi.com/products/raspberry-pi-pico-2/). Yes, STMElectronics has a [trillion possible SKUs](https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html) for every particular application, and yes these are what get used in larger projects, but these things start from the bottom. Most engineers I know that are starting new projects and devices in robotics, personal aircraft, etc (that is, projects without specific constraints) are almost universally reaching for the Pico series as their basic building microcontroller, rather than any of the STM series. Not least because the fact that it's open source allows them to use whatever tools they want, and, in the past few months, because coding agents play particularly nicely with it.

Of course, this is in hardware, which has historically been the "counterexample" to open source. In software, the effect is much more obvious, so I won't make that case here. (Examples include Linux being the standard OS in supercomputers, Git, LLVM, TCP/IP, essentially every modern programming language, etc., etc.)

This leads me to the last point, which is more of a prediction than an observation, though early signs are pretty good.

## Open source probably "wins" in the AI coding race

Once you have a Schelling point that allows everyone to easily agree on _what_ should be improved, then the question of improvement is now a question of "who can we get to improve this thing and how."

AI coding agents (probably not _quite_ yet, but in the not too far future) are pretty good at reading code, organizing it, and writing more. What they are not good at is determining what should be improved and how, or what features might make sense, etc.

In other words, open source turns the creation of software into an open queue that anyone can help with.

This was, of course, the original dream of open source: anyone in the world can contribute, hence _some_ will contribute to a given project, thus easing development costs, and so on. The problem is that there are huge up-front costs to contribution. To do this, you previously had to understand (a) the mechanics of the code, (b) the coding style, and (c) where your change would fit in. Of course, agents totally flip this upside down and now the output becomes a question of _taste_—does this code actually meet the bar and does it solve the problem we were interested in?

In a sense, this changes what would've previously been coding effort into triage effort. (Which is often, but not always, easier.) It also makes any one individual much more likely to contribute even small changes.

While the above is still mostly true for closed-source models, open source has, I suspect, one additional benefit. Namely, all accepted code now becomes part of the training set for future models, since it is open and available for anyone to download. This not only improves models, but indeed makes them _better at exactly the thing that the open source community wanted anyways_, acting as a kind of (very long timescale) reinforcement learning mechanism.[^2]

Interestingly, there are some versions of doing this more explicitly, such as the [Acorn prover](https://acornprover.org) project, but I wonder if there are more. (Acorn trains a proving model on its own standard library as people prove more things. This now-improved model helps people prove even more things about math that get added to the standard library, which helps train the model with new techniques, and so on.)



May the AI odds be ever in your favor.

---
[^1]: At least, uh, on average.

[^2]: There's obviously a bunch of stuff here that I'm glossing over and I'm decidedly not distinguishing between "base" models and post-trained models, but the point is ~ there.
