# Learner Dashboard MFE Customizations

Each section lists a feature required.

## Feature: Sort Learner Dashboard Course List, Alphabetically

The homepage of the Learner Dashboard, by default, doesn't sort alphabetically.  A learner would have to click on "refine" -> Title (A-Z)

We want the learner to land on that dashboard already sorted for them alphabetically.

Implementation: [`src/plugins/course-list-alphabetical/`](../src/plugins/course-list-alphabetical/index.js) (composed via root [`env.config.js`](../env.config.js)).

## Hide Components using CSS

- In the `/learner-dashboard`
    - [ ] (LM-123) Each course that is listed shows `Grade required to pass the course: XX%`. We want to CSS hide that.

Implementation: [`src/plugins/hide-grade-required/`](../src/plugins/hide-grade-required/index.js) (composed via root [`env.config.js`](../env.config.js)).


