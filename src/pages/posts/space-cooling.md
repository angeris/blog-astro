---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Cooling in space"
pubDate: 2026-06-11
---

With all the talk of data centers in space, I remember my first question being "isn't cooling this stuff a fundamental limit on whether we can have orbital data centers at all?" Turns out that at least this part is definitely doable and quite possible.

I'd like to give a quick thanks to [Saurav](https://x.com/SauravShroff_) for convincing me of this originally and [Parth](https://x.com/pchopra28) for discussions/encouraging me to write this.

I'll go a little bit slow on this one, since my guess is readers who are interested in this particular topic probably need a little more background. If you don't, you can skim this next subsection and head directly to the next one.

## Why do we need cooling?

Ok, assume we have a datacenter in space and all of its electrical energy comes from solar cells, pointed at the sun.

In this orbital data center (which, in my head, I picture as a big box with solar panels sticking out of it, facing directly at the sun) we have a bunch of GPUs. It's possible we also have some communication equipment (to send data up to and down from the satellite) and maybe some basic power equipment, but assume that ~ all of the power goes to the GPUs.[^1]

A GPU, in short, is a machine that takes in electricity and outputs heat (and, as a side effect, performs some hopefully-useful computation). In fact, essentially all of the electricity input is converted to heat, which, if not dumped somewhere, will eventually cause the GPU to melt and become a very expensive paperweight made of copper and silicon.

In other words, we need some way of dumping the heat out of the GPU, ideally to some large reservoir.

On Earth, consumer GPUs do just fine dumping it out onto "the air on Earth" by running room-temperature air over the GPU. This transfers the heat from the GPU onto the room temperature air (by heating it) and the resulting hot air is blown out of the GPU and replaced with room-temperature air again. Do this quickly enough and the GPU stays relatively cool—ideally, not far above room temperature, which is fine for most intents and purposes. For larger GPUs or collections of GPUs, like those used in data centers, the mechanism is roughly the same, except we use slightly fancier coolants to transfer heat away from the GPU more quickly and spread it out over a larger area (which results in more room-temperature air coming into contact with the larger area, which, in turn, allows more heat to be dissipated).

The problem, of course, is that space has no air to exchange heat out to. In fact, since space is mostly a vacuum, there is no other medium to exchange heat!

So: what do?

## Blackbody radiation

From some basic physics, we know that a body at any temperature will dissipate heat as radiation.[^2] For example, humans (and most warm-blooded animals) [radiate infrared light pretty strongly](https://www.youtube.com/watch?v=0YE7rgwZBeI) which is why "thermal cameras" work in the first place. ("Thermal cameras" are just cameras that, instead of seeing red/blue/green light, see infrared light.)

There is a pretty famous law, called the Stefan–Boltzmann law, which relates the total amount of power radiated to the temperature of the object, and is a very good approximation for most objects. It states that the power radiated $P_\mathrm{rad}$ satisfies
$$
P_\mathrm{rad} = \sigma A T^4,
$$
where $T>0$ is the temperature of the object in Kelvin, $\sigma$ is some proportionality constant (derived experimentally or, alternatively, from integrating Planck's law) and $A$ is the _effective area_ of the object.[^3] Potentially there's a factor $\varepsilon < 1$ called the emissivity in front of the whole thing, but we'll assume $\varepsilon \sim 1$ for our rough estimate, since we will generally have something like $\varepsilon > .9$.[^4]

This gives us a way of "cooling" down some piece of equipment in space, without needing air or another effective cooling medium. To do this, first we can conduct the heat from the chips (which we'd like to maintain at some temperature $T$, which is, say around $T \sim 330$ Kelvin or $\sim 60$ Celsius) out onto some wide region with area $A$ which lies under the solar panels, which we will call the _radiator_ as it, well, radiates.

How do we achieve this practically? One idea would be to use some fluid (which can be a liquid or gas) that has relatively high specific heat to transfer heat away from the chips. We can pump the fluid through the top of the chip, which heats up the fluid by removing heat from the chip, and the fluid's own heat is then dumped into the radiator, which cools by, well, emitting radiation.

Usual choices for this fluid on Earth include water or some glycol water mixture, but water (and/or glycol) is very heavy and each pound that we add substantially adds to the cost of launching our orbital data center into the atmosphere. Some gases such as CO2 or hydrogen (in spite of flammability) can perform a similar function at reduced weight and efficiency, though obviously gas leaks are more annoying to deal with in practice.

This is the whole required loop for cooling the chips in space. (We will add a slight complication in a second to increase efficiency, but it's enough for now.)

## Area computation

Now, effectively, we must take all of the input power coming from the solar cells, which we will write as $P_\mathrm{sol}$, and dump it out into space via blackbody radiation, which we have written as $P_\mathrm{rad}$. Note that at steady state, we must have that $P_\mathrm{sol} = P_\mathrm{rad}$.

Recall that the power generated by a solar cell (assuming it is always facing the sun) $P_\mathrm{sol}$ is proportional to the area of the solar cell, $A_\mathrm{sol}$. Similarly, we know from above that the radiated power $P_\mathrm{rad}$ is proportional to the area of the radiator. Both quantities scale identically in the area, so we can ask: what percentage of the solar cell's backside has to be taken up by the radiator?

Roughly, taking some numbers from [online](https://www.starlight.space), we have that a space-grade solar panel gives around $\kappa = 150$ watts of power per square meter, when facing the sun directly. We know the value of $\sigma$ in the equation for the radiated power ($\sigma \sim 5.7 \cdot 10^{-8}$ units-which-make-the-equation-work) so we get
$$
\kappa A_\mathrm{sol} = P_\mathrm{sol} = P_\mathrm{rad} = \sigma A_\mathrm{rad} T^4
$$
which means that the ratio of the areas between the radiator and the solar panels must be
$$
\frac{A_\mathrm{rad}}{A_\mathrm{sol}} = \frac{\kappa}{\sigma T^4}.
$$
Since the chips can operate at around $T \sim 330$ Kelvin (a little under $60$ Celsius), we have that the radiator should take up around $22$% of the area behind the solar panels.

This is already quite achievable! It is relatively easy to construct radiators that only take up a small-ish proportion of the solar panels' total area, and it seems totally order-of-magnitude reasonable to cool any size of data center you might want.

If you prefer $T\sim 300$ Kelvin (or around $30$ Celsius), then the area increases to around $32$%, which is similarly reasonable. (Or, at least, not out of the question.)

## Epicycles

It is reasonable to say something like "look, these data centers are very large and the solar panels themselves must be massive, so we'd like to reduce the area further since $22$% of a lot is a lot!"

That's totally fair! And indeed, by the time we have already (a) made plans to send a thing to space, (b) built a thing that goes to space, and (c) sent a thing to space, surely we can try to squeeze even more "juice" out of the radiator.

And, indeed, we can.

Since the power emitted by the radiator scales to the fourth power, one reasonable thing would be to use a _heat pump_. A heat pump would allow the processors to run at 300K, while making the radiator run at higher temperatures, thus making use of the fact that the area ratio scales as the inverse fourth(!) power of the temperature, which then reduces the size of the radiator. Of course, this would come at a cost of having to use additional energy from the solar panels for the heat pump that could've, instead, been used for more GPUs. It also requires more engineering, but we're assuming that's free (ish) here.

Another important thing to note is that it is likely that radiators do not perfectly face outer space, but may face the Earth at least in part. Since the Earth itself is a blackbody(-ish) at ~300 K, then whatever solid angle of the radiator is facing the Earth (_i.e._, whatever part of the radiator can "see" the Earth) is essentially in radiative equilibrium with the Earth if the GPUs are kept at 300K, providing no cooling. This can be fixed in any number of ways and engenders a few tradeoffs, but for our rough estimate, we ignored it here.

Additional things to add could include the fact that the solar panels themselves heat up as the sun hits them, thus making the radiator less efficient (though some insulation can fix that, which is mostly engineering) among a number of other similar things of this form, but the point remains roughly the same, with tradeoffs in both directions.

## Conclusion

Of course, there's a number of other possibilities here that are still required to make it all work. For example, it's not trivial to make a radiator that is very lightweight and foldable and space-proof, but I'm sure you can imagine at least a few designs off-hand. Cooling loops with gases are also similarly not obvious, but we've solved harder problems in the past.

There are other things like radiation-hardening for the chips and so on, but none of these are full-on research challenges. Indeed, I would put them squarely in the (hard, but nevertheless) engineering camp!

---

[^1]: This is ~ a fine estimate, since it's easily above 90%, but my guess is closer to 98% or a similar number. It won't matter for out general estimate though, which is more order-of-magnitude.

[^2]: The mental image here is that "the temperature of an object" is, roughly speaking, how quickly the atoms/molecules/particles/etc are wiggling. At certain random intervals, these wiggling particles will emit a photon, which causes them to "cool down"; _i.e._, to wiggle slightly less, by conservation of energy. If the photon is not absorbed back, then this results in a decrease in temperature since the average "wiggling" speed has decreased.

[^3]: For the nerds in the room, the effective area is the sum of "how much of the exterior does any one point on the radiator see?" over all points of the radiator. In particular, the effective area of two ~ parallel plates close together is similar to the effective area of a single plate, since the surface area of the parallel plates that face each other is "wasted": any photon that this side emits will be reabsorbed by the other side, which results in no net temperature loss.

[^4]: Technically, space, due to the [cosmic microwave background](https://en.wikipedia.org/wiki/Cosmic_microwave_background), sits at around 3K and so emits some photons as well. These are absorbed by the radiator, but we ignore this since this contributes essentially no radiative heating as $3^4 \ll 330^4$.
