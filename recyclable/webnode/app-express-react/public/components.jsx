'use strict'
/* global React ReactDOM urlFetch */

class StoryBox extends React.Component { // eslint-disable-line no-unused-vars
  constructor () {
    super()
    this.state = {
      view: 'home'
    }
  }
  componentWillMount () {
    this._fetchMyself()
  }
  render () {
    switch (this.state.view) {
      case 'home':
        return (
          <div>
            <h3>Home</h3>
            <button onClick={this._handleClick.bind(this)}>Switch view</button>
          </div>
        )
      case 'search':
        return (
          <div>
            <h3>Search</h3>
            <p>myself: { this.state.myself }</p>
            {this.state.issues.map((issue) => {
              return (
                <Issue
                  key={issue.key}
                  issuekey={issue.key}
                  reporter={issue.fields.reporter.name}
                  summary={issue.fields.summary}
                  onSelect={this._openSelected.bind(this)}
                />
              )
            })}
          </div>
        )
      case 'issue':
        return (
          <div>
            <h3>Issue</h3>
            <p>Selected issue: { this.state.issue.key }</p>
            {this.state.issue.fields.comment.comments.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  commentid={comment.id}
                  author={comment.author.name}
                  body={comment.body}
                />
              )
            })}
            <button onClick={this._handleClick.bind(this)}>Switch view</button>
          </div>
        )
    }
  }
  _handleClick () {
    switch (this.state.view) {
      case 'home':
        this._fetchSearch()
        this.setState({ view: 'search' })
        break
      case 'search':
        this.setState({ view: 'issue' })
        break
      case 'issue':
        this.setState({ view: 'home' })
        break
    }
  }
  async _openSelected (issuekey) {
    const issue = await urlFetch({ method: 'GET', request: `api/2/issue/${issuekey}` })
    this.setState({ view: 'issue', issue })
  }
  async _fetchMyself () {
    const myself = await urlFetch().then((json) => { return json.name })
    this.setState({ myself })
  }
  async _fetchSearch () {
    const jql = 'jql=key%20in%20(SPLPRJ-42%2CSPLPRJ-43%2CSPLPRJ-44)%20ORDER%20BY%20key%20ASC'
    const issues = await urlFetch({ method: 'GET', request: `api/2/search?${jql}` })
      .then((json) => { return json.issues })
    this.setState({ issues })
  }
}

class Issue extends React.Component {
  render () {
    return (
      <div>
        <p>
          Reported by {this.props.reporter}<br />
          <a href='' onClick={this._handleClick.bind(this)}>{this.props.issuekey}</a>: {this.props.summary}
        </p>
      </div>
    )
  }
  _handleClick (event) {
    event.preventDefault()
    this.props.onSelect(this.props.issuekey)
  }
}

class Comment extends React.Component {
  render () {
    return (
      <div>
        <p>
          Posted by {this.props.author}<br />
          {this.props.body}<br />
          {this.props.commentid}
        </p>
      </div>
    )
  }
}

ReactDOM.render(
  <StoryBox />, document.getElementById('root')
)
