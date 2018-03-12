# JIRA Custom Issue Collector

## Current implementation

It uses jquery, bootstrap, bootstrap-select.<br />
The problem is it breaks the confluence functionalities.<br />
A workaround is to embed the jcic into an iframe.

## Future implementation

It should use the confluence styles.<br />
Good news: any web document can use these styles (not only a confluence page).

__References:__

- [Dialog2](https://docs.atlassian.com/aui/7.3.3/docs/dialog2.html) > Edit in codepen

```html
<!-- External dependencies -->
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/sinon.js/1.15.4/sinon.js"></script>
<script src="//unpkg.com/@atlassian/aui@7.3.3/dist/aui/js/aui.js"></script>
<script src="//unpkg.com/@atlassian/aui@7.3.3/dist/aui/js/aui-experimental.js"></script>
<script src="//unpkg.com/@atlassian/aui@7.3.3/dist/aui/js/aui-datepicker.js"></script>
<link rel="stylesheet" type="text/css" href="//unpkg.com/@atlassian/aui@7.3.3/dist/aui/css/aui.css"/>
<link rel="stylesheet" type="text/css" href="//unpkg.com/@atlassian/aui@7.3.3/dist/aui/css/aui-experimental.css"/>
<!-- / External dependencies -->
```

- [Forms](https://docs.atlassian.com/aui/7.3.3/docs/forms.html)

- [AUI Select2](https://docs.atlassian.com/aui/7.3.3/docs/auiselect2.html) > You can see the full docs [here](https://select2.org/).

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
```
