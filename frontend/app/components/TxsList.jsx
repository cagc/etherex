var React = require("react");
import {FormattedMessage} from 'react-intl';

var AlertDismissable = require('./AlertDismissable');

var ProgressBar = require('react-bootstrap/lib/ProgressBar');
var RangeSelect = require('./RangeSelect');
var TxsTable = require('./TxsTable');

var TxsList = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container-fluid row">
          <div className="col-md-3 col-sm-4">
            <h3>{ this.props.title } {
                this.props.market.loading &&
                  <span><FormattedMessage id='loading' />...</span> }
            </h3>
          </div>
          <div className="col-md-9 col-sm-8">
            <div>
              {this.props.market.loading ?
                <ProgressBar active now={this.props.market.percent} style={{marginTop: 30}} /> :
                <RangeSelect flux={this.props.flux} />}
            </div>
          </div>
        </div>
        {this.props.market.market.error &&
          <AlertDismissable ref="alerts" level={"warning"} message={this.props.market.market.error} show={true} />}
        <div className="container-fluid">
          <TxsTable flux={this.props.flux} txs={this.props.txs} market={this.props.market} user={this.props.user.user} />
        </div>
      </div>
    );
  }
});

module.exports = TxsList;
