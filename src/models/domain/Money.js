export default class Money {
  constructor(value, currency) {
    this._value = value
    this._currency = currency
  }

  //TODO andrej-naumovski 15.06.2018: Add methods for handling money here

  toJSON() {
    const { _value, _currency } = this
    return {
      value: _value,
      currency: _currency,
    }
  }
}
