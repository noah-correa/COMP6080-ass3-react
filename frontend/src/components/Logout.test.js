import React from 'react';
import { shallow } from 'enzyme';
import Logout from './Logout';

// Logout Button Component Test
describe('Component: Logout', () => {
  const minProps = {
    token: '',
    logout: (t) => ({}),
    onLogout: () => {},
  }

  const mockEvent = {
    preventDefault: () => {},
  }

  it('contains logout button', async () => {
    const wrapper = shallow(<Logout {...minProps}/>);
    expect(wrapper.find('#button-logout')).toHaveLength(1);
  });

  it('calls logout function once on click', async () => {
    const logout = jest.fn((t) => ({}));
    const onLogout = jest.fn();
    const wrapper = shallow(<Logout token='token' logout={logout} onLogout={onLogout}/>);
    const button = wrapper.find('#button-logout');
    button.simulate('click', mockEvent);
    await expect(logout).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('calls logout function no times on click with error', async () => {
    const logout = jest.fn((t) => { return { error: 'error' } });
    const onLogout = jest.fn();
    const wrapper = shallow(<Logout token='token' logout={logout} onLogout={onLogout}/>);
    const button = wrapper.find('#button-logout');
    button.simulate('click', mockEvent);
    await expect(logout).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(0);
  });
})
