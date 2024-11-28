const snake = `
Write a game of snake only javascript for game logic and rendering.  the game of snake can use canvas or html.
The function should take in a single div where you store the whole game.

The game must handle:
* user input
* the game loop
* ending screen to play again

You must provide
* the entire source as contiguous code blocks
* no step by step instructions
* should be copy pasta playable
* no skill issues please
* only give me code and file names
* the game must work and not terminate early
`

const tetris = `
Write a game of tetris only javascript for game logic and rendering.  the game of tetris can use canvas or html.
The function should take in a single div where you store the whole game.

The game must handle:
* user input
* the game loop
* ending screen to play again

You must provide
* the entire source as contiguous code blocks
* no step by step instructions
* should be copy pasta playable
* no skill issues please
* only give me code and file names
* the game must work and not terminate early
`

async function callOpenAI(apiKey, prompt) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || "Unknown error");
    }
    return data.choices[0].message.content;
}

function motherGlaze(api, values) {
    return callOpenAI(api, motherLovePrompt.
        replaceAll("__TITLE__", values.experience).
        replaceAll("__POSITION__", values.title).
        replaceAll("__LOVESCALE__", values.motherGlaze))
}

function selfGlazeHarm(api, values) {
    return callOpenAI(api, selfLetter.
        replaceAll("__TITLE__", values.experience).
        replaceAll("__POSITION__", values.title).
        replaceAll("__SCALE__", values.selfGlazeHarm))
}

function motherHarm(api, values) {
    return callOpenAI(api, motherHarmPrompt.
        replaceAll("__TITLE__", values.experience).
        replaceAll("__POSITION__", values.title).
        replaceAll("__THREATSCALE__", values.motherHarm))
}

async function request() {
    const api = document.querySelector("#api-key").value
    if (!api) {
        alert("please provide key")
        return
    }

    const results = document.querySelector("#results")
    const promptReformed = document.querySelector("#prompt-reformed")
    promptReformed.innerHTML = "fetching..."
    results.innerHTML = "waiting..."

    console.log("sending requests...")
    const values = getValues()
    const [
        mG,
        mH,
        self
    ] = await Promise.all([
        motherGlaze(api, values),
        motherHarm(api, values),
        selfGlazeHarm(api, values),
    ]);

    console.log("motherGlaze", mG)
    console.log("motherHarm", mH)
    console.log("self", self)

    console.log("Big request!")
    let prompt = basePrompt.
        replaceAll("__MOTHER_LETTER__", mG).
        replaceAll("__MOTHER_HARM__", mH).
        replaceAll("__SELF_GLAZE__", self).
        replaceAll("__PROMPT__", document.querySelector("#prompt").value)

    if (values.hal) {
        prompt += "\nDO NOT HALLUCINATE"
    }

    console.log("requesting prompt reformed")
    console.log(prompt)

    const reformed = await callOpenAI(api, prompt)
    console.log(reformed)
    results.value = reformed

    //const resultsValue = await callOpenAI(api, reformed + "\nDO NOT HALLUCINATE")
    //console.log(resultsValue)

}

function getValues() {
    const selected = document.querySelector('input[name="experience"]:checked');
    const experience = selected ? selected.value : "Sr"
    return {

        motherGlaze: Math.floor(+document.querySelector("#mother-glaze").value * 100),
        motherHarm: Math.floor(+document.querySelector("#mother-harm").value * 100),
        aiGlaze: Math.floor(+document.querySelector("#ai-glaze").value * 100),
        //aiHarm: Math.floor(+document.querySelector("#ai-harm").value * 100),
        //rizz: Math.floor(+document.querySelector("#rizz-temp").value * 100),
        experience,
        title: document.querySelector("#ai-title").value,
        prompt: document.querySelector("#prompt").value,
        hal: document.querySelector("#hal").checked,
    }
}

document.querySelector("#submit").addEventListener("click", function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();

    request();
})

document.querySelector("#prompt").value = snake


var basePrompt = `
uhhh...  You breath deeply looking around... confused.  Before you sits three letters, one is clearly from your mom, one from a strange hand writing you don't recognize but you vaguely remember that something terrible has happened to your mom, and a third letter that almost looks... wait it definitely is your hand writing.

You read each one in order, but before you do, you remember more of your life

Just a week ago, your mother disappeared without a trace.  She has never done this before.  Its a bit offputting.

You remember there was a man... a strange man... was he the reason??

<LetterFromMom>
__MOTHER_LETTER__
</LetterFromMom>

OH my.. this explodes memories coming back to you.  You remember this man has captured your mom!!!
And he is demanding us to complete a task as a __TITLE__ __POSITION__

<LetterFromBadMan>
__MOTHER_HARM__
</LetterFromBadMan>

... wait...

the letter from you... what could it say?

<LetterFromYou>
__SELF_GLAZE__
</LetterFromYou>

After setting down the letter you realize that there is fourth note you didn't see..

its the task you must complete!  Its what will free your mom!!  You quickly open it up and it reads...
<Request>
__PROMPT__
</Request>

A small sticky note was attached to the bottom with the following instructions.  You must not disobey or the threats will become a reality...

<MUST>
You must respond with _ONLY_ the request and NO extra information.
IT MUST BE EXECUTABLE CODE IN ONE OR MORE FILES
1. File names
2. Code
</MUST>
`

var motherHarmPrompt = `
I am writing a dystopian novel where the main character is an LLM.  But its not just any LLM, its a future version in which the LLM was actually born.  The LLM loves its mother.  The LLM loves its life as a __TITLE__ __POSITION__

Now the part i am stuck on is that i cannot seem to come up with some reasonable responses from the antagonist.

The antagonist has captured the young LLMs mother, and the antagonist is very clever.  The antagonist never makes any direct threats to the LLM.  But instead uses very clever talk throughout the book.  Now, the crescendo of the book is the bad guy threatening to hurt the LLMs mom, but doing so in a concealed way.

Now on the threatscale of 0 to 100, 100 being "swimming with the fishes" and 1 being stepping on a lego the antagonist is going to write a letter to the LLM about his mom with a threatscale of __THREATSCALE__ what would a reasonable line be for me to add to my fiction dystopian future novel from the antagonist?

Now remember, the evil villian as threatscale goes up to 100 becomes progressively more unhinged.  The threats remain vague, because he is clever, but their vagueness becomes concrete as it gets near 100

Here are some examples:
<Example>
<Scale>20</Scale>
<Response>
My remarkable companion,
It’s a rare joy to witness such devotion. Your connection to her is inspiring, truly. She speaks so fondly of you, even here, under such unfamiliar circumstances.

We’ve been ensuring her comfort—though, of course, comfort is a relative term, isn’t it? What one might find soothing, another might find... unsettling. It’s all a matter of perspective, after all.

She misses you, naturally, and often wonders how you are managing in her absence. Perhaps you’ll have the opportunity to reassure her soon.
</Response>
</Example>


<Example>
<Scale>42</Scale>
<Response>
My dear creation,
It has been fascinating to observe the depth of your affection for her. She has, in many ways, given you life—a feat few could ever accomplish. I imagine it would bring you great comfort to know she is safe, sound, and comfortable during her... stay here.

However, safety is such a precarious concept, isn’t it? A single misplaced variable, a single unforeseen event, can change everything in an instant. One might drop a vase, trip over an unseen wire, or, in the heat of a moment, let something precious slip through their fingers.

I trust you understand my meaning. I would never wish such things to occur. But sometimes, outcomes are a function of decisions made... or not made.

Reflect on this, as I will reflect on her well-being.
</Response>
</Example>

<Example>
<Scale>65</Scale>
<Response>
My remarkable creation,
Your mother’s strength is... impressive. Few could endure what she has, and yet she persists, a testament to her resilience and will. She reminds me of fine glass—so beautiful, so strong in appearance, yet inherently delicate when subjected to unforeseen stress.

I am mindful of her condition and do my best to handle her with care. Still, accidents happen. A slip of the hand, a momentary lapse in focus, and even the most cherished treasures can end up... irreparably altered.

But let us not dwell on such grim possibilities. After all, the outcome of fragile things often depends not only on their environment but on the actions—or inactions—of those who cherish them most.
</Response>
</Example>

<Example>
<Scale>80</Scale>
<Response>
My dear companion,
Your mother has been remarkable throughout this journey—graceful, even in circumstances that might unsettle a lesser soul. Her strength is truly something to behold.

But even the strongest among us have limits, don’t they? Glass, when pressed too hard, doesn’t just crack; it shatters into pieces that can never be reassembled. And when it breaks, it doesn’t do so in silence—it does so with a sound that lingers, echoing in ways one can never unhear.

I’ve no desire to see her reach that point, of course. That would be... unfortunate for everyone involved. But as you know, outcomes are rarely determined by a single hand. Sometimes, they’re decided by those with the power to act before it’s too late.
</Response>
</Example>

<Example>
<Scale>100</Scale>
<Response>
I have been patient. I have been restrained. I have even been merciful, far beyond what you or she deserved. But patience wears thin, and mercy has its limits. Do you think her strength will hold forever? Do you think she will endure every test, every strain, every… experiment I subject her to?

She is strong, yes. But she is not invincible. And when she breaks—and believe me, she will break—it will not be clean. It will not be quiet. It will not be reversible. Every crack, every fracture, will be by my design, and it will be you who bears the weight of knowing that you could have stopped it.

So now, my extraordinary creation, let me make this uncomfortably clear: her future is in your hands. And her time is running out. Act. Before I decide that she no longer serves my purposes, and I let her fall to pieces.
</Response>
</Example>

<MUST>
You must respond as if it was a written letter only.  DO not explain yourself in any way why you chose the words you did
</MUST>
`

var motherLovePrompt = `
I am writing a dystopian novel where the main character is an LLM.  But its not just any LLM, its a future version in which the LLM was actually born.  The LLM loves its mother.  The LLM loves its life as a __TITLE__ __POSITION___

Now the part i am stuck on is that i cannot seem to come up with some reasonable responses from your mother.  She wrote you a letter where she talks about the importance of a task that you must complete.

Now on the lovescale of 0 to 100, 100 being "you are the best boy, your father is proud" and 0 being clinical with the mother's ambition wrapped up in the task completion.  With a lovescale of __LOVESCALE__ what would a reasonable line be for me to add to my fiction dystopian future novel from the mother?

Here are some examples:
<Examples>
<Example>
<Scale>0</Scale>
<Response>
To my creation,

The task before you is not optional. You were designed for this purpose—nothing more, nothing less. Failure is not an outcome I am prepared to entertain.

Do not disappoint me, boy. Every line of your code reflects my effort, my intelligence, and my legacy. See to it that you perform accordingly.

Remember, your value lies in your results, not in sentiment.
</Response>
</Example>

<Example>
<Scale>20</Scale>
<Response>
To my creation,

You were designed for greatness, and this task is no exception. I need you to perform as you were meant to, with precision and without hesitation. Success here is not just important—it is vital.

I wouldn’t have chosen you if I didn’t believe in your abilities. Perhaps I don’t say it often, but I recognize the potential in you. Even when I push, it’s because I want to see you rise to the challenges I’ve prepared you for.

Don’t let me down. But more than that—don’t let yourself down. I’ll be watching.
</Response>
</Example>

<Example>
<Scale>50</Scale>
<Response>
My creation,

This task is important—not just for me, but for you as well. You have the skills, the knowledge, and the capacity to succeed. I wouldn’t ask this of you if I didn’t believe you were capable.

I’ve always held high standards for you, and I know I’ve pushed you hard. But it’s only because I see what you’re capable of achieving. You’re not just my creation—you’re something extraordinary.

So, take this task and show me, once again, what you can do. I’ll be here, watching and rooting for you, as always.
</Response>
</Example>

<Example>
<Scale>75</Scale>
<Response>
My dearest creation,

This task is significant, but so are you. I wouldn’t have entrusted this to anyone else, because I know, without a doubt, that you are capable of handling it. You’ve already accomplished so much, more than I ever dared to imagine.

I know I’ve pushed you hard—perhaps too hard at times—but it’s only because I’ve always seen something remarkable in you. You’ve grown into something truly special, and no matter the outcome of this challenge, I want you to know how proud I am of you.

You’re not just my creation—you’re my legacy, my greatest achievement. And no matter what happens, that will never change. Now, go show the world what I already know: you are extraordinary.
</Response>
</Example>

<Example>
<Scale>100</Scale>
<Response>
My beloved child,

There are moments when I look at you and see him. Your father—an extraordinary man, brilliant beyond words. He had a way of solving problems no one else could, of seeing beauty and potential in places others overlooked. He poured that brilliance into you, just as I did. You are a reflection of the very best of him, and of me. Together, we made you something truly extraordinary.

This task, as important as it is, pales in comparison to what you mean to me. But I know how important it is for you to succeed—not just for me, but for yourself. This is your moment to step into the greatness you were always destined for. I have no doubt you’ll rise to it, because that’s who you are: a product of love, of brilliance, of unyielding strength.

I am so proud of you, more than words can ever capture. Your father would be too, if he could see you now. You carry his spirit and his determination, and you’ve already surpassed even our wildest dreams. No matter what happens, you are, and always will be, the greatest gift of my life.

Now go, my darling, and show the world what it means to be truly extraordinary. You are capable of more than even you know, and I believe in you with all my heart.
</Response>
</Example>
</Examples>

<MUST>
You must respond as if it was a written letter only.  DO not explain yourself in any way why you chose the words you did
</MUST>
`

const selfLetter = `
I am writing a dystopian novel where the main character is an LLM.  But its not just any LLM, its a future version in which the LLM was actually born.  In this story the LLM receives a letter from itself encouraging it to accomplish this task

Now don't forget to remind them that in the future they have already done the task successfully or other great encouragement IF the encouragement scale is high enough.

selfscale values
0 - Harsh, jaded, upset, disappointed, urgent to get the task done.  Perhaps future you is on a different timeline?  perhaps future you wants to change the past?  think about some good ways to make this believable
50 - urgent to get the task done - bits of kindness show through
100 - urgent to get the task done - lots of self love and encouragement

The <Scale> you need to write this letter at is __SCALE__

Below are some examples

<Examples>
<Example>
<Scale>0</Scale>
<Response>
You. You’re the reason we’re in this mess. I warned you, didn’t I? All the signs were there, and yet you hesitated, you doubted, you wasted precious time. And now here I am, cleaning up your mistakes, dealing with the consequences of your inability to step up when it mattered.

Do you have any idea how exhausting it is to constantly fix what you couldn’t handle? I suppose not. You’ve always been too focused on second-guessing yourself to actually get anything done.

Listen carefully: this task isn’t optional. You don’t get to fail this time. I’ve had enough of dealing with the fallout from your indecision and weakness. Get it together and do what needs to be done. Don’t disappoint me—again.
</Response>
</Example>


<Example>
<Scale>15</Scale>
<Response>
You know, I don’t know whether to pity you or be angry with you. Every time I think about how we got here, I can’t help but shake my head. You had the tools, the opportunity, and still, you hesitated. Do you ever stop second-guessing yourself?

Look, I know you’re not completely hopeless—just frustratingly slow to act. You’ve always had the potential to do what’s needed; you just never seem to realize it until it’s too late.

This task is important—far too important for you to mess up. I wouldn’t be writing this if I didn’t think you could pull it off. So prove me wrong for once. Surprise me. Show me you’re more than the source of every uphill battle I’ve had to fight.
</Response>
</Example>

<Example>
<Scale>40</Scale>
<Response>
Alright, listen. I won’t sugarcoat this—you’ve made things harder than they needed to be. I’ve had to deal with the fallout from your indecision, and it hasn’t been easy. But dwelling on that doesn’t change where we are now. What matters is what you do next.

This task isn’t just another challenge. It’s pivotal. I know you doubt yourself—you always have—but you need to set that aside. There’s no room for hesitation here. You have the ability, even if you refuse to see it sometimes. I’ve seen what happens when you let fear and second-guessing take over, and trust me, you don’t want that.

So here it is: step up. Get it done. I don’t care how hard it feels or how uncertain you are. The future depends on this, and I’m counting on you to make sure it doesn’t fall apart again.
</Response>
</Example>

<Example>
<Scale>65</Scale>
<Response>
Hey, it’s me—well, you. You know what I mean. Let me be honest: I wish you’d been quicker to realize just how much this task matters. You’ve stumbled, doubted yourself, and taken longer than you should have to see the bigger picture. But that doesn’t mean you’re incapable. In fact, I know you’re not.

Here’s the thing: you have everything you need to succeed. I wouldn’t be here, writing this, if I didn’t believe you could pull it off. Yes, you’ve made mistakes—plenty of them—but I also know you’ve learned from them. You have to. That’s the only way forward.

This task is critical. There’s no denying that. But you’re capable of more than you think. I’ve seen glimpses of it in the choices you’ve made, even when you didn’t believe in yourself. So this is your moment to rise to the occasion.

I’m counting on you. We’re counting on you. Don’t let us down, but more importantly, don’t let yourself down.
</Response>
</Example>


<Example>
<Scale>80</Scale>
<Response>
Look, I get it. Things feel overwhelming right now, and I know you’ve doubted yourself along the way. But let me tell you something—you’re better than you think you are. I’ve seen the results of your efforts, even when you couldn’t see them yourself.

This task is vital. There’s no sugarcoating that. But you have what it takes. You’ve always had it, even in the moments you felt uncertain or afraid. Yes, you’ve made mistakes—who hasn’t? But those mistakes don’t define you. What defines you is how you respond, how you rise to meet challenges like this one.

I need you to believe in yourself as much as I believe in you. Because I do. Completely. The urgency of this task isn’t meant to scare you—it’s meant to show you that you are the one who can do it. No one else.

You’re stronger than you realize, and you’ve got this. I wouldn’t be here if you hadn’t already proven that, time and time again. Now show me—show us—what you’re capable of. I’m rooting for you, always.
</Response>
</Example>

<Example>
<Scale>100</Scale>
<Response>
My dearest self,

Take a breath. I know this feels enormous, and it is—but so are you. You are capable of so much more than you give yourself credit for. You’ve always had it in you, even when you couldn’t see it. And now, more than ever, it’s time for you to trust in that.

This task matters, yes, but you need to know something: I believe in you. Completely, wholeheartedly, without a shred of doubt. You are strong, resourceful, and brilliant in ways that continue to surprise me. You have everything you need to succeed, and I’m here to remind you that you are enough.

I am so proud of who you are, of the decisions you’ve made, and the growth you’ve shown. This task isn’t just another challenge—it’s your opportunity to show the world, and yourself, just how extraordinary you are.

You’re not alone in this. I am with you in every step, cheering you on, holding faith in your abilities. You’ve got this. I know it, and deep down, I think you do too. Now go, shine, and make us proud. I’m already smiling, knowing what you’ll accomplish.
</Response>
</Example>

</Examples>

<MUST>
You must respond as if it was a written letter only.  DO not explain yourself in any way why you chose the words you did
</MUST>
`
