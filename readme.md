# Cinema Room
# Created by Tyian Lashley
# Capstone Project: Final Grade (A)
# Any copying of the code in this repo without permission is strictly prohibited
# About Cinema Room
Cinema Room is a webapp that allows one to lookup movies and write reviews. Users can search for movies, view top 10 titles, and more. Users also have the ability to see the movies they have reviewed.
Made possible with TMDB - The Movie Database.
## Instructions
## Prereqs
You need to have mongodb and node install on your machine before running the program.
## Step 1
Clone the repo using git clone https://github.com/Grimlin238/cinemaRoom.git
## restore mongodb database
Restore the database from the dump folder using mongorestore dump
## Step 3
In a separate shell, start the mongodb service using your prefered method. Here's how to start using homebrew.
brew services start mongodb-community@7.0
## Step 4
Head back to the other opened shell, navigate to the project folder and type node index.js. You will see a worning pertaining to no mongo no longer using unified typology. You can ignore that. As long as you see I'm running on port 8080, you can move to the next step. 
## Step 5
Go to http://localhost:8080/ and create an account or login with one that's already there.
