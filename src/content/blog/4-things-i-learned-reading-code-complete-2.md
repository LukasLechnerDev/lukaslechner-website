---
title: "4 things I learned reading Code Complete 2"
date: 2016-12-11
description: "Code Complete 2 from Steve McConnell surely belongs to one of the bibles of software development."
tags: ["Books"]
---

![startup-593327\_1280](../../assets/blog/2016-12-startup-593327_1280_thumb.jpg "startup-593327_1280")

[Code Complete 2](https://www.amazon.com/gp/product/0735619670/ref=as_li_tl?ie=UTF8&tag=lukle-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=0735619670&linkId=1d719b37bb16d0125a4ff713323d1285) from Steve McConnell surely belongs to one of the bibles of software development. A lot of developers recommended this book to me and so I decided to read it and write about four things that I learned from this book that are valuable in my day to day Android development adventures. In my opinion, it is very important to spend some time reading books that deal with the basics of software construction. As Android developers, we are always tempted to only spend time learning new shiny technologies or libraries like RxJava2 and forget to learn or relearn the foundation of all programming: Writing clean, readable and maintainable code. Although this book is a little bit old (2004), most of the contained knowledge applies to current software development processes and programming languages.

## 1) Manage and Conquer Complexity

![brain-1845941\_1280](../../assets/blog/2016-12-brain-1845941_1280_thumb.jpg "brain-1845941_1280")

One of the most important jobs as a developer is to keep the complexity of your code as low as possible. In my opinion, the very best developers are those who understand that the capacity of our brains is limited and are able to keep the complexity of their source code low and the readability and understandability high. Steve McConnel even says that managing complexity is “the software’s primary technical imperative”. But how can we achieve that?

### Abstraction

The history of software development has shown that abstraction can drastically reduce complexity. In the early days, a programmer had to spend his time writing complex machine code and assembly language instructions. Later, new higher level languages like C, C++ and then Java entered the building and made software development less complex. This is due to abstraction of lower levels of systems. But how can we as Java or Kotlin developers introduce some abstractions?

#### Classes

Steve McConnel states that the single most important reason to create a class is to reduce a program’s complexity. One goal of any software developer should be, to be able to safely ignore a big portion of your code while working on any other section of your code. If you are writing a class, you should hide the internal data and the implementation details as much as possible and reduce the accessibility to methods of your class as much as possible. Clients of your class should know how it works by simply reading their interface in form of its public method names, parameters and documentation. Method names and parameters should have the proper level of abstraction. The user of your class does not care if you save your objects in a stack or a queue. Classes should have one single responsibility (see [SOLID](https://en.wikipedia.org/wiki/SOLID_\(object-oriented_design\))). If it has more than one, then split it up into more classes.

Checklist for creating good classes:

*   keep the accessibility of your fields and methods as low as possible. (private –> protected –> public)
*   design a good interface that abstracts away the internal data structure and implementation details
*   do not create classes with more than one responsibility

So spend your time creating good classes to manage complexity. There is nothing more productive and satisfying than having a good class that you can always easily reuse in the future without the need of understanding its inner workings  every time again.

#### Methods

Another way to reduce complexity and to improve the intellectual manageability is to create methods. A method should hide information so that you won’t need to think about it. After you have written the method, you should be able to forget the details and use it without any knowledge if its internal workings. Methods should also only have a single responsibility.

## 2) Most common risks in software development

![notes-514998\_1280](../../assets/blog/2016-12-notes-514998_1280_thumb.jpg "notes-514998_1280")

The most common risks in software development are not technical problems but poor requirements and poor project planning. A typical software project has the following phases: Defining Requirements => Creating Mockups & Designs => Architecture (e.g. which libraries to use) => Construction. The important thing to understand is, that the earlier mistakes are introduced, the more expensive they are to fix. If a requirement was poorly defined, it is really expensive to fix it when the product has already been released. On the other side, a construction mistake (bug) is rather easy to fix later. Mistakes during the requirements phase can cost as much as 20 to 100 times more than mistakes during construction. So one part of our job as software developers is to educate the nontechnical people around us about the development process and that it is very important that a lot of time and effort gets spent on defining clear requirements that the customer actually claims. Attention to quality at the beginning of the project has certainly a greater influence on product quality than attention to the end.

## 3) Favor read-time convenience over write-time convenience

![sunglasses-1765585\_1280](../../assets/blog/2016-12-sunglasses-1765585_1280_thumb.jpg "sunglasses-1765585_1280")

Our main focus should be to make our code readable and understandable. Code is read far more often than it is written. During development, we are often tempted to create code in a way that is convenient while writing (global object, maximize scopes of variables, usage of event buses, …) but hard to understand, hard to debug and hard to modify for other developers (and even our future self). The effort we are putting into creating a good architecture and understandable names is not necessarily beneficial for us now, but for the readers of the code in the future. Team programming is more an exercise in communication with people than in communication with a computer.

## 4) Character & habits are more decisive than intelligence

![bieszczady-1002402\_1280](../../assets/blog/2016-12-bieszczady-1002402_1280_thumb.jpg "bieszczady-1002402_1280")Steve McConnell writes that the personal character and your habits are more deceive factors for being a superior programmer than simply being intelligent. A programmer needs to be humble and needs to understand that the size of his brain is limited. A humble programmer does not write complex code, but focuses on managing complexity (see 1) and writes understandable code. He is honest with himself and knows that a few weeks from now, he will forget almost everything about the code he is writing now. Understandable code has been shown to have fewer errors.

An exceptional software developer understands everything about his program. He does not compile to “see what happens” or to check if he should use > instead of >=. I am currently working on a big project, where compiling takes up to 3 minutes. This forces me to think very deeply while writing code instead of compiling every time to see what the program does. It is hard, but it definitively helps improve my programming skills.

Another habit that a great programmer should have is to understand every compiler warning instead of quickly suppressing it. There’s nothing more stupid than a long bug fixing session that could be easily avoided by simply reading and understanding the responsible compiler warning.

What helped me personally to grow as a software developer was to change the habit when I was confronted with a problem or bug. Previously I would have immediately looked at stackoverflow.com and copy-pasted some code to see if this fixes the problem. Nowadays I am thinking very deeply about the problem for myself. What does the error message mean? Why does it occur? Sometimes I inspect the Android source code to find some hints. Only after I have no more ideas for fixing the problem I switch to stackoverflow.com and search for answers. But now I do not mindlessly copy-paste solutions, but try to understand the real problem and the proper solution and fix the code myself.

## Summary

I hope you enjoyed reading the 4 things I learned in this book. In my opinion, [Code Complete 2](https://www.amazon.com/gp/product/0735619670/ref=as_li_tl?ie=UTF8&tag=lukle-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=0735619670&linkId=1d719b37bb16d0125a4ff713323d1285) is one of the compulsive readings that every software professional should read. It certainly improved my fundamental skills as a software developer.
