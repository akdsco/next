# App Audit & Comparison

 ### TodoListMe audit

 ##### Summary
 
 Download Audits (.pdf):
 
 - [Mobile](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_mobile.pdf)
 - [Mobile Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_mobile_4g_slow.pdf)
 - [Desktop](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_desktop.pdf)
 - [Desktop Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_desktop_4g_slow.pdf)
 
 TodoListMe is an application which allows user to:
 - create and name separate lists of to-do's
 - create and name categories
 - drag and drop lists into specified categories
 - add a new to-do item to lists
 - move to-do items to 'tomorrow' and 'later' sub category inside the list
 - edit current to-do items
 - clear completed items (delete)
 - sort to-do's (alphabetically,random, top 3)
 - sync and use to-do's across different devices (account facilities)
 - show mobile specific view
 - revert recent changes
 
 Application performs well when run on high speed internet connection. However, the performance on slower speed connections
 suffers significantly, especially on mobile devices, where it only receives 44 score in performance. The other major 
 low score is Accessibility, which is only 38 and that's across all four different audits. SEO and Best Practices are 
 ok but there's certainly room to improve.
 
 ##### Performance
 
 Desktop: `Score: 99/100`
 Desktop 4G Throttled: `Score: 67/100`
 Mobile 4G Throttled: `Score: 44/100`
 
 Performance figures when run on high speed internet (Desktop):
 
  | Metrics                          |  Time  |
  |----------------------------------|-------:|
  | First Contentful Paint           |   0.9s |
  | Speed Index                      |   1.4s |
  | Time to Interactive              |   2.4s |
  | Max Potential First Input Delay  |  180ms |
  | First CPU Idle                   |   2.4s |
  | First Meaningful Paint           |   1.2s |

 Performance figures when run on slow, 4G speed internet (Desktop):
 
   | Metrics                          |  Time  |
   |----------------------------------|-------:|
   | First Contentful Paint           |   1.5s |
   | Speed Index                      |   4.7s |
   | Time to Interactive              |   7.2s |
   | Max Potential First Input Delay  |  540ms |
   | First CPU Idle                   |   6.8s |
   | First Meaningful Paint           |   2.4s |
   
 Performance figures when run on slow, 4G speed internet (Mobile):

   | Metrics                          |  Time  |
   |----------------------------------|-------:|
   | First Contentful Paint           |   2.8s |
   | Speed Index                      |   6.0s |
   | Time to Interactive              |  10.8s |
   | Max Potential First Input Delay  |  870ms |
   | First CPU Idle                   |   9.9s |
   | First Meaningful Paint           |   2.8s |   
   
 If we compare the result, we can clearly see the slowdown. The application runs the fastest on Desktop with a high speed
 connection. The desktop slow 4G simulation shows slowdown and further decline on Mobile. Let's examine it in %:
 
 Percentage of slowdown - Desktop HS -> Desktop 4G Slow 
 
   | Metrics                          |    Time    |
   |----------------------------------|-----------:|
   | First Contentful Paint           | 40% slower |
   | Speed Index                      | 60% slower |
   | Time to Interactive              | 65% slower |
   | Max Potential First Input Delay  | 65% slower |
   | First CPU Idle                   | 64% slower |
   | First Meaningful Paint           | 50% slower |
   
 Percentage of slowdown - Desktop HS -> Mobile 4G Slow
 
   | Metrics                          |    Time    |
   |----------------------------------|-----------:|
   | First Contentful Paint           | 67% slower |
   | Speed Index                      | 76% slower |
   | Time to Interactive              | 79% slower |
   | Max Potential First Input Delay  | 79% slower |
   | First CPU Idle                   | 75% slower |
   | First Meaningful Paint           | 57% slower |
   
Main suggestions to improve performance:

- optimise images
- remove unused CSS rules
- preconnect required origins
- restructure JS code and deliver in trenches as needed
- change cache policy to a more efficient one
- limit the number of redundant third party code and try to load this code after page has finished loading
   
 TODO should I write more here ?
 
 ##### Accessibility

 `Score: 38/100`
 
 This metrics did not differ when performing audits on different devices and speeds. The score is quite low, 38/100. 
 There are a couple of things that need to be improved. As the internet grows and reaches many people, we need to 
 be aware that there are many users who access data available on the internet, alternatively. In order to make this 
 particular application more available, developer would need to:
 
 - change background and foreground colours so that they have sufficient contrast ratio
 - make all ID's on the page unique
 - add `<title>` to `<iframe>` and `<form>`
 - add alt attributes to all `<img>` tags
 - add lang attribute to `<html>` tag
 
 There are also many other things that can't be checked automatically. Manual checks that can be performed are listed 
 [here](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todolistme/todolistme_audit_desktop.pdf) on
 page 10.
 
 ##### Best Practice
 
 `Score: 71/100`
 
 - HTTPS
 
 As the internet grows and security flaws are discovered daily, we try to stay as secure as possible. In order to do so
 HTTPS connections are more and more common, even on websites that do not store any data. This application isn't using 
 the secure connection and therefore it's listed on the audit as a first thing. 
 
 - HTTP/2
  
 Another security upgrade is usage of HTTP/2 which is a newer way to transport data across the internet. In order to 
 use HTTP/2 (if server hosting website is ready for HTTP/2), there's a pre-requisite, which is HTTPS. As we know, this 
 application does not use it; therefore it can't use HTTP/2 either. It's something that can help bring security on this 
 page to a higher level.
 
 - @jQuery - vulnerable dependency
 
 It's crucial for both performance and security to use up to date software. Many times we only discover our code isn't 
 secure after we used it for some time. When we do discover that, a version with insecure code gets flagged and information 
 to all developers using it sent. Then it's developers job to update the software and close the open door to stop 
 possible attacks and data leaks. In case of this application, jQuery library should be updated. 
 
 ##### SEO
 
 Desktop: `Score: 78/100`
 Mobile: `Score: 64/100`
 
 There are a few things application developers could do to optimise this app search engine rankings.
 Search engine's enjoy having lots of data. In this case we're missing:
 
 - `<meta>` tags with initial scale
 - `alt` attributes for `<img>` we mentioned in the Accessibility section as well
 
 Additionally, the application received 64 score for mobile devices as the font sizes are not big enough for those small 
 devices and some buttons are smaller than 48px x 48px and therefore hard for thumbs to tap on without zooming in.

 ### Todos app audit
 
 ##### Summary
 
 Download Audits (.pdf):
  
  - [Mobile](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos_audit_mobile.pdf)
  - [Mobile Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos_audit_mobile_4g_slow.pdf)
  - [Desktop](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos-audit-desktop.pdf)
  - [Desktop Throttled -- 4G Slow Sim](https://github.com/akdsco/todo-list-enchance/blob/master/audits/todos-fixed/todos_audit_desktop_4g_slow.pdf)
 
 Application allows users to create a simple list of to-do's. It stores data locally in client browser. It allows item 
 edits. It's simple implementation and lack of ads displayed with it, alows a maximum performance on both mobile and 
 desktop devices and on slower networks as well.
 
 ##### Performance
 
 Desktop: `Score: 100/100`
 Mobile: `Score: 100/100`
 Desktop 4G Throttled: `Score: 99/100`
 Mobile 4G Throttled: `Score: 99/100`

 
 | Metrics                          | Time |
 |----------------------------------|-----:|
 | First Contentful Paint           | 0.3s |
 | Speed Index                      | 0.3s |
 | Time to Interactive              | 0.4s |
 | Max Potential First Input Delay  | 40s  |
 | First CPU Idle                   | 0.4s |
 | First Meaningful Paint           | 0.3s |
 
 The stats are impressive, application loads extremely fast. It's mostly due to its simplicity, as it does not need to 
 connect with servers and databases. It's simple and powerful. The stats above are from a non throttled desktop-based 
 audit. However, even when throttled, it performs extremely fast, in ranges of 0.1-0.4s. One of the reasons it works
 so efficient is because there are no additional files or adds that need to be downloaded, which would result in worse
 performance.
 
 There are few suggestions to improve applications performance. However, the gains are marginal. 
 Some of those suggestions:
 - change priority for assets load
 - keep request counts low, and transfer sizes small
 - minify JS - Potential 12KB Savings
 - remove unused CSS - Potential 8KB Savings
 - enable text compression - Potential 25KB Savings
 
 ##### Accessibility
 
 All: `Score: 60/100`
  
 There is one issue which needs to be addressed to improve accessibility. `<Form>` tags need to have `<label>` tags
 associated with them. If those tags interfere with design, `<aria-label>` should be used. This way, readers will read
 them and users who see the page, won't see any label. Since UI is made in an intuitive way to input to-do's, a 
 visible label is obsolete.
  
 ##### Best Practice
 
  All: `Score: 86/100`
 
 There are two problems when it comes to best practice:
 
 - HTTP/2
 
 The application runs locally and we have little power over how server handles the connection. It's possible to influence it but
 it isn't as straightforward as simply installing a missing module. For the sake of clarity, I'd recommend to leave it as
 is. However if you'd like to improve this, possibly explore HTTP/3 which has been added to major browsers in September 
 2019
 - Browser errors logged
 
 Application's dependency `todomvc-common` is missing `learn.json` file. 
 In order to delete this message, an empty json file needs to be created in root folder of this project. 
 
 ##### SEO
 
 Desktop: `Score: 75/100`
 Desktop: `Score: 60/100`
 
 SEO can be improved by adding `<meta>` tags with viewport and initial-scale attributes. Also, we need to add meta 
 description tag to describe what is this application about, to help search engines understand it better and send it to 
 people who search for similar applications. Mobile version also needs to adjust font sizes properly as some of them
 render smaller than 12px, which is below the border for users to see without zooming in. Some buttons are smaller than
 48px and therefore not easily clickable with thumb without zooming in either.
 
 ### TodoListMe vs. Todos (comparative summary)

 ##### Summary
 
 Both applications run well. However, a huge difference is visible on mobile devices with slower speed internet 
 connections. Difference in performance is significant. Therefore I'll focus on comparing 4G simulated slower speed 
 results.
 
 ##### Performance
 
 | Metrics                          | Todos | TodoListMe | Todos faster |
 |----------------------------------|------:|-----------:|-------------:|
 | First Contentful Paint           | 1.7s  |    2.8s    |        39%   |    
 | Speed Index                      | 1.7s  |    6.0s    |        71%   | 
 | Time to Interactive              | 1.8s  |   10.8s    |        83%   | 
 | Max Potential First Input Delay  | 50s   |    870s    |        94%   |
 | First CPU Idle                   | 1.7s  |    9.9s    |        82%   |
 | First Meaningful Paint           | 1.7s  |    2.8s    |        39%   |
 
 As we can see, Todos is diametrically faster. There are a few key differences:
 
 - it's a smaller application with client-side "database"
 - it does not have to load any additional code, e.g. adds
 - it has much less features, therefore less lines of code to execute
 - it does not connect with any other API's e.g. twitter, facebook, google, oAuth
 
 The main issue driving TodoListMe performance down are advertisements that are injected using `document.write()` method.
 For users on slow connections, external scripts dynamically injected via mentioned method, can delay page load by tens 
 of seconds.

 Additionally, the TodoListMe App isn't specifically mobile-ready. It isn't designed with mobile-first approach. This is
 a major thing in 2020, and it should be changed first, in order to keep up with other competitors. Todos stands out with
 it's clean design, yet it looses massively on other fronts like features, as it certainly has not many.
 
 ##### Accessibility, Best Practice, SEO
 
 These are the areas that can't be specifically and quantifiably compared.