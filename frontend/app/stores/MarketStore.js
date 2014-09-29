var Fluxxor = require("fluxxor");

var bigRat = require("big-rational");

var constants = require("../js/constants");
var fixtures = require("../js/fixtures");

var MarketStore = Fluxxor.createStore({

    initialize: function(options) {
        this.market = options.market || {};
        this.market.txs = [];
        this.market.data = {};
        this.markets = options.markets || [];
        this.loading = true;
        this.error = null;

        this.bindActions(
            constants.market.LOAD_MARKETS, this.onLoadMarkets,
            constants.market.LOAD_MARKETS_FAIL, this.onLoadMarketsFail,
            constants.market.LOAD_MARKETS_SUCCESS, this.onLoadMarketsSuccess,
            constants.market.CHANGE_MARKET, this.onChangeMarket,
            constants.market.UPDATE_MARKET_BALANCE, this.onUpdateMarketBalance,
            constants.market.LOAD_TRANSACTIONS, this.onLoadTransactions
        );

        this.setMaxListeners(1024); // prevent "possible EventEmitter memory leak detected"
    },

    onLoadMarkets: function() {
        console.log("MARKETS LOADING...");
        this.market = {txs: [], data: {}};
        this.markets = [];
        this.loading = true;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadMarketsFail: function(payload) {
        console.log("MARKETS ERROR: " + payload.error);
        this.loading = false;
        this.error = payload.error;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadMarketsSuccess: function(payload) {
        console.log("MARKETS LOADED: " + payload.length);
        this.market = payload[1]; // Load ETX as default (TODO favorites / custom menu)
        this.market.txs = [];
        this.market.data = {};
        this.market.minTotal = bigRat(this.market.minimum).divide(fixtures.ether).valueOf();
        this.markets = payload;
        this.loading = false;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onChangeMarket: function(payload) {
        console.log("MARKET: " + payload.name);
        this.market = payload;
        this.market.txs = [];
        this.market.data = {};
        this.market.minTotal = bigRat(this.market.minimum).divide(fixtures.ether).valueOf();
        this.emit(constants.CHANGE_EVENT);
    },

    onUpdateMarketBalance: function(payload) {
        console.log("UPDATING MARKET " + payload.market.name + " WITH " + payload.balance.confirmed);
        var index = _.findIndex(this.markets, {'id': payload.market.id});
        this.markets[index].balance = payload.balance.confirmed;
        this.markets[index].balance_unconfirmed = payload.balance.unconfirmed;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadTransactions: function(payload) {
        this.market.txs = payload;
        if (ethBrowser && payload.length)
            this.market.data = {
                // sum = _.reduce(_.pluck(payload, 'amount'), function(sum, num) { return parseFloat(sum) + parseFloat(num) });
                price: _.map(payload.reverse(), function(tx, i) {
                    // var sum = _.reduce(_.pluck(payload, 'input'), function(sum, num) { return parseFloat(sum) + parseFloat(eth.toDecimal("0x" + tx.input.substr(130,64))) });
                    // console.log(price);
                    if (tx.number && tx.timestamp)
                        return {
                            x: i, // tx.timestamp - i,
                            y: tx.number
                        };
                }),
                volume: _.map(payload.reverse(), function(tx, i) {
                    var value = parseFloat(eth.toDecimal("0x" + tx.input.substr(130,64)));
                    if (tx.timestamp && value)
                        return {
                            x: i, // tx.timestamp - i,
                            y: value
                        };
                })
            };
        else if (!ethBrowser)
            this.market.data = [];
        else
            this.market.data = {price: [{x: 0, y: 0}], volume: [{x: 0, y: 0}]};
        this.emit(constants.CHANGE_EVENT);
    },

    getState: function() {
        return {
            market: this.market,
            markets: this.markets,
            loading: this.loading,
            error: this.error
        };
    }
});

module.exports = MarketStore;
