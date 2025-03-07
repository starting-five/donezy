# donezy




Random thoughts: 
Service Titan

MVP things:
As a business owner:<br>
  1.) I want to be able to upload before, during and after photos of a jobsite <br>
  2.) Upload pictures of materials used

As a homeowner/clinet: <br>
  1.) I want to be able to see my before, during and after pictures <br>
  2.) I want to easily share the photos with my friends so I can show them how great my backyard looks

Architecture : <br>
  Front end: Maybe not needed <br>
  Backend : AWS to store photos, somehow needs to be tied to a clients name under the correct business.


  Other things we spoke about:
  Sending invoices via a link
  Scheduling
  Eventually a front end

Things to consider:
  There are two way we can approach this project.
  - Approach 1: We can do it from a backend perspective to create the APIs to handle storing pictures but getting them would require another API call, which will not be straightforward for customers who are not tech savvy.
  - Approach 2: We can create a frontend from the start and do things manually as in create a static html page that contains all the before and after pics. Pros: easy to build, we'd have a complete view of what the actual product will look like, we'd be able to get customer feedback as we build the backend. Cons: every time we have a new job to post, we'd have to manually add them to our source code which means that a system reboot is needed. This would cost our system to go offline but since we don't have a heavy number of users initially, this may not be a big issue for us.



Created on March 3, 2025
