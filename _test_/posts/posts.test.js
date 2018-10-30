import React from 'react'
import { shallow, mount, configure } from 'enzyme';
import renderer from 'react-test-renderer'
import MarketAnalysis from '../../src/components/market-analysis'
import configureStore from 'redux-mock-store'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('>>>posts --- Shallow Render REACT COMPONENTS',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<MarketAnalysis house={house} exchangeRate={exchangeRate} history={history}/>)
    })

    it('+++ render the DUMB component', () => {
       expect(wrapper.length).toEqual(1)
    });
});
