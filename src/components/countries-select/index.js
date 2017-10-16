import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCountries } from '../../actions/countries'
import { getCountries } from '../../reducers/countries'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

class CountriesSelect extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { countries, fetchCountries, onChange, initValue } = this.props
    if (countries.length == 0) fetchCountries({})
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

CountriesSelect.defaultProps = {
  onChange: ()=>{},
  initValue: '+86'
}

CountriesSelect.propTypes = {
  fetchCountries: PropTypes.func.isRequired,
  countries: PropTypes.array.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    countries: getCountries(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCountries: bindActionCreators(fetchCountries, dispatch),
    getCountries: bindActionCreators(getCountries, dispatch)
  }
}

CountriesSelect = CSSModules(CountriesSelect, styles)

export default connect(mapStateToProps, mapDispatchToProps)(CountriesSelect)
