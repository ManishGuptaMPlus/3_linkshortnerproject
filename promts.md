I used below prompts in this projects.


## For generating data-mutation related copilot instructions
- /create-copilot-instructions ALL data mutations in this app should be done via server actions. Server actions must be called from client components. Server action files MUST be named actions.ts and be colocated in the directory of the component that calls the server action. All data passed to server action must have appropriate typescripts types (DO NOT USE use the Form data typescript type). All data must be validated in server action via ZOD. All server action must check for logges in user before continuing with database operations. Database operations must be done via helper functions that wrap dirzzle queries. These helper functions located in the /data directory and server actions should not direclty used drizzle queries within them. 

## Feature implementation prompts: to create new links from dashbaord page
Implement the create link functionality. this should be launched via a modal/dialog from the dashboard #file:page.tsx page.


## Feature implementation prompts: to edit and delete links from link list item
implement the edit and delete link functionality for each link list item. The edit link should be done via a modal/dialog and teh delete link should first launch a dialog to the user whether they want to delete this link or not. #file:page.tsx file.

## Feature implementation prompts: to implement redirect functionality
implement the redirect functionality for each link via an api route handler. Whenever the route handler at /l/[shortcode] is accessed, it should redirect the user to the full url.
 