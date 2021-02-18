import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import App from './App';

describe('App component', () => {
  test('Render gretting', () => {
    render(<App />);
    const headElement = screen.getByText(/Welcome to AudMIX!/i);
    expect(headElement).toBeInTheDocument();
  });

  test('Render greeting enzyme', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('h1').text()).toEqual('Welcome to AudMIX!');
  });
});
