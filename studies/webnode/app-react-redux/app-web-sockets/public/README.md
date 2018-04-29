//
// Model
//

/*
----
  Redux Store (state): view

  React Container: LinkView (view ie url pathname)
  React Component: -> LinkViewComp (view, onClick)
  Onclick Event: linkView (view)
  Redux Action: -> setView: SET_VIEW, view
  Redux Reducer: --> state.view = view

  React Container: LinkIssue (view ie url pathname)
  React Component: -> LinkIssueComp (view, onClick)
  Onclick Event: linkIssue (view)
  Redux Action: -> setView: SET_VIEW, view
  Redux Reducer: --> state.view = view
----
  Redux Store (state): data
  -> isFetching
  -> issues // Every issue has comments

  React Container: GetIssues ()
  React Component: -> GetIssuesComp (onClick)
  Onclick Event: getIssues (dispatch)
  1. Redux Action: -> fetchData: GET_ISSUES
     Redux Reducer: --> state.isFetching = true
  2. Redux Action: -> receiveIssues: RECEIVE_ISSUES, issues
     Redux Reducer: --> state.isFetching = false, state.issues = issues

  React Container: DeleteIssue (issuekey)
  React Component: -> DeleteIssueComp (issuekey, onClick)
  Onclick Event: deleteIssue (dispatch, issuekey)
  1. Redux Action: -> fetchData: DELETE_ISSUE, issuekey
     Redux Reducer: --> state.isFetching = true
  2. Redux Action: -> receiveStatus: RECEIVE_STATUS, status
     Redux Reducer: --> state.isFetching = false, state.status = status

  React Container: CreateIssue ()
  React Component: -> CreateIssueComp (onClick)
  Onclick Event: openModal ()
  Redux Action: -> openModal: OPEN_MODAL
  Redux Reducer: --> state.isOpen = true

  React Container: CreateIssueModal () and IssueForm ()
  React Component: -> CreateIssueModalComp (isOpen, onClose, onSubmit) and IssueFormComp (onSubmit)
  -
  Onclose Event: closeModal ()
  Redux Action: -> closeModal: CLOSE_MODAL
  Redux Reducer: --> state.isOpen = false
  -
  Onsubmit Event: submitIssue (dispatch, formdata) -> postIssue (dispatch, issue)
  1. Redux Action: -> fetchData: POST_ISSUE
     Redux Reducer: --> state.isFetching = true
  2. Redux Action: -> receiveStatus: RECEIVE_STATUS, status
     Redux Reducer: --> state.isFetching = false, state.status = status

  React: IssuesBox
  React: -> GetIssues
  React: -> n * Issue -> LinkIssue, DeleteIssue
  React: -> PostIssue

  ...

  React: IssueBox
  React: -> IssueFields -> PutIssue
  React: -> GetComments
  React: -> n * Comment -> DeleteComment
  React: -> PostComment
----
*/
