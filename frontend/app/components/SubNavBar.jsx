var _ = require("lodash");
var React = require("react");
import {FormattedMessage} from 'react-intl';

var Link = require('react-router/lib/Link');
var Nav = require('react-bootstrap/lib/Nav');

var fixtures = require('../js/fixtures');

var SubNavBar = React.createClass({
  render() {
    return (
      <Nav bsStyle="pills" className="navbar" role="navigation" aria-label="Secondary" justified>
        <li>
          <Link to="/markets/subs" activeClassName="active">
            <i className="icon-chart-pie"></i> <FormattedMessage id='sections.sub' />
          </Link>
        </li>
        <li>
          <Link to="/markets/xchain" activeClassName="active">
            <i className="icon-bitcoin"></i> <FormattedMessage id='sections.xchain' />
          </Link>
        </li>
        <li>
          <Link to="/markets/assets" activeClassName="active">
            <i className="icon-diamond"></i> <FormattedMessage id='sections.assets' />
          </Link>
        </li>
        <li>
          <Link to="/markets/currencies" activeClassName="active">
            <i className="icon-money"></i> <FormattedMessage id='sections.currencies' />
          </Link>
        </li>
      </Nav>
    );
  }
});

module.exports = SubNavBar;
