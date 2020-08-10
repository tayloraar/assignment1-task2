# sit725-assignment1

# Task Overview
Assignment overview:
Individual 12.5% (HD)
Of a total of 25% for assignment 1.

# Task Summary
HD Task
You must extend your P task to include the HD extension here. As you can see, the task is thesame except for the HD part, meaning that the minimum you have to complete is the non-bold part.
Each project requires you to write a very simple prototype to showcase your knowledge ofsoftware development.
The specification for each project’s prototype will be released in Week 2.

Complete the task on Ontrack by the due date indicated on Ontrack.
1.Provide the git URL of your application in the provided form.
2.The repository name MUST BE assignment1-task2 (if your repository has a different name,my bot will not be able to download it and you will fail the assignment) eggithub.com/alexbonti/assignment1-task2 and must be public.
3.Your final submission must be in the master branch, I will not check other branches, if your branch has a different name, my bot will not be able to start it.
4.If you push code into git after the due date, you will have marks deducted as per latesubmission
5.You don’t need to upload anything on Ontrack, just tick it completed once you are readyto submit.

The application has to start by using npm start - we will look at this in Practical n3

Form for git url https://forms.office.com/Pages/ResponsePage.aspx?id=7Hgj0IgW1UaFQBwotfRw9r5RsTRtbJJNtv9171u_wfdURVY2MUdTMlVXM1BMTjFQMzFBNk1JV1ZXUS4u

You are to create a small web application with the specifications provided here, depending onthe project that you were assigned.
Remember that you can only use the technologies allowed in the unit. If you don’t remember, please check the Lecture Slides 1.
The application has to work, the quality and well functioning will decide your grade for this Task

# Instagram
Create a simple view where you can see pictures and descriptions, with some comments on them.
Allow the system to let the user be able to create a new post and show it on the screen, this should include a description.
HD - create the system using a DB (I suggest Mongo Atlas)

# Notes to self:
- Maybe think about how the data will be stored in the database?

        Post{
            >User Key?
            >Image URL
            >Caption
            >Comments{
                Comment Array?
            }
        } 
        Will this work? Consider?

- Three other thigns to consider on the DB end:
1. Do I try and let the user 'post' images as an extra stretch?
2. Do I try and get the app working using promises?
3. What about a socket?
