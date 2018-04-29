'use strict'

/* globals Col */
/* globals RefreshIssues, IssuesCounters, IssuesListing, IssuesRanking, NewIssue */

/* ******************** PlanBox ******************** */

const PlanBox = () => ( // eslint-disable-line no-unused-vars
  <div>
    <div className='container'>
      <Col lg={6} md={6} sm={6} xs={6}>
        <RefreshIssues />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6} className='text-right'>
        <IssuesCounters />
      </Col>
    </div>
    <p>{''}</p>
    <div className='container'>
      <Col lg={6} md={6} sm={6} xs={6}>
        <IssuesListing />
      </Col>
      <Col lg={6} md={6} sm={6} xs={6}>
        <IssuesRanking />
      </Col>
    </div>
    <div className='container'>
      <NewIssue />
    </div>
  </div>
)
