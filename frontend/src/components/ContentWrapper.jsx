import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const PageContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    width: 80%;
  };
  & > *:first-child {
    margin-top: 1rem;
    /* border: 1px solid red; */
  }
  & > *:not(:last-child) {
    margin-bottom: calc(1rem * 0.5);
    /* border: 1px solid magenta; */
  }
  & > *:last-child {
    margin-bottom: 1rem;
    /* border: 1px solid lime; */
  }
`;

export const CenterPageContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > * {
    width: 80%;
  };
`;

const ContentWrapper = ({ center, children }) => {
  if (center) {
    return (
      <CenterPageContent>
        { children }
      </CenterPageContent>
    );
  }

  return (
    <PageContent>
      { children }
    </PageContent>
  )
}

ContentWrapper.propTypes = {
  center: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default ContentWrapper;
