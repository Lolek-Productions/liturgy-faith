The Story of liturgy.faith

Introduction:



Features:
-Petitions
-Ministers (contact information)
-Liturgy Planning - what prayers, what preface, what are the reading choices, what are the readings themselves.
-Worship Aid
-Follow Along for new people
-Musical Numbers - for planning andd communiication
-Readings - Weddings, funerals, 
-Calendar



Readings - liturgy-readings (public)
https://github.com/fr-mccarty/liturgy-readings

The php reading helper is as follows: 
https://github.com/fr-mccarty/liturgy-readings/blob/master/app/Helpers/ReadingHelper.php

https://github.com/fr-mccarty/liturgy-readings/blob/master/resources/views/livewire/wedding-readings.blade.php





Create an item in the sidebar: Liturgical Readings
Under that, add: My Readings and, Create Readings, Readings Library

Then, under Readings, create a Readings Wizard.  In the wizarad, ask the user what the title of the event, then a description (optional).  Ask the user if they want to include the petitions.  Then ask what the first reading (can skip if they want), psalm (can skip if they want), second (can skip if they want), and Gospel (can skip if they want).  Save the readings and ask the person if they want to print the readings.  Look at the format on this page and follow the format similarly: https://github.com/fr-mccarty/liturgy-readings/blob/master/resources/views/livewire/funeral-readings.blade.php



Allow the user to ask for a recommendation for the readings for a funeral and for a wedding.

