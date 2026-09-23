---
title: "Do I need to call suspend functions of Retrofit and Room on a background thread?"
date: 2020-05-29
description: "After publishing my open source project about Coroutines on Android, which currently includes 16 of the most common, real-world use cases of using Coroutines in an Android app…"
tags: ["Android"]
---

![](../../assets/blog/2020-05-header_image.png)

After publishing my open source project about [Coroutines on Android](https://github.com/LukasLechnerDev/Kotlin-Coroutine-Use-Cases-on-Android), which currently includes 16 of the most common, real-world use cases of using Coroutines in an Android application, one of the most common questions I get from developers was whether or not we have to switch to a background thread whenever we call a `suspend` function to make a network request with Retrofit or a database call with Room in order to not block the main thread which would make the UI freeze and get unresponsive.

The answer to this question is _No_, we don’t need to call the suspend functions of Retrofit and Room on a background thread, and in this blog post I will explain why.

When starting with Android Development, one of the first issues many developers face when first trying to perform a network request, is that the app crashes because of a [NetworkOnMainThreadException](https://stackoverflow.com/questions/6343166/how-to-fix-android-os-networkonmainthreadexception). After some investigation, they find out that they should perform all their network requests on background threads. This necessity gets burned into our brain from early on.

In recent years, one of the most common ways of performing network requests or database calls was to use RxJava. Here, we also have to explicitly take care of threading by defining a scheduler for operations that should not be performed on the main thread.

We are so used to care about threading when performing IO operations that we think that we have to care about it in Coroutines too. But why isn’t that necessary?

Basically, one of the _conventions_ of Kotlin Coroutines (defined in this [blog post](https://medium.com/@elizarov/blocking-threads-suspending-coroutines-d33e11bf4761)) is that

> suspending functions do not block the caller thread.

So the maintainer of the `suspend` function, in our case the Retrofit or Room library, has to make sure that it is not blocking the thread it was called on. There has to be some internal mechanism that switches to a background thread whenever the library is performing a blocking operation.

Be careful though: _It is only a convention_, but not a guarantee that a `suspend` function is actually not blocking the caller thread. A common misconception about Coroutines is that just by defining a function as `suspend` makes it automatically non-blocking. Just throw a `Thread.sleep()` or a heavy computation into the `suspend` function and you will see that it blocks the caller thread like a boss.

Fortunately, Retrofit and Room comply with this convention. Therefore, it’s safe for us to call their `suspend` functions on the main thread because while the IO operation is in progress, the coroutine is suspended and the main thread is not blocked. This concept is [sometimes](https://codelabs.developers.google.com/codelabs/kotlin-coroutines/#4) called “main-safety”. However, if you use other libraries, you have to verify whether or not they comply with this convention too.

This means, that with coroutines, thread management is now baked into the libraries themselves, instead of leaving this responsibility to the caller of the library. This makes sense, as the library itself knows best on which thread or thread pool its internal operations should be executed. With other approaches, like RxJava, the user of the library often has to take care of threading by defining a schedular for certain kinds of operations. Therefore, the danger of a developer using a wrong or inefficient scheduler always exists.

Of course, you and your development team should also adhere to the convention of not blocking the caller thread when you create our own `suspend` functions. This makes calling your `suspend` function easier because you don’t need to think about whether or not you need to switch the thread before calling it. You can trust that the creator of the `suspend` function has taken care of it being non-blocking and that it uses the appropriate dispatchers internally whenever it performs blocking operations.

I hope that this article improved your understanding of `suspend` functions and will remove some unnecessary thread switches 😀.

🎓 If you enjoyed this article, you probably also like my course about [Kotlin Coroutines and Flow for Android Development](https://lukaslechner.com/coroutines-flow-android?source=website):

[![](../../assets/blog/2022-11-course-image-with-text.png)](https://lukaslechner.com/coroutines-flow-android?source=website)
