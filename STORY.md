The Story of liturgy.faith

Liturgy.Faith is a comprehensive liturgical management platform for Catholic churches, built with
Next.js 15, TypeScript, and Supabase.

Technology Stack
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui components
- Backend: Supabase (PostgreSQL + Auth)
- Authentication: Supabase Auth with server-side session management
- UI Library: Radix UI primitives with shadcn/ui styling

Current Features

🙏 Smart Petitions
- AI-assisted petition generation following traditional Catholic liturgical formats
- Multi-language support (English, Spanish, French, Latin)
- Context-aware content generation based on sacraments, deaths, sick members, special requests
- Petition wizard with step-by-step creation process

📚 Reading Collections
- Organize pre-assembled sets of readings for special occasions
- Template collections for weddings, funerals, and other liturgical events
- Personal reading collection management

📋 Liturgy Planning
- Complete celebration planning with prayers, prefaces, readings
- Special instructions and notes
- Calendar integration for scheduling

👥 Ministers Directory
- Contact information and availability tracking
- Active/inactive status management
- Role assignment and scheduling

📅 Liturgical Calendar
- Track feast days and special celebrations
- Liturgical season awareness
- Event scheduling and management

Route Structure

- Public routes: / (landing), /login, /signup
- Protected routes (main app): All routes under /(main)/
- Print-optimized routes: Special layouts under /(print)/

Current State Assessment

- Fully implemented: Petitions system with wizard workflow
- Partially implemented: Dashboard with stats, ministers, liturgy planning, calendar
- Extensive navigation: 5 main sections with multiple sub-features each
- Print functionality: Dedicated print layouts for petitions and readings

Architecture Highlights

- Two-tier layout system (public vs authenticated areas)
- Server Actions for secure data operations
- Comprehensive authentication flow with middleware protection
- Modern React patterns with Server Components where possible


## Navigation 
Petitions (FileText icon) - Collapsible dropdown:
- Create Petition - /petitions/create (Sparkles icon)
- My Petitions - /petitions (FileText icon)

Liturgical Readings (BookOpen icon) - Collapsible dropdown:
- Create Liturgical Reading - /liturgical-readings/create (Sparkles icon)
- My Liturgical Readings - /liturgical-readings (BookOpen icon)

Readings
- Create Reading - /readings/create (Sparkles icon)
- My Readings - /readings (BookOpen icon)

Liturgy (ClipboardList icon) - Collapsible dropdown:
- Create Liturgy - /liturgy/create (Sparkles icon)
- Liturgy Planning - /liturgy-planning (ClipboardList icon)
- Liturgical Calendar - /calendar (Calendar icon)

Ministry (UserCheck icon) - Collapsible dropdown:
- Ministers Leaders - /ministry/leaders (Users icon)
- Ministry Resources - /ministry/resources (GraduationCap icon)
//todo: need a create

Settings (Settings icon) - Collapsible dropdown:
- Petition Definitions - /settings/petition-definitions (FileText icon)
- Liturgy Definitions - /settings/liturgy-definitions (BookOpen icon)


# Liturgical Readings
A liturgical reading is a set of readings which contains a first_reading, psalm_reading, second_reading, and gospel_reading.

The liturgical reading can be printed out.  It could be for a weekend Mass, for a funeral, for a wedding, for a quinceanera, for a daily Mass, for a baptism.

# Reading
A reading is a scripture reading which has a language, lectionary_id, pericope, text.  This is a simple scripture reading.


# Petition Settings
Petition settings is where I want to allow the user to create and save various contexts for the user.  Contexts should start with the 3 basic definitions of Sunday, Wedding, and funeral.  The user can add contexts.  Also the user should select a context when creating petitions.  But I don't want you to save the context as a foreign key relationship in the database.  I just want you to copy the context over, like a transaction, to the petitions.

# Creating Petitions
To create petitions, the user is first asked to input the title and date for the set of petitions.  After saving, they are redirected. To the petitions wizard. The petitions wizard ask the user to choose a language, and a context once the context is selected it is dropped into the column named context in the petitions table. The user is allowed to update the context with any further specifications, such as the name of the bride and the name of the groom or the name of the deceased person. After they click next within the wizard, then they are redirected to the next step which will generates the petitions using a large language model. Once the petitions are generated, then the user can further edit the petitions if they wish. Finally, the user is shown a next button, which will allow the user to go to the print view and print out the petitions.

Steps for Petition Wizard (the wizard begins after saving the name, date, and language of the petitions):
Step 1: Language & Context
Step 2: Context Details (auto-generate after clicking next)
Step 3: Edit & Review (after generating)
Step 4: Print & Complete

# Petitions Context Settings
allow the user to create whatever ones she wants.  just be sure to start with four: Sunday, Funeral, Wedding, and Daily


# Readings


## Creating Readings
Then, under Readings, create a Readings Wizard.  In the wizarad, ask the user what the title of the event, then a description (optional).  Ask the user if they want to include the petitions.  Then ask what the first reading (can skip if they want), psalm (can skip if they want), second (can skip if they want), and Gospel (can skip if they want).  Save the readings and ask the person if they want to print the readings.  Look at the format on this page and follow the format similarly: https://github.com/fr-mccarty/liturgy-readings/blob/master/resources/views/livewire/funeral-readings.blade.php. 


## Liturgical Readings
To create you will go to the create page.  Then you will be redirected to step 2 on the wizard page.

## Liturgical Readings Wizard
Wizard Steps
1. Name, Description, and date
2. First Reading - chose from the list of readings, chose the name of the reader, or chose to omit the reading.  If you do that, we will just leave the column blank.
3. Choose the Psalm
4. Choose the Second Reading
5. Choose the Gospel Reading
6. Show the final selection.  Allow any edits and allow the user to print



Allow the user to ask for a recommendation for the readings for a funeral and for a wedding.

