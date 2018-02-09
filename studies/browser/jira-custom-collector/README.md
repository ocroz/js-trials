# JIRA Custom Issue Collector

## Implementations

- [CIC](CIC/): Original prototypes
- [JCIC](JCIC/): Javascript ES6 + bootstrap + bootstrap-select (Only Chrome & Firefox)
- [MSJCIC](MSJCIC/): Javascript ES5 + bootstrap + bootstrap-select (plus Edge & Internet Explorer 11)
- [RBJCIC](RBJCIC/): React + bootstrap + bootstrap-select
- [RXJCIC](RXJCIC/): React + JSX + bootstrap + bootstrap-select
- [WBJCIC](WBJCIC/): Webix + bootstrap + bootstrap-select
- [WXJCIC](WXJCIC/): Webix

### Webix

WEBIX limitations:
- How to create a panel? such as <a href="https://www.w3schools.com/bootstrap/bootstrap_panels.asp">bootstrap panels</a>
- How to create a group of checkboxes? such as <a href="https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp">bootstrap form inputs</a>
- How to create an unselectable optgroup? such as <a href="https://silviomoreto.github.io/bootstrap-select/examples/">bootstrap-select optgroup</a>
- How to create a multiselect with optgroups? such as <a href="https://silviomoreto.github.io/bootstrap-select/examples/">bootstrap-select multiple select boxes + optgroup</a>
- How to create a combo/multicombo with optgroups? such as <a href="https://silviomoreto.github.io/bootstrap-select/examples/">bootstrap-select live-search + optgroup</a>

WEBIX difficulty of usage:
- A lot of people know HTML/CSS but few persons know WEBIX.
- WEBIX vocabulary is difficult to learn and many parameters must be set to have a correct result.
- WEBIX completely hides the HTML elements and it is difficult to change them in case WEBIX does not provide the desired functionality.

Examples:
- The only way to write some simple text is via "template".
- The text box size does not adapt to the text and we have to change the size of the box any time we change the text.
- "text" means "input" in HTML.
- "select" is "select" in HTML, "richselect" and "multiselect" are "list", "combo" and "multicombo" are "input + list". These lists are kinds of "select".
- The "select" list looks ugly, "richselect" should be used instead.
- How to align the checkbox label to the right while aligning the checkbox button to the left?
- How to add a scroll bar when the modal is bigger than the window?

As a comparison:
- REACT only manages the display of elements, and BOOTSTRAP only manages their behavior.
- The REACT syntax is closer to the HTML and easier to understand and debug.
- The BOOTSTRAP framework basically only provides classes on HTML elements which is easier to manipulate.
- REACT and BOOTSTRAP are more widely used. There are more answers available for them in the Internet. And they are free.

WEBIX look and feel:
- ?

WEBIX + Bootstrap:
- The modal height does not adapt to bootstrap elements.
