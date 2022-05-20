import styled from 'styled-components/macro';

const StyledRangeButtons = styled.ul`
  display: flex;
  list-style: none;
  margin: 0 0 var(--spacing-lg) 0;
  padding: 0;

  @media (min-width: 768px) {
    position: absolute;
    top: 0;
    right: var(--spacing-xxl);
    margin-bottom: 0;
  }

  li {
    margin-right: var(--spacing-xs);

    @media (min-width: 768px) {
      margin-left: var(--spacing-xs);
      margin-right: 0;
    }
  }

  button {
    background-color: var(--dark-grey);

    &:hover,
    &:focus {
      background-color: var(--grey);
    }

    &.active {
      background-color: var(--green);
    }
  }
`;

export default StyledRangeButtons;