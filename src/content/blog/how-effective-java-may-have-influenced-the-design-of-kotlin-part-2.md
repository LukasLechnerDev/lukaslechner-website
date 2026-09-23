---
title: "How “Effective Java” may have influenced the design of Kotlin – Part 2"
date: 2017-01-28
description: "This is the second part of the blog series about how the book “Effective Java” may have influenced Kotlin’s design."
tags: ["Kotlin"]
---

![](../../assets/blog/2017-01-DSC00930_small.jpg)

This is the second part of the [blog series](../how-effective-java-influenced-the-design-of-kotlin-part-1/) about how the book [“Effective Java”](https://www.amazon.com/gp/product/0321356683/ref=as_li_tl?ie=UTF8&tag=lukle-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=0321356683&linkId=8ec63da61faf8c3b6114ea35d8f13208) may have influenced Kotlin’s design. Before continuing, take a look on the [first part](../how-effective-java-influenced-the-design-of-kotlin-part-1/) if you did not already read it.

## 6\. Final classes by default

Item 17 in “Effective Java” suggests that every class should either not be sub-classable or be carefully designed and documented to support inheritance. In Java, every class can be subclassed unless you explicitly specify the class as `final`. If you forget to make the class `final` and fail to design and document it for inheritance, there will be trouble when clients think that they can create subclasses, override some methods and assume that everything will still work as expected.

In Kotlin, every class is `final` by default. You must explicitly use the keyword `open`, which is the exact opposite of Java’s `final`, to allow the class to be capable of inheritance. This prevents the creation of non-final classes that are not consciously designed for inheritance.

Not everyone in the Kotlin community is happy about the “final by default” design choice. There is an [ongoing discussion](https://discuss.kotlinlang.org/t/classes-final-by-default/166) in the [Kotlin forum](https://discuss.kotlinlang.org/) about this controversal topic.

Hot news: the [recently announced](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-beta-is-here/) Kotlin version 1.1 beta provides a compiler plugin for making classes open by default!

## 7\. No checked exceptions

Java has a feature known as checked exceptions, where the compiler forces the caller of a function to catch (or re-throw) an exception. This feature is often problematic. “Effective Java” has a whole section on how to properly use and handle checked and unchecked (runtime) exceptions. One problem of checked exceptions, as described in Kotlin’s [documentation](https://kotlinlang.org/docs/reference/exceptions.html#checked-exceptions), is that you sometimes have to catch exceptions that can never occur. This results in empty catch blocks and verbose code. Even worse is that developers often get annoyed when they are forced to respond to possible exceptions, causing them to just ignore them, also resulting in empty catch blocks. Item 65 says “Don’t ignore exceptions”.

According to Item 59, checked exceptions are often unnecessary and should be avoided by checking the state of an object before calling a specific function on it or by a distinguished return value like `null`.

During my research, I have discovered many other issues with checked exceptions:

*   the throws clause adds implementation details to an interface, which is bad;
*   versioning can be problematic; if you change your implementation and add a throws clause to a function, you have breaking API changes
*   the calling function should not dictate how the caller performs itsexception handling

Because of the large number of potential problems, Kotlin and other great programming languages such as C#, don’t have checked exceptions. To make the caller aware of possible exceptions, you should define those in the [kdoc](https://kotlinlang.org/docs/reference/kotlin-doc.html) documentation of the function with the `@throws` tag.

## 8\. Forced Null-Checks

In Java, the method signature of a public method does not tell you if a returned value can be null or not. Take this signature for instance:

```kotlin
public List<Item> getSelectedItems()
```

What happens when no item is selected? Does this method then return null? Or does it return an empty list? We do not know for sure without looking into the implementation of this method (except we are very lucky in this case that the signature has a good javadoc description of the return type). There are two mistakes a developer could possibly make: (1)fForgetting to check the return value for null when it can be null, resulting in the famous `NullPointerException`, or; (2) checking it for null although it never can be null, resulting in needless code.

Joshua Bloch suggests in Item 43 to always return an empty array of collection instead of null. This item brought me to the idea of nullable and non-nullable types. With Kotlin’s [null safety](https://kotlinlang.org/docs/reference/null-safety.html), you know whether the returned value can be null or not. Take the example above: a return type `List<Item>?` would mean that it can be null, whereas `List<Item>` would mean that it cannot be null. If it can be null, the compiler then forces us to check it for null before accessing its properties or calling its functions. So the stronger type system of the compiler prevents the developer from making mistakes. Life can be so easy.

## 9\. No Raw Types

Generics were added to Java in version 1.5, and they can be a nice way to accomplish type safety. To allow backwards compatibility, raw types can still be used but Joshua Bloch recommends in Item 23 to always use generic types instead (`List<Integer>` instead of `List`) to avoid `ClassCastExceptions`. Kotlin does not allow raw types, so you always have to specify the type parameter of the generic Type, resulting in more type-safe code.

## 10\. Easier way of defining variance

Item 28 discusses the use of bounded [wildcards](https://docs.oracle.com/javase/tutorial/extra/generics/wildcards.html), which are very tricky and hard to understand in Java. Joshua Bloch defines the PECS mnemonic (Producer extends, Consumer super) to help you decide whether to use `<? extends E>` (covariance) or `<? super E>` (contravariance). The Kotlin team worked hard on making variance handling easier. They got rid of wildcards and, like C#, provide the keywords `in` for covariance and `out` for contravariance. This blogpost is too short to explain how these keywords work in detail, but if you are interested you can look up for [Declaration-Site variance](https://kotlinlang.org/docs/reference/generics.html#declaration-site-variance), [Type Projections](https://kotlinlang.org/docs/reference/generics.html#type-projections) or [Generics](https://kotlinlang.org/docs/reference/generics.html) in general. According to their documentation, these keywords are more self explanatory and can be understood without remembering mnemonics.

## That’s it

So these are the 10 things from ”Effective Java” that, in my opinion, influenced the design of the Kotlin programming language. I am curious if you have further ideas on other aspects of how this awesome book has influenced Kotlin. I would really appreciate your comments! I wish you a great day!
