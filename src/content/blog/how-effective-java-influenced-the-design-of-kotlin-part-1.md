---
title: "How “Effective Java” may have influenced the design of Kotlin – Part 1"
date: 2016-12-28
description: "Java is a great programming language but has some known flaws, common pitfalls and not-so-great elements that have been inherited from its early days (1.0 got released in 1995…"
tags: ["Kotlin"]
---

![](../../assets/blog/2016-12-screwdrivers-1073515_1920.jpg)

Java is a great programming language but has some known flaws, common pitfalls and not-so-great elements that have been inherited from its early days (1.0 got released in 1995). A well-respected Book on how to write good Java code, avoid common coding mistakes and deal with its weaknesses is Joshua Bloch’s [“Effective Java.”](https://www.amazon.com/gp/product/0321356683/ref=as_li_tl?ie=UTF8&tag=lukle-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=0321356683&linkId=92d90357e585584c81b56f9e2a75a3e1) It contains 78 sections, called “Items”, that give the reader valuable advice on different aspects of the language.

Creators of modern programming languages have a big advantage because they are able to analyze the weaknesses of established languages and make things better themselves. [Jetbrains](https://www.jetbrains.com/), a company that has created several very popular IDEs, decided in 2010 to create a programming language [Kotlin](https://kotlinlang.org/) for their own development. The goal of it was to be more concise and expressive while eliminating some of the weaknesses of Java. All the previous code for their IDEs has been written in Java, so they needed a language that is highly interoperable with Java and compiles down to Java bytecode. They also wanted to make it very easy for Java developers to jump into Kotlin. With Kotlin, Jetbrains wanted to build a better Java.

![Kotlin-500x111](../../assets/blog/2016-12-Kotlin-500x111_thumb-1.png "Kotlin-500x111")

While re-reading “Effective Java,” I found out that a lot of these Items are not necessary for Kotlin and the idea of this blog post series about how the content of this book may have influenced Kotlin’s design was born.

## 1\. No more builders needed with Kotlin’s default values

When you have a lot of optional parameters for a constructor in Java, the code becomes verbose, hard to read and error-prone. To help with that, Item 2 of Effective Java describes how to effectively use the [Builder Pattern](https://en.wikipedia.org/wiki/Builder_pattern). A lot of code is needed to construct such an object like the nutrition facts object in the code samples below. It has two required parameters (`servingSize`, `servings`) and four optional parameters (`calories`, `fat`, `sodium`, `carbohydrates`):

Instantiating an object with Java looks like this:

With Kotlin you don’t need to use a builder pattern at all because there is the feature of default parameters, which allow you to define default values for each optional constructor argument:

Creating an object in Kotlin looks like this:

For better readability, you can also name the required parameters `servingSize` and `servings`:

Like Java, the object created here is immutable.

We reduced the lines of code needed from 47 in Java to 7 in Kotlin, resulting in a huge productivity boost. Not bad!

![not\_bad](../../assets/blog/2017-01-not_bad_thumb.png "not_bad")

Tip: If you want to create the `KotlinNutrition` object in Java, you can do that of course, but you are forced to specify a value for each optional parameter. Fortunately, if you add the `@JvmOverloads` annotation, multiple constructors are generated. Note that if you want to use an annotation, we need the keyword `constructor` too:

## 2\. Easy creation of singletons

Item 3 of “Effective Java” shows how to design a Java object so that it behaves as a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern), which is an object where only a single instance can be instantiated. The code snippet below shows  a “monoelvistic” universe, where only one Elvis can exist:

Kotlin has the concept of [object declarations](https://kotlinlang.org/docs/reference/object-declarations.html#object-declarations) that gives us the behavior of a singleton out of the box:

No need to manually construct your singletons anymore!

## 3\. equals() and hashCode() out of the box

A good programming practice that has its origins in functional programming and simplifies the code is to mainly use immutable value objects. Item 15 contains the advice that “Classes should be immutable unless there’s a very good reason to make them mutable.” Immutable value objects are very tedious to create in Java, because for every object you have to override the `equals()` and `hashCode()` functions yourself. It took Joshua Bloch 18 pages to describe how to obey to the explicit general contract of these two methods in Item 8 and 9. For example, if you override `equals()` you have to make sure that the [contracts](https://docs.oracle.com/javase/7/docs/api/java/lang/Object.html#equals\(java.lang.Object\)) of reflexivity, symmetry, transitivity, consistency and nun-nullity are all fulfilled. Sounds more like math rather than programming.

In Kotlin, you can simply use [data classes](https://kotlinlang.org/docs/reference/data-classes.html) instead, where the compiler automatically derives methods like `equals()`, `hashCode()` and many more. This is possible because the standard functionality can be mechanically derived from the properties of your object. Simply enter the keyword `data` in front of your class and you are done. No 18 pages of description needed here.

Tip: Lately, [AutoValue](https://github.com/google/auto/tree/master/value) for Java became popular. This library generates immutable value classes for Java 1.6+.

## 4\. Properties instead of fields

Item 14 recommends the use of accessor methods instead of public fields in public classes. If you do not stick to this advice you could get into trouble, because fields are then directly accessible and you lose all the benefits of encapsulation and flexibility. This means that in the future you will be unable to change the internal representation of your class without changing its public API. For instance, you cannot limit values for a field, such as the age of a person, later. That is one of the reasons why we always create those verbose default getters and setters in Java.

This best practice is enforced by Kotin because it uses [properties](https://kotlinlang.org/docs/reference/properties.html) with auto-generated default getters and setters instead of fields.

Syntactically you access those properties like public fields in Java with `person.name` or `person.age`.  You can add custom getters and setters later without changing the API of the class:

Long story short: with Kotlin’s properties, we get more concise classes with greater flexibility out of the box.

## 5\. Override as mandatory keyword instead of optional annotation

Annotations were added to Java in release 1.5. The most important one is `@Override`, which marks that a method is overriding a method of a superclass. According to Item 36, this optional annotation should be constantly used to avoid nefarious bugs. The compiler then throws an error when you think you are overriding a method from a superclass but you actually do not. This works as long as you don’t forget to use the `@Override` annotation.

In Kotlin, `override` is not an optional annotation but a mandatory keyword. So there is no more chance for these types of nasty bugs. The compiler will alert you about these beforehand. Kotlin sticks to [making these kinds of things explicit](https://kotlinlang.org/docs/reference/classes.html#overriding-members).

## That’s it

Thanks for reading! This was part 1 of how [“Effective Java”](https://www.amazon.com/gp/product/0321356683/ref=as_li_tl?ie=UTF8&tag=lukle-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=0321356683&linkId=92d90357e585584c81b56f9e2a75a3e1) may have influenced the design of Kotlin.
