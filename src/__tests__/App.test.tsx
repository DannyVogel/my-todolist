/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import App from '../App';

describe('<App />', () => {
  it('renders without errors', () => {
    render(<App />);
  });
  it('renders title', () => {
    render(<App />);
    const element = screen.getByText("ToDo List");
    expect(element).toBeInTheDocument();
  });
  it('renders default task', () => {
    render(<App />) 
    const element = screen.getByText("Your ToDos will appear here")
    expect(element).toBeInTheDocument();
  });
  
  // let toDos = [
  //   {
  //     id: 1,
  //     text: 'test',
  //     checked: false
  //   },
  //   {
  //     id: 2,
  //     text: 'test2',
  //     checked: true
  //   }
  // ]
  // it('renders App component', () => {
  //   render(<App />);
  //   expect(screen.getByTestId('taskEl')).toBeInTheDocument();
  // });
});
