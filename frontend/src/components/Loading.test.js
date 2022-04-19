import React from 'react';
import { shallow } from 'enzyme';
import { Spinner } from 'react-bootstrap';
import Loading from './Loading';

// Logout Button Component Test
describe('Component: Loading', () => {
  it('contains Spinner', async () => {
    const wrapper = shallow(<Loading />);
    expect(wrapper.containsMatchingElement(<Spinner/>)).toEqual(true);
  })

  it('contains animation border', async () => {
    const wrapper = shallow(<Loading/>);
    expect(wrapper.find(Spinner).prop('animation')).toBe('border');
  })

  it('contains variant light', async () => {
    const wrapper = shallow(<Loading variant='light'/>);
    expect(wrapper.find(Spinner).prop('variant')).toMatchObject({ variant: 'light' });
  })

  it('contains variant dark', async () => {
    const wrapper = shallow(<Loading variant='dark'/>);
    expect(wrapper.find(Spinner).prop('variant')).toMatchObject({ variant: 'dark' });
  })
})
