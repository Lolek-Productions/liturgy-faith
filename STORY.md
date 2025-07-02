The Story of liturgy.faith

Introduction:


Features:
-Petitions
-Readings - Weddings, funerals, 
-Ministers (contact information)
-Liturgy Planning - what prayers, what preface, what are the reading choices, what are the readings themselves.
-Worship Aid
-Follow Along for new people
-Musical Numbers - for planning andd communiication
-Calendar


# Petition Settings
Petition settings is where I want to allow the user to create and save various contexts for the user.  Contexts should start with the 3 basic definitions of Sunday, Wedding, and funeral.  The user can add contexts.  Also the user should select a context when creating petitions.  But I don't want you to save the context as a foreign key relationship in the database.  I just want you to copy the context over, like a transaction, to the petitions.

# Creating Petitions
To create petitions, the user is first asked to input the title and date for the set of petitions.  After saving, they are redirected. To the petitions wizard. The petitions wizard ask the user to choose a language, and a context once the context is selected it is dropped into the column named context in the petitions table. The user is allowed to update the context with any further specifications, such as the name of the bride and the name of the groom or the name of the deceased person. After they click next within the wizard, then they are redirected to the next step which will generates the petitions using a large language model. Once the petitions are generated, then the user can further edit the petitions if they wish. Finally, the user is shown a next button, which will allow the user to go to the print view and print out the petitions.

Steps for Petition Wizard (the wizard begins after saving the name, date, and language of the petitions):
Step 1: Language & Context
Step 2: Context Details (auto-generate after clicking next)
Step 3: Edit & Review (after generating)
Step 4: Print & Complete


# Readings


## Creating Readings
Then, under Readings, create a Readings Wizard.  In the wizarad, ask the user what the title of the event, then a description (optional).  Ask the user if they want to include the petitions.  Then ask what the first reading (can skip if they want), psalm (can skip if they want), second (can skip if they want), and Gospel (can skip if they want).  Save the readings and ask the person if they want to print the readings.  Look at the format on this page and follow the format similarly: https://github.com/fr-mccarty/liturgy-readings/blob/master/resources/views/livewire/funeral-readings.blade.php. 



Allow the user to ask for a recommendation for the readings for a funeral and for a wedding.

