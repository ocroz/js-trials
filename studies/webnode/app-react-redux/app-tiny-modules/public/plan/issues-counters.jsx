'use strict'

/* globals connect */

const cfRank = 'customfield_11450'

/* ******************** IssuesCounters ******************** */

const IssuesCountersComp = ({issues}) => ( // eslint-disable-line no-unused-vars
  <div>
    <p>{''}</p>
    <b>#issues at original rank:</b>&nbsp;
    { issues.filter(issue => issue.fields[cfRank] === Number(issue.key.replace(/.*-/, ''))).length }
    <p>{''}</p>
  </div>
)

const mapIssuesCounters = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: (dispatch, ownProps) => undefined
}

const IssuesCounters = connect( // eslint-disable-line no-unused-vars
  mapIssuesCounters.mapStateToProps,
  mapIssuesCounters.mapDispatchToProps
)(IssuesCountersComp)
