# cry for help
If you are reading this, I am really stuck on adding one last (but important) feature to my game that my boss really really wants.

To explain the game, it is essentially just snake, but adapted to help with the onboarding process at Endeavor. The goal is that instead of the "apple", the player will be chasing a photo of an employee here at the office. Once the snake reaches the photo/apple, the sidebar updates with a fun fact about that employee from a csv. Most of it is working, but I can't get the photo to work. The problem is that in the original code, I (ChatGPT) had the information from the csv chosen in the checkCollision function, therefore once the player reaches the apple. Since the photo of the person matching the fun fact needs to be there from the beginning (or after the previous collision). I have tried to fix this for weeks, but I think that things are just not being parsed or indexed correctly. Please help.

# The files:

## important ones

### index.html
contains the html with the frame for the game. It also includes javascript for the sidebar that populates with fun facts as the player plays the game. you can change which version of the game is being played by changing the javascript file being used in the canvas here.

### index2.js
this contains the working game, minus the photo. instead, the user chases our company logo. everything here functions (mostly) properly

### indeximg.js
my attempt at trying to change when the employee information is selected so that their photo can be used. it does not work.

### temp.csv
the data used for index2

### temp2.csv
the same data as temp but including the photoUrl column (doesn't lead to legit images, just two test images)


## used but not super important

## lian and nathan.jpeg
trial image files. i only have two to use for now, so I just distributed them evenly between all the employees

## json files
idk what these do tbh but i think those are making my parse library work

## style.css
self-explanatory tbh but i actually don't think it works LOL i had to add a bunch of style code to the html directly

## unused

### index.js
outdated, please ignore

### responses.csv
OUTDATED: the original employee information being used for this prototype. i cleaned the data in SQL afterwards