<!-- ensure this structure makes sense and add placeholders for info about front-end -- also cut out some of the excess detail on back-end -- and make sure contribution/setup/installation instructions are up-to-date/still working -- then finally review all writing to keep it reasonably concise -->
<!-- also format this properly with good word-wrapping at ~80 chars -->

# UMN Course Flowchart

<!--1.0: add a link to the deployed site on these first two words-->
Course Flowchart is a website that will doubly function as a better course catalog and degree planning tool than the University of Minnesota's official tools. (Note: We currently only plan to cater to the Twin Cities campus.)

- [Features](#features)
- [Details](#details)
- [Contribution](#contribution)

Courses at the University have prerequisites which are typically listed at the end of a course description.

![alt text](public/demo/example-description.png)
<!--TODO add the 4041 catalog picture-->

<!--While we're at it, perhaps show off how unintuitive and awful the official catalog is to use-->

However, this textual description only includes information for that specific course, which can help register for classes, but is incredibly tedious to parse for degree-planning. To this end, our website makes much more readable flowcharts of the prerequisite relationships between courses, and generally serves as a more useful course catalog.

## Features

- list of features
![with demo pictures](public/demo/feature1.png)
- that are very cool
![with demo pictures](public/demo/feature2.png)
- and already work
![with demo pictures](public/demo/feature3.png)
<!--TODO make these pictures-->

#### Planned (or work-in-progress)

- TODO UPDATE
- Selecting multiple classes to present in a single graph
- Displaying what classes take a selected class as a prerequisite
- Clickable graph node interaction
- Degree planner capabilities

## Details

This project rips data directly from the University of Minnesota's [course catalog](https://umtc.catalog.prod.coursedog.com/courses), using the publically available [Coursedog API](https://coursedog.docs.apiary.io/), a catalog system adopted by the University to replace the previous in-house catalog system in August 2023. The API response, which contains department information and individual course information for the Twin Cities campus, is filtered down to the most useful information and written to JSON files held in this repository.
<!--This last part should be updated upon relational database-->

#### Technologies

- [Next.js](https://nextjs.org/) as a full-stack [React](https://react.dev/) framework
- [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/), and [Prettier](https://prettier.io/) make JS much more ergonomic to work with
- [TailwindCSS](https://tailwindcss.com/) for styling and generally being easier to manage than plain CSS
- [Mermaid](https://mermaid.js.org/) as a flowchart/graph visualization tool (though we may build our own with [elkjs](https://github.com/kieler/elkjs))
<!--If we migrate to using an actual relational database, this is where a bullet point should be added for that-->
- This project runs on the [Node](https://nodejs.org/) JS runtime, and we use [pnpm](https://pnpm.io/) as our package manager.

## Contribution

### Getting started

#### Very basics

If you are not part of the core team, [fork](https://docs.github.com/articles/fork-a-repo) this repository and [clone](https://docs.github.com/articles/cloning-a-repository) it locally. We will assume you already have a git client installed and [basic knowledge](https://learngitbranching.js.org/) of how to use it.

#### Project setup

To actually get started with the project, you will need to install [Node](https://nodejs.org/en/download) as the project's runtime and [pnpm](https://pnpm.io/installation) as the project's package manager.

Then, open your terminal emulator and change directory into the top-level directory of the repo. (If you just used git on the command-line to clone the repository, you only need to run `cd Interactive-Prerequisite-Flowchart`.)

Then run the following command to install the project's dependencies: `pnpm install` (or `pnpm i`, which does the same thing).

Finally, run `pnpm dev` to start the development server and verify that everything was setup correctly and works. To stop the dev server, stop the process as you normally would in your terminal emulator. (Note: `Ctrl+C` on most terminal emulators stops the currently running process.)

# TODO WRITE BELOW

### Issues

### Pull requests

Then setup and install dependencies as specified in [Initialize](#initialize) and [Run](#run). All development should be based on the `main` branch, so make sure to rebase your changes on top of `main` before making the pull request. This project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Use `pnpm lint` to check for linting errors or setup your editor to display them. You can use `pnpm fmt` to check for any improperly formatted code. Once your work is ready to be merged in, submit a pull request (specify what issue will be resolved by this PR).

Make sure to download and install the following:
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- everything they need to install (prettier, eslint, etc.)

## Run

To run the project locally, follow these steps:
1. Install dependencies: `pnpm install`
2. Run the development server: `pnpm dev`

## Deployment

To deploy the project, follow these steps:
1. Build the project: `pnpm build`
2. Start the server: `pnpm start`

5. Generate json data files
   - `app/data/sources.js` is a script for generating all json data files.
   - Modify `sources.js` to fit your needs.
   - Use `pnpm sources` from the top-level directory to run the script.

4. Graph generation from above data
   - `app/data/graphBuilder.ts` is responsible for building prerequisite graphs that show the prerequisite relationships encoded in the data, nesting all the way back to introductory level courses.
6. Access json data files
   - Import `Access` from `app/data/access.js` or open the json files in folder `app/data/Dog` and `app/data/General` directly.
