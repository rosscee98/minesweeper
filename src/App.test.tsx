import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

const FIRST_VALUE = "2";
const NON_MINED_CELLS = [0, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24];

test('renders 5 rows', () => {
  render(<App />);
  const game = screen.getByTestId("game");
  expect(game.children.length).toBe(5);
})

test('renders 25 cells', () => {
  render(<App />);
  const game = screen.getByTestId("game");
  expect(within(game).getAllByRole("button").length).toBe(25);
})

test('cell value hidden until clicked', () => {
  render(<App />);
  expect(screen.queryByText(FIRST_VALUE)).not.toBeInTheDocument();

  const cell = within(screen.getByTestId("game")).getAllByRole("button")[0];
  fireEvent.click(cell);
  expect(screen.getByText(FIRST_VALUE)).toBeInTheDocument();
})

describe('clicking reset button', () => {
  test('resets game', () => {
    render(<App />);
    const cell = within(screen.getByTestId("game")).getAllByRole("button")[0];
    const reset = screen.getByTestId("reset");

    fireEvent.click(cell);
    expect(screen.getByText(FIRST_VALUE)).toBeInTheDocument();

    fireEvent.click(reset);
    expect(screen.queryByText(FIRST_VALUE)).not.toBeInTheDocument();
  });

  test('removes lost text', () => {
    render(<App />);
    const minedCell = within(screen.getByTestId("game")).getAllByRole("button")[1];
    const reset = screen.getByTestId("reset");

    fireEvent.click(minedCell);
    fireEvent.click(reset);

    expect(screen.queryByText("You lost!")).not.toBeInTheDocument();
  })

  test('removes won text', () => {
    render(<App />);
    const reset = screen.getByTestId("reset");

    NON_MINED_CELLS.forEach((cellIndex) => {
      fireEvent.click(within(screen.getByTestId("game")).getAllByRole("button")[cellIndex]);
    });
    fireEvent.click(reset);

    expect(screen.queryByText("You won!")).not.toBeInTheDocument();
  })

  test('makes game playable again after loss', () => {
    render(<App />);
    const minedCell = within(screen.getByTestId("game")).getAllByRole("button")[1];
    const nonMinedCell = within(screen.getByTestId("game")).getAllByRole("button")[0];
    const reset = screen.getByTestId("reset");

    fireEvent.click(minedCell);
    fireEvent.click(reset);
    fireEvent.click(nonMinedCell);

    expect(screen.getByText("2")).toBeInTheDocument();
  })

  test('makes game playable again after win', () => {
    render(<App />);
    const nonMinedCell = within(screen.getByTestId("game")).getAllByRole("button")[0];
    const reset = screen.getByTestId("reset");

    NON_MINED_CELLS.forEach((cellIndex) => {
      fireEvent.click(within(screen.getByTestId("game")).getAllByRole("button")[cellIndex]);
    });
    fireEvent.click(reset);
    fireEvent.click(nonMinedCell);

    expect(screen.getByText("2")).toBeInTheDocument();
  })
})

describe("clicking mined cell", () => {
  test('shows loss text', () => {
    render(<App />);
    const minedCell = within(screen.getByTestId("game")).getAllByRole("button")[1];
    fireEvent.click(minedCell);
    expect(screen.getByText("You lost!")).toBeInTheDocument();
  });

  test('cannot continue playing', () => {
    render(<App />);
    const minedCell = within(screen.getByTestId("game")).getAllByRole("button")[1];
    const nonMinedCell = within(screen.getByTestId("game")).getAllByRole("button")[0];

    fireEvent.click(minedCell);
    fireEvent.click(nonMinedCell);

    expect(screen.queryByText(FIRST_VALUE)).not.toBeInTheDocument();
  });

  test('reveals all mines', () => {
    render(<App />);
    const minedCell = within(screen.getByTestId("game")).getAllByRole("button")[1];

    fireEvent.click(minedCell);

    expect(screen.queryAllByText("X").length).toBe(5);
  });
})

describe('clicking blank cell', () => {
  test.todo('reveals all connected non-mined cells');
});

describe('winning game', () => {
  test('shows win text', () => {
    render(<App />);

    NON_MINED_CELLS.forEach((cellIndex) => {
      fireEvent.click(within(screen.getByTestId("game")).getAllByRole("button")[cellIndex]);
    });

    expect(screen.getByText("You won!")).toBeInTheDocument();
  })

  test('reveals all mines', () => {
    render(<App />);
    const minedCell = within(screen.getByTestId("game")).getAllByRole("button")[1];

    NON_MINED_CELLS.forEach((cellIndex) => {
      fireEvent.click(within(screen.getByTestId("game")).getAllByRole("button")[cellIndex]);
    });
    fireEvent.click(minedCell);

    expect(screen.queryAllByText('X').length).toBe(5);
  })
})
