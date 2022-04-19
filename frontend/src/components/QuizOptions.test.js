import React from 'react';
import { shallow } from 'enzyme';
import QuizOptions, { OptionButton, OptionsContainer } from './QuizOptions';

// QuizOptions Button Component Test
describe('Component: QuizOptions', () => {
  const minProps = {
    questionType: '',
    options: [],
    updateSelected: () => {},
    disabled: false,
    correct: [],
  }

  it('contains OptionsContainer', async () => {
    const wrapper = shallow(<QuizOptions {...minProps}/>);
    expect(wrapper.containsMatchingElement(<OptionsContainer/>)).toEqual(true);
  })

  it('contains OptionButton', async () => {
    const wrapper = shallow(<QuizOptions {...{ ...minProps, options: [{}] }} />);
    expect(wrapper.find(OptionsContainer).children().containsMatchingElement(<OptionButton/>)).toEqual(true);
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
