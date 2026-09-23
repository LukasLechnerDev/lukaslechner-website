---
title: "Experiments with Android WorkManager, our new reliable assistant for deferrable background work"
date: 2018-10-19
description: "At Google IO 2018, a new library from the Architecture Components of Android Jetpack, called Android WorkManager was presented."
tags: ["Android"]
---

[![](../../assets/blog/2018-10-DSC0834-2.jpg)](https://medium.com/@lukleDev/experiments-with-android-workmanager-our-new-reliable-assistant-for-deferrable-background-work-9baeb6bd7db3)

At Google IO 2018, a new library from the Architecture Components of Android Jetpack, called Android WorkManager was presented. Android WorkManager promises to simplify working with background tasks that get executed even after the application’s process got killed, which is currently really hard to do on Android.

This blog post captures my first experiments with Android WorkManager. The goal was to find out if a real-world problem in a mobile application could be solved in an easy way with the help of Android WorkManager.

### What is Android Workmanager?

Imagine Android WorkManager as your mobile application’s clever and reliable assistant. Certain tasks can be handed off to the assistant and you can tell him when and under which conditions these tasks should be executed. For example, you can tell the assistant to perform a certain operation only once or periodically every hour and he shouldn’t start the work until the device has an active network connection and isn’t low on battery. He will continue to execute these tasks even when the app was closed by the user or killed by the operating system.

WorkManager will independently and intelligently do the work for you in a way that depends on several factors. WorkManager could just use threads when the application’s process is still alive or use [JobScheduler](https://developer.android.com/topic/performance/scheduling), [Firebase Job Dispatcher](https://github.com/firebase/firebase-jobdispatcher-android#user-content-firebase-jobdispatcher-) or [Alarm Manager](https://developer.android.com/reference/android/app/AlarmManager) and [Broadcast Receivers](https://developer.android.com/guide/components/broadcasts) otherwise, depending on the API level of the device and whether your application comes with Google play services or not. That’s the real beauty of Android WorkManager. We define _what_ needs to be done without needing to specify _how_ it is actually done. I really like those new abstractions provided by Android Jetpack.

Above is a very high-level overview. You can find specific details in the [official documentation](https://developer.android.com/topic/libraries/architecture/workmanager/). I also highly recommend the [presentation](https://www.youtube.com/watch?v=IrKoBFLwTN0) from Google IO.

### Which tasks should be handed off to WorkManager?

It is really important to understand, that only a certain kind of background work is useful to hand off. Tasks that don’t need to be executed instantly, but need a guarantee to be executed even after your application’s process death are most suited to hand off to WorkManager.

> Q: Should you hand off the task of …
> 
> … performing a _network request and showing the results in an activity?_
> 
> … _parse data and update the content of a view?_

A: Nope, this needs to be done instantly and can be cancelled when the app’s process gets killed.

> Q: _What about handing off the task of_
> 
> … _sending logs to the server_
> 
> … _processing and syncing data_
> 
> … _upload images and videos_
> 
> … _parse data and store it in a database_

A: Definitively! These tasks do not have to be performed instantly but reliably even after the application is killed.

### A real-world problem

In our e-commerce application for ordering groceries online, we have a situation that is not optimal. When the user enters the checkout screen after adding some articles to the basket, a network request is performed to save an order in the backend. The user can then add vouchers to the order, where another request is performed and the order is updated.

If the user leaves the checkout screen by pressing the home button, the order needs to be reset by sending another request to the backend system. This request is necessary in order to release the vouchers that are attached to the order. If the order is not reset, the vouchers would be “reserved” by the backend system for several hours. The user wouldn’t be able to redeem them in another channel, like in a physical supermarket. This makes the user sad.

![](../../assets/blog/2020-01-dog.jpeg)

_a sad user who cannot redeem his vouchers_

The request to reset the order is currently performed in `onUserLeaveHint()`, so basically every time the user puts the app in the background. This approach works fine most of the time, except for one situation when the user is offline and puts the app into the background. Then this request will obviously fail and the users vouchers will stay “reserved”, disallowing them to be used elsewhere.

### Android WorkManager for the rescue

The goal of my experiments was to find out if WorkManager can help in situations where we must ensure that a network request is performed after the user closes the application, even if the device has currently no network connection.

## Implementation

### Adding the library to your project

Add the following dependency to your `build.gradle` file:

```groovy
implementation "android.arch.work:work-runtime-ktx:$workmanager_version"
```

Using `work-runtime` with the `-ktx` postfix that includes some Kotlin extensions allows you to work with WorkManager in a more Kotlin-idiomatic way.

Android WorkManager is under heavy development, so check out this [page](https://developer.android.com/topic/libraries/architecture/adding-components#workmanager) for the newest version number for `$workmanager_version` . I used `1.0.0-alpha09` and had some compilation issues because it uses [Room](https://developer.android.com/topic/libraries/architecture/room) 1.1.1 internally, but my module used Room 1.0.0. So I had to update Room to 1.1.1 in order to fix that compilation problem.

### Creating a worker

The first step is to create a `Worker` that defines _what_ needs to be executed. Therefore we need to subclass the `Worker` class and specify the work that needs to be done in the `doWork()` method.

```kotlin
class ResetOrderWorker(context: Context, workerParams: WorkerParameters) : Worker(context, workerParams) {

    @Inject
    lateinit var checkoutApi: CheckoutApi

    @Inject
    lateinit var orderRepository: OrderRepository

    override fun doWork(): Result {

        (applicationContext as? BaseApplication)?.daggerComponent?.inject(this)

        val response = checkoutApi
                .resetOrderSynchronous(orderRepository.getOrder())
                .execute()

        if (response.isSuccessful) {
            return Result.SUCCESS
        } else {
            if (response.code() in (500..599)) {
                // try again if there is a server error
                return Result.RETRY
            }
            return Result.FAILURE
        }
    }
}
```

As you can see, we inject the `checkoutApi` and the `orderRepository` with Dagger. Then we perform the network request to reset an order. We can perform it synchronously because `doWork()` will always executed in the background by WorkManager. Next, we check if the response was successful. In that case, `Result.SUCCESS` is returned in order to indicate that the specified work was successfully executed. Otherwise, `Result.RETRY` is returned in cases of a server error and `Result``.FAILURE` when receiving a response with a different HTTP status code.

Our Retrofit interface looks like this:

```kotlin
interface CheckoutApi {

    @PUT("reset-order")
    fun resetOrderSynchronous(@Body order: Order): Call<Response<Void>>   
}
```

As you see its sufficient to just return a retrofit `Call` instance, on witch we call `execute()`, because we are performing the request in a synchronous manner.

### Creating a WorkRequest and enqueue it to WorkManager

The following code shows how to create a `WorkRequest` with the `Worker`from above and hand it over to `WorkManager` . A`WorkRequest` defines how often and under which circumstances a `Worker` should be performed.

```kotlin
fun onUserLeaveHint() {
    val constraints = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
    
    val request: OneTimeWorkRequest =
            OneTimeWorkRequestBuilder<ResetOrderWorker>()
                    .setConstraints(constraints)
                    .addTag("reset-order")
                    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
                    .build()

    WorkManager.getInstance()
            .beginUniqueWork(ResetOrderWorker.tag, ExistingWorkPolicy.KEEP, request)
            .enqueue()
}
```

First, we create constraints for the `WorkRequest` . I our situation, the `Worker` should only be executed when the device has an internet connection. Additional constraints would be that the device is currently charging, idle, connected to a non-roaming network or not low on battery or storage.

Then we build a `OneTimeWorkRequest`, because the request only needs to be performed once. The other available request type is `PeriodicWorkRequest`. We set our previously created `ResetOrderWorker` as the type argument and also set the previous defined constraints. We also set a tag for this `WorkRequest` with the value “reset-order” and a `BackoffCriteria`, which specifies the conditions when retries should be performed when the `ResetOrderWorker` returns `Result.RETRY`. We set the policy to `EXPONENTIAL` and the initial`backoffDelay` to 30 seconds. From my understanding, a retry will start after the initial delay and this delay grows exponentially when the `Worker` keeps on returning `Result.RETRY` . So the first retry will happen after 30 seconds, the next after 60 seconds, the next after 120 seconds and so on.

After we `.build()`, the `WorkRequest` is enqueued it in the `WorkManager` . We also call `beginUniqueWork()` beforehand, to ensure only one `ResetOrderWorker` worker will run at a time. With `ExistingWorkPolicy.KEEP` we define that if a new task is enqueued, it will be thrown out and the existing one would be kept.

### Cancelling work

There is one problem we could run into. As a reminder: We need to perform a request to save the order directly after the user enters the checkout screen. When the user closes the checkout screen, the `ResetOrderWorker` will be enqueued and executed at some point in the near future. When the user then re-opens the checkout screen, it could happen that the request for saving the order is performed before `ResetOrderWorker` executes the request to reset the order. The order then has the status “reset”, but the correct one should be “saved”.

Therefore we have to cancel all work before performing the request to save the order:

```kotlin
    override fun onResume(){        
        with(WorkManager.getInstance()) {
            cancelAllWorkByTag("reset-order")
            getStatusesByTag("reset-order").observe(this@CheckoutFragment, Observer { statusList -> 
                if (statusList == null || statusList.isEmpty()) {
                    saveOrder()
                    return@Observer
                }

                val allWorkersFinished = statusList.all { status -> status.state.isFinished }

                if (allWorkersFinished) {
                    saveOrder()
                }
            })
        }
    }
```

We call `cancelAllWorkByTag("reset-order")` to cancel all workers with that specific tag. WorkManager exposes the statuses of its `Workers` with lifecycle-aware`LiveData` objects, so we pass an `Observer` instance to its `getStatusesByTag()` method to be able to observe status changes for every `Worker` with the tag “reset-order”. Due to the previous call of `beginUniqueWork()` on the `WorkManager`, only one `Worker` with the “reset-order” tag can be active at a time and therefore only the status of only one `Worker` can be observed. We continue to save our order as soon as the `ResetOrderWorker` has finished.

### Outcome

After some testing, it seems that our new solution for resetting orders works really well and is definitively an improvement over the old solution. It fully eliminates the described problem. Android WorkManager was really easy to learn and the API was extremely straightforward to use. It is still in alpha stadium, but I am excited and happy to have a reliable and easy to use background assistant available in the near future once WorkManager enters the stable state 🚀.
