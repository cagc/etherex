var React = require("react");
var Chart = require("./GraphPriceTechan");

var GraphPrice = React.createClass({
  render: function() {
    return (
      <div className="navbar">
        <Chart height={this.props.height} full={this.props.full} data={this.props.market.market.data} market={this.props.market.market} />
      </div>
    );
  }
});

module.exports = GraphPrice;
