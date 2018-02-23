'use strict'

/* globals store, connect, Component, Button */
/* globals getIssues, rankIssues, cfRank */

/* ******************** RefreshIssues ******************** */

class RefreshIssuesComp extends Component { // eslint-disable-line no-unused-vars
  componentDidMount () {
    const { isFetching, dispatch } = this.props
    !isFetching && dispatch(getIssues(dispatch))
  }

  render () {
    const { onRefreshIssues, onResetRanks } = this.props
    return (
      <div>
        <Button onClick={onRefreshIssues}>Refresh Issues</Button>
        {' '}
        <Button onClick={onResetRanks}>Reset Ranks</Button>
      </div>
    )
  }
}

const mapRefreshIssues = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      dispatch,
      onRefreshIssues: () => {
        dispatch(getIssues(dispatch))
      },
      onResetRanks: () => {
        // Sort the issues by rank after every getIssues()
        let issues, issuesByRank
        function newSort () {
          issues.sort((a, b) => a.key > b.key)
          issuesByRank = []
          issues.forEach(issue => { issuesByRank.push(issue) })
          issuesByRank.sort((a, b) => a.fields[cfRank] > b.fields[cfRank])
        }

        // processSeq(i) calls "rankIssues() then getIssues() then processSeq(i-1)" if issues[i] has the incorrect cfRank value
        // otherwise calls next "processSeq(i-1)"
        function processSeq (i) {
          if (i >= 0) {
            issues = store.getState().data.issues
            newSort()
            // console.log(i, `{${issues[i].key} ${issues[i].fields[cfRank]}}`, `{${issuesByRank[i].key} ${issuesByRank[i].fields[cfRank]}}`)
            if (issues[i].key !== issuesByRank[i].key) {
              const input = { issues: [issuesByRank[i].key], rankBeforeIssue: issues[i].key }
              dispatch(rankIssues(dispatch, input, () => dispatch(getIssues(dispatch, () => processSeq(i - 1)))))
            } else {
              processSeq(i - 1)
            }
          } else {
            // issues
            //   .map(issue => { return {key: issue.key, fields: {[cfRank]: issue.fields[cfRank]}} })
            //   .forEach(issue => console.log(JSON.stringify(issue)))
          }
        }

        issues = store.getState().data.issues
        // issues
        //   .map(issue => { return {key: issue.key, fields: {[cfRank]: issue.fields[cfRank]}} })
        //   .forEach(issue => console.log(JSON.stringify(issue)))
        processSeq(issues.length - 1)
      }
    }
  }
}

const RefreshIssues = connect( // eslint-disable-line no-unused-vars
  mapRefreshIssues.mapStateToProps,
  mapRefreshIssues.mapDispatchToProps
)(RefreshIssuesComp)
