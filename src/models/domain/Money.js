import money from 'money-math'

export default class Money {
  constructor(value, currency) {
    this._value = value
    this._currency = currency
  }

  get value() {
    return this._value
  }

  get currency() {
    return this._currency
  }

  set value(value) {
    this._value = value
  }

  set currency(currency) {
    this._currency = currency
  }

  static get ZERO() {
    return Money.of('0.00', 'EUR')
  }

  static of(value, currency) {
    return new Money(value, currency)
  }

  add(that) {
    const newValue = money.add(this.value, that.value)
    this.value = newValue
  }

  subtract(that) {
    const newValue = money.subtract(this.value, that.value)
    this.value = newValue
  }

  toJSON() {
    return {
      value: money.format(this.currency, this.value),
      currency: this.currency,
    }
  }
}
