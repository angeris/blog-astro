---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Brokenness in iOS 27.x and "bug blindness"'
pubDate: 2026-10-28
---

In the spirit of Dan Luu's [bug blindness](https://danluu.com/bug-blind/) and [everything is broken](https://danluu.com/everything-is-broken/), I wanted to challenge myself to "open my eyes and see how technology actually _is_" rather than noting how good reasonably technical people can just... work around bugs effectively automatically, even if they are annoying in practice.

For example, my parents (themselves reasonably technical people who work in engineering) seem to hit upon annoying bugs on their iPhones a nontrivial amount when I'm around for the holidays. When I was younger, I used to give them a lot of shit since they were "clearly doing it wrong" but I've noticed that they really do run into bugs all the time. The only difference is that I've developed a certain "blindness" to these things since I do certain things automatically, such as:

- Quickly force quit an app the second it stops responding and restart it
- Verify things have been entered and not dropped in dialogs that "seem sketchy or unresponsive"
- Restart my phone when it is being weird in practice
- Talk to Siri in a slightly more "clear" tone than I normally do

and so on.

With that, I spent around a week just normally using my recently-purchased iPhone 18 pro or whatever with an open mind around bugs. I was shocked at how long the list was, even though I barely use non-standard apps. I would also assume that with the ability to quickly code using agents, make scaffolds for heavily testing UI, being able to have agents test for regressions in performance, Apple could reasonably well prevent stupid bugs in standard apps, but alas it is not so. (In some cases, it is so bad that I wonder if Apple employees use their own products, but that's a different point for another day.)

Anyways, here's the list I've accumulated so far. All the Siri bugs are on the "current Siri beta" (which has been in beta for... a while now).

1. Using the Phone app after calling sometimes does not allow you to call the person again; _i.e._, the call button next to the name on the entry is greyed out and unpressable. Additionally, clicking through to the contact detail view shows all buttons for calling, FaceTime, Messages, etc., as greyed out and are also unpressable. Seems to especially happen when you’re calling people in quick succession (when it is most annoying).
2. Sometimes (maybe 20% of the time?) Siri wakes on “hey Siri” but then stops listening (and closes the “wavy circle” popover) in the middle of saying something to it, including obvious Siri requests such as, "please add XXX to my reminders" or "remind me to check YYY on ZZZ date."
3. Siri doesn't reliably (around 30%? of the time) wake on "hey Siri" anymore, even after "additional voice training."
4. Sometimes, RCS and standard text messages fail to send until the phone is reset, even though they can be received.
5. This is a regression rather than a bug, but it's a weird feature removal. Searching in a PDF in safari now does not work from the search bar (like it did with websites) now requiring you to highlight random text, hit “find”, then retype the text you were looking for. Unlike in websites, there is no "Find on page" option either.
6. Double tapping on words in a textbox sometimes selects arbitrary parts of a sentence rather than just the word. This is not fixed by deselecting and double tapping the same word again, either, since iOS will reselect the same arbitrary part of a sentence, forcing you to shrink the selection manually.
7. When pulling up cards from the lockscreen (by double tapping the lock button) sometimes FaceID will simply fail to even start scanning your face for  payment, showing the little “smiley face in square” image indefinitely (though unlocking the phone works just fine).
8. Sometimes (maybe once every 15 or 20 times) timers do not go off after being set using Siri, even though there is audio and visual confirmation about them being set. (For a while I thought I was going crazy, but I have had confirmation with both my phone and my wife's phone when cooking... which is annoying.)
9. On the Phone app, sometimes the “Recents” calls do not update, which requires force closing the app to restart it (after which time the new calls show).
10. When scrolling or typing text that is longer, sometimes "blue underlined words" will not scroll (or correctly overflow) leading to an effect where the text overlaps with other text and makes it unreadable. Wiggling the text box seems to fix it most of the time.

Note that this list only includes material-ish bugs, not ones that are ephemeral or only observed once; these are also only the ones I wrote down while it was happening. I might continue the list as I observe more, but this is probably enough for now (and a week's worth of usage of default apps).

