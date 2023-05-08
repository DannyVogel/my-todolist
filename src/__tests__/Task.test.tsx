/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';

import Task from '../Components/Task';

describe('<Task />', () => {    
    it('renders without errors', () => {
        render(<Task id="1" text="test" checked={false} handleChange={()=>{}} deleteTask={()=>{}} />);
    });

    describe('renders when checked is false', () => {
        beforeEach(() => {
            render(<Task id="1" text="test" checked={false} handleChange={()=>{}} deleteTask={()=>{}} />);
        });
        it('renders task text', () => {
            const element = screen.getByText("test");
            expect(element).toBeInTheDocument();
        });
        it('renders unchecked task', () => {
            const element = screen.getByTestId("taskEl");
            expect(element).not.toHaveStyle({textDecoration: "line-through"});
        });
    });
    describe('renders when checked is true', () => {
        beforeEach(() => {
            render(<Task id="1" text="test" checked={true} handleChange={()=>{}} deleteTask={()=>{}} />);
        });
        it('renders delete button', () => {
            const element = screen.getByTestId("delete-button");
            expect(element).toBeInTheDocument();
        });
        it('renders checked task', () => {
            const element = screen.getByTestId("taskEl");
            expect(element).toHaveStyle({textDecoration: "line-through"});
        });
    });
    describe('renders with event listeners', () => {
        let handleChange = jest.fn()
        let deleteTask = jest.fn()
        beforeEach(() => {
            render(<Task id="1" text="test" checked={true} handleChange={handleChange} deleteTask={deleteTask} />);
        });
        it('calls handleChange when checkbox is clicked', () => {
            const element = screen.getByTestId("taskEl");
            fireEvent.click(element)
            expect(handleChange).toHaveBeenCalledTimes(1)
        });
        it('calls deleteTask when delete button is clicked', () => {
            const element = screen.getByTestId("delete-button");
            fireEvent.click(element)
            expect(deleteTask).toHaveBeenCalledTimes(1)
        });
    });           
});