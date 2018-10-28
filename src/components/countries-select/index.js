import React, { Component } from 'react'
import PropTypes from 'prop-types'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadCountries } from '../../store/actions/countries'
import { getCountries } from '../../store/reducers/countries'

// styles
import CSSModules from 'react-css-modules'
import styles from './style.scss'


@connect(
  (state, props) => ({
    countries: getCountries(state)
  }),
  dispatch => ({
    loadCountries: bindActionCreators(loadCountries, dispatch)
  })
)
@CSSModules(styles)
export default class CountriesSelect extends Component {

  static defaultProps = {
    onChange: PropTypes.func.isRequired,
    initValue: '+86'
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { countries, loadCountries, onChange, initValue } = this.props;
    if (countries.length == 0) loadCountries()
    onChange(initValue)
  }

  render() {
    const { countries, onChange, initValue } = this.props
    return (
      <select styleName="select" defaultValue={initValue} onChange={(self)=>onChange(self.target.value)}>
        {countries.map((item, index)=>{
          return (<option key={index} value={item.code}>{item.name} {item.code}</option>)
        })}
      </select>
    )
  }

}
