import React from 'react';
import { shallow } from 'enzyme';
import QuizOptions, { OptionsContainer } from './QuizOptions';
import Loading from './Loading';

// QuizOptions Button Component Test
describe('Component: QuizOptions', () => {
  const minProps = {
    questionType: '',
    options: [],
    updateSelected: () => {},
    disabled: false,
    correct: [],
  }

  it('contains Loading when nothing correct', async () => {
    const wrapper = shallow(<QuizOptions {...minProps} disabled={true}/>);
    expect(wrapper.containsMatchingElement(<Loading/>)).toEqual(true);
  });

  it('contains OptionsContainer', async () => {
    const wrapper = shallow(<QuizOptions {...minProps}/>);
    expect(wrapper.containsMatchingElement(<OptionsContainer/>)).toEqual(true);
  });
})
