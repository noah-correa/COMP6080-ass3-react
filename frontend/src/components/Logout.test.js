import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'react-bootstrap';
import Logout from './Logout';

// Logout Button Component Test
describe('Component: Logout', () => {
  it('contains Button', async () => {
    const wrapper = shallow(<Logout />);
    expect(wrapper.containsMatchingElement(<Button/>)).toEqual(true);
  })

  // it('contains animation border', async () => {
  //   const wrapper = shallow(<Logout/>);
  //   expect(wrapper.find(Spinner).prop('animation')).toBe('border');
  // })

  // it('contains variant light', async () => {
  //   const wrapper = shallow(<Logout variant='light'/>);
  //   expect(wrapper.find(Spinner).prop('variant')).toMatchObject({ variant: 'light' });
  // })

  // it('contains variant dark', async () => {
  //   const wrapper = shallow(<Logout variant='dark'/>);
  //   expect(wrapper.find(Spinner).prop('variant')).toMatchObject({ variant: 'dark' });
  // })
})
