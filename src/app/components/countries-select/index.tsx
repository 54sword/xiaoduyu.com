import React, { useState, useEffect } from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadCountries } from '@actions/countries';
import { getCountries } from '@reducers/countries';

// styles
import './style.scss'

interface Props {
  onChange: (s: string) => void
}

export default function({ onChange }: Props) {

  const [ value, setValue ] = useState('');
  
  const countries = useSelector((state: object)=>getCountries(state));
  const store = useStore();
  const _loadCountries = (args?:object) => loadCountries(args)(store.dispatch, store.getState);

  useEffect(()=>{

    if (!value) {
      setValue('+86');
      onChange('+86');
    }
    
    if (countries.length == 0) _loadCountries();
  });

  return (
    <select styleName="select" defaultValue={value} onChange={(e:any)=>onChange(e.target.value)}>
    {countries.map((item: any)=>{
      return (<option key={item.abbr} value={item.code}>{item.name} {item.code}</option>)
    })}
    </select>
  )
}