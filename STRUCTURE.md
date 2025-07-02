# Structure of liturgy.faith


## Public Pages
//Note that public pages should be set as an array in the middleware file

### Components
- public header
- Public footer


## App Pages area

### Components
- main header

## Example
Look to Github: https://github.com/Lolek-Productions/homily-build
Need the button at the top of the page to trigger the sidebar open and closed
Get the breadcrum component

# Styling
Use shadcn

# Design
Use lucide-react icons where posssible

# Authentication Pages
/signup
/login

# middleware
publicPaths = ['/login', '/signup', '/']

After authentication: redirect to /dashboard

No current request for email verification

Change the settings in supabase


Administer supabase users in 
https://supabase.com/dashboard/project/kpuaengwebmbxshuvzia/auth/users


how to use tables:
use shadcn



Logo: how to create a logo:??
https://lucide.dev/icons/church

Where can we NOT use the church icon?

Favicon:
The image that comes up on an iphone: 

Create favicon, but how?





Definition of
AppContextProvider
-Gives the user and userSettings
-


What is behind authentication:


Landing Page:
Navigation on the "/" page


Follow the structure of: homily.build


Sidebar definition:I want you to look at homily.build again and to incorporate the sidebar in the way that it is incorporporated.  the sidebar surrounds all the content in the "(main)" folder.  But the sidebar is not shown on the landing page "/"


Entity Module:
-index page
-create page - redireccts to Edit page
-edit page


Creating a flow: for example creating a homily


Dashboard Definition: ???


Toast usage: define this

Navigation on the "/" page



## Supabase - running on the remote server
Using the CLI but mostly for the following command:
supabase db push



Readings - liturgy-readings (public)
https://github.com/fr-mccarty/liturgy-readings

The php reading helper is as follows: 
https://github.com/fr-mccarty/liturgy-readings/blob/master/app/Helpers/ReadingHelper.php

https://github.com/fr-mccarty/liturgy-readings/blob/master/resources/views/livewire/wedding-readings.blade.php

Format of Readings:
https://github.com/fr-mccarty/liturgy-readings/blob/master/resources/views/livewire/print-funeral.blade.php


# ./scripts/generate-database-docs.sh
The purpose of this script is to dynamically generate the structure of the database in supabase to be displayed in the DATABASE.md for the AI to consume.  Other methods have been tried but I want to stick with this method for now for it allows the human to simply construct the structure of the database and then the AI to consume the structure.  From this point I am going to avoid letting the AI make structure changes (ordinarily), but needed a way to allow the AI to consume the changes that were made so as to understand the structure, purpose, and, eventually, the business logic of the application


Using tmux on the server
2 min overview (Fireship)
https://www.youtube.com/watch?v=vtB1J_zCv8I

tmux new -s work        # Start session
Ctrl+b, d              # Detach (safe to disconnect)
tmux attach -t work     # Resume when back online
tmux ls                # List all sessions
tmux kill-session -t session_name #to remove a session
tmux kill-server # to kill all the sessions and stop the server

e.g. 
how do I close this session in tmux: 2: 1 windows (created Wed Jul  2 18:01:09 2025) (attached)
tmux kill-session -t 2