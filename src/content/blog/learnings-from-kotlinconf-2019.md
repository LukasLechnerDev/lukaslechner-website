---
title: "Learnings from KotlinConf 2019"
date: 2019-12-12
description: "I attended KotlinConf for the first time this year and was really excited to fly to Copenhagen and see what’s going on around Kotlin."
tags: ["Kotlin", "Talks"]
---

I attended KotlinConf for the first time this year and was really excited to fly to Copenhagen and see what’s going on around Kotlin. As usual, I am going to write about the things I learned at this conference.

## Current Development of Kotlin

Andrey Breslav announced in the opening keynote, that the next version of Kotlin will be 1.4 and is planned to be released in the Spring of 2020. For this release, the Kotlin team will mostly focus on improving the quality and performance of the language. We can expect things like faster code completion, faster and less memory consuming gradle imports and Kotlin/Native compilation speed-ups.

One of the biggest current pain points of the toolchain is the slow build speed. To address this, Jetbrains is working on a new, completely reimplemented compiler, that is said to be 4–5 times faster. It will also uniform the three different compiler backends (JVM / JS / Native). This provides an API for compiler extensions, making plugins that work for all platforms possible. Although this API won’t get shipped in 1.4 there are already projects that work with that API to create a compiler backend plugins (e.g. Jetpack Compose — the new UI framework for Android)

_Andrey Breslav at the opening keynote talking about that Kotlin is not only a programming language but a large ecosystem_

A new feature in 1.4 will be “functional interfaces”, for which Kotlin will do a SAM conversion when they get passed to a function. SAM conversions currently happen only for Java Classes and Interfaces. A verbose object declaration is needed in Kotlin currently.

Object declarations necessary in Kotlin 1.3:

```kotlin
interface Action {
    fun run()
}

fun runAction(a: Action) = a.run()

fun main() {
    runAction(object: Action{
        override fun run() {
            println("Hello, KotlinConf!")
        }
    })
}
```

Functional Interfaces in Kotlin 1.4:

```kotlin
fun interface Action {
    fun run()
}

fun runAction(a: Action) = a.run()

fun main() {
    runAction {
        println("Hello, KotlinConf!")
    }
}
```

## Current State of Kotlin Multiplatform

With the new support of TvOS and watchOS, Kotlin/Native can now run almost everywhere. Jetbrains is working on extending the set of multiplatform libraries by, for instance, an urgently needed Date library. One exciting feature that will be coming in 2020 is a plugin for Android Studio which allows running, testing and debugging iOS apps on iOS simulators and devices written in Kotlin. According to some hints during the keynote and the closing panel, it seems that Jetbrains is also working on making it possible to develop Android and iOS apps from within a single IDE. This highlights their high investments in Kotlin Multiplatform, especially for mobile. Learning materials for mobile multiplatform got updated and improved and can be found here: [https://www.jetbrains.com/lp/mobilecrossplatform/](https://www.jetbrains.com/lp/mobilecrossplatform/)

The agency “Ice Rock” already builds every mobile application nowadays with Kotlin Multiplatform. Alexandr Pogrebnyak talked about their set of multiplatform libraries: [https://moko.icerock.dev/](https://moko.icerock.dev/). The most interesting one is probably moko-widget, which allows the declaration of UIs for Android and iOS from within common code. The goal is that a developer that e.g. has only experience in Android should be able to write UI for both platforms in common code.

It was also interesting to see that other big companies like Square, Autodesk, and Careem already have a lot of multiplatform code in their production apps and in their talk I learned a lot about their learnings and challenges in using it.

Kevin Galligan talked about how concurrency works in Kotlin/Native. The memory model is more restrictive than on the JVM, meaning that it is not possible to share state between different threads. Objects must be frozen if they are accessed between threads. The big issue currently is that there are no multi-threaded coroutines available for Kotlin/Native so you have to work with low-level concurrency primitives like Workers. However there is was a draft pull request [https://github.com/Kotlin/kotlinx.coroutines/pull/1648](https://github.com/Kotlin/kotlinx.coroutines/pull/1648) opened, so they can be expected in the near future.

## Kotlin Multiplatform in Action: Jetbrains Space uses “Full Stack Kotlin”

The last talk of the first day was a new product announcement from Jetbrains: [Jetbrains Space](http://jetbrains.space/). It is an “integrated team environment” that supports all of the collaboration and development processes in your team. It is a tool that combines features of several tools like Gitlab, Slack, and Confluence together with some powerful IDE integrations and an open API that allows plugin development. Jetbrains really leveraged Kotlin Multiplatform for the development of Space. They said that they are able to share up to 70% of the code between the Kotlin-React Web Frontend, the ktor-based Backend and the mobile apps for Android and iOS. This shows that Jebrains really has “skin in the game” for their multiplatform endeavors.

## Kotlin Flows

At some point in his talk, Roman Elizarov said that “Kotlin suspending functions combined with Reactive Streams is the best thing imaginable on earth.” I learned how Flow is different from other reactive stream implementations like RxJava or Project Reactor.

Flow is said to have an easier API because it does not have that many operators that you need to learn. Instead, Flow provides only core operators that can be composed and combined. Roman claimed that Flow is much faster than other implementations, based on a benchmark that can be found here: [https://github.com/Kotlin/kotlinx.coroutines/tree/master/benchmarks/src/jmh/kotlin/benchmarks/flow/scrabble](https://github.com/Kotlin/kotlinx.coroutines/tree/master/benchmarks/src/jmh/kotlin/benchmarks/flow/scrabble).

Flow has this feature called “Context Preservation”. It means that it is guaranteed that the result will be dispatched to the initial thread. There is no possibility that some operator changes the thread on which work happens “downstream”, like e.g. the `observeOn` operator of RxJava. Finally, “Structured Concurrency” makes the management of the lifecycle of a stream much easier. In other reactive streams implementations, you have to manage your subscriptions manually and must not forget to cancel them when necessary. With Flow, you have to always provide a coroutine scope, so there is no chance to forget about lifecycle management.

## Kotlin in General

Based on the quote that “If you only have a hammer, you tend to see all your problems as a nail”, Huyen Tue Dao talked about not using the golden hammer (a shiny Kotlin language feature) for every problem that you perceive as a nail. These hammers are features like leaving out the type declarations because of type inference, using `it` in lambda functions instead of parameter names, the overuse and nesting of scope functions like apply or with and the overuse of extensions functions.

These features should be used, of course, but over- or misusing them can lead to source code that is bad from a readability, reusability and maintainability perspective.

## Java

Yes, that’s right! I learned something new about Java at KotlinConf. Jake Wharton gave a talk about how Java will improve in the next 3 years and whether or not we still need Kotlin then. And although Java will improve in the upcoming years (e.g. introducing “records” that will have the functionality of data classes, sealed interfaces), there are still things that do not get addressed like nullability or a new concept like coroutines for concurrency. Jake’s opinion is that we probably still want to use Kotlin in 3 years, especially because Kotlin will improve in the following years as well and allows to develop for multiple platforms.

_Jake Wharton asking the question if the end of Kotlin is near? Probably not …_

## Software Development in General

Christina Lee talked about the bottom layers of an “extended testing pyramid” that she showed (see picture below). These layers are below the classic unit and integration tests and not many people speak about them from a testing perspective, although they allow us to find issues much cheaper and much earlier than traditional tests. These “tests” include things like a strong type system and a functional programming style with immutable objects and pure functions in your applications. The good thing is that Koltin supports both of these features as a statically typed language that supports functional programming constructs.

_Chrisina Lee talking about the bottom layers of the “extended testing pyramid”_

## Summary

KotlinConf was an epic conference. I was really impressed by the high-quality talks. It became clear that Jetbrains is putting a lot of work into making Multiplatform development a success. It was also interesting to see that Kotlin can be used almost anywhere — Mobile, Web, Native, Backends, Data Science, Gradle, etc. The whole organization, the awesome food, and the party were just top-notch as well. See you next year 🚀 !
