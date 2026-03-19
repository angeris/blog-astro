---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Breaking signals, breaking systems"
pubDate: 2026-03-19
---

I've been having a hard time enunciating why, exactly, when people send me outputs of ChatGPT, or Claude, etc. (and I spend enough time with the models that I can generally tell this is the case) I have a surprisingly strong negative reaction. This post is one attempt at making my reasoning somewhat-legible.

## Writing as proof of work

Back in the Good Old Days(TM), when someone wanted to float an idea by you, they either had to (a) chat with you, or, in lieu of that, (b) write to you in some way, shape, or form. Chatting is usually a great way to quickly bounce ideas off of each other, think through some thorny problems, or even make sure you're on the same page about some concept or idea.

Writing, on the other hand, involved some amount of slow and deliberate work. You had to sit down at a keyboard (or phone) and spend some time thinking about how you wanted to say what you wanted to say. Only _then_ would it make sense to begin writing, which may or may not involve some amount of editing, further thinking, maybe some more elaboration, and, finally, actually sending the object in question.

By the time your subject received the output of your work (whether the result of 10 minutes or an hour or whatever) this person would at least know that you spent some time trying to make the ideas legible not just to yourself but also to them. This, in turn, meant that the norms of discourse made sense: writing this output would generally cost at least as much as reading it, so if someone had taken the time to carefully write down their ideas, it meant that they had thought about them enough to know whether the ideas are reasonable at all. In other words, the writing itself was a _signal_ of some minimum threshold of thought, consideration, or care that went into making the work.

Further, there was generally a pretty good correlation: stylistically good writing generally meant that someone had spent even more time thinking about the idea, compared to stylistically poor writing. This, in turn, was another good heuristic for how much time your subject might want to spend grappling with the words on the page. For really important ideas, making them cleanly legible was an additional signal that the output was of particular importance.

Of course, the problem is probably pretty obvious at this point: now we have (amazing!) large language models that can output approximately a gajillion tokens per second of generally-stylistically-decent writing. Normally, we only need to read a small number of tokens of generally-stylistically-decent writing to determine whether it is generally-stylistically-decent, but determining whether generally-stylistically-decent writing is actually _useful_ requires reading a large number of tokens and thinking for more than a few seconds. When the correlation between "generally-stylistically-decent" and "useful" approaches zero, then our heuristics break, and, in lieu of more informative heuristics yet to be developed, we fall back to the slow path.

In systems parlance, this is generally called a "denial-of-service" attack since the resources required to produce such writing are now much lower than the resources to verify whether it is useful, which is an unfortunate position to find yourself in.

As a short addendum: possibly the worst of all cases is when it feels less like "I have sent you an idea I considered briefly, here's the AI God(TM)'s further thoughts on it" and more like "can you please browse through this long slop list and check for me if any of this makes sense." (Almost universally, at least today, the answer seems to be "no" or, when it is "yes" it is far down somewhere in the list.)

I think the biggest unfortunate consequence, really, is that there is something open about writing something "by hand": there's a bunch of implicit signals that show where the writer has been spending a bunch of their time, what parts seem to be clear, what parts weren't so clear, and potentially even indicate other points of interest to think together on. This is true even for informal communication, such as emails and shorter messages. Removing those little tidbits usually means that it _actually requires more back and forth to get to the meat of an idea_!

Which is, uh, well, exactly what we're trying to solve by communicating.