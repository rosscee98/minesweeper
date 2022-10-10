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

  test('sets flagging mode to off', () => {
    render(<App />);
    const flagButton = screen.getByRole("button", { name: "Flag" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    fireEvent.click(flagButton);
    fireEvent.click(resetButton);

    expect(screen.queryByText("Flagging on")).not.toBeInTheDocument();
    expect(screen.getByText("Flagging off")).toBeInTheDocument();
  });
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
  test('shows no value', () => {
    render(<App />);
    const blankCell = within(screen.getByTestId("game")).getAllByRole("button")[4];

    fireEvent.click(blankCell);

    expect(blankCell).not.toHaveTextContent("0");
  });

  test('reveals all connected non-mined cells', () => {
    render(<App />);
    const nonNumberedCell = within(screen.getByTestId("game")).getAllByRole("button")[4];

    fireEvent.click(nonNumberedCell);

    expect(screen.queryAllByText("2").length).toBe(2);
    expect(screen.queryAllByText("3").length).toBe(3);
  });
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
});

describe('flagging', () => {
  test('clicking flag button toggles flagging label', () => {
    render(<App />);
    const flagButton = screen.getByRole("button", { name: "Flag" });
    let flaggingOffLabel = screen.queryByText("Flagging off");
    let flaggingOnLabel = screen.queryByText("Flagging on");

    expect(flagButton).toBeInTheDocument();
    expect(flaggingOffLabel).toBeInTheDocument();
    expect(flaggingOnLabel).not.toBeInTheDocument();

    fireEvent.click(flagButton);
    flaggingOffLabel = screen.queryByText("Flagging off");
    flaggingOnLabel = screen.queryByText("Flagging on");

    expect(flaggingOffLabel).not.toBeInTheDocument();
    expect(flaggingOnLabel).toBeInTheDocument();

    fireEvent.click(flagButton);
    flaggingOffLabel = screen.queryByText("Flagging off");
    flaggingOnLabel = screen.queryByText("Flagging on");

    expect(flaggingOffLabel).toBeInTheDocument();
    expect(flaggingOnLabel).not.toBeInTheDocument();
  });

  test('clicking cell creates flag without revealing cell value', () => {
    render(<App />);
    const flagButton = screen.getByRole("button", { name: "Flag" });
    const cell = screen.getByTestId("cell-A1");

    fireEvent.click(flagButton);
    fireEvent.click(cell);

    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  })

  test('clicking flag removes it', () => {
    render(<App />);
    const flagButton = screen.getByRole("button", { name: "Flag" });
    const cell = screen.getByTestId("cell-A1");

    fireEvent.click(flagButton);
    fireEvent.click(cell);
    fireEvent.click(cell);

    expect(screen.queryByText("F")).not.toBeInTheDocument();
  });

  // how to check this? a flagged cell, when clicked, still has content 'F'
  test('cannot click flagged cell', () => {
    render(<App />);
    const flagButton = screen.getByRole("button", { name: "Flag" });
    const minedCell = screen.getByTestId("cell-A2");

    fireEvent.click(flagButton);
    fireEvent.click(minedCell);
    fireEvent.click(flagButton);
    fireEvent.click(minedCell);

    expect(screen.queryAllByText("X").length).toBe(0);
  });

  test('cannot flag clicked cell', () => {
    render(<App />);
    const flagButton = screen.getByRole("button", { name: "Flag" });
    const cell = screen.getByTestId("cell-A1");

    fireEvent.click(cell);
    fireEvent.click(flagButton);
    fireEvent.click(cell);

    expect(screen.queryByText("F")).not.toBeInTheDocument();
  });
})

// describe('value colours', () => {
//   test.todo('1 is blue')
//   test('2 is green', () => {
//     render(<App />);
//     let cellWithValue2 = screen.getByTestId("cell-A1");

//     fireEvent.click(cellWithValue2);

//     cellWithValue2 = screen.getByTestId("cell-A1");

//     expect(cellWithValue2).toHaveStyle(`color: green`);
//   })
//   test.todo('3 is red')
//   test.todo('4 is purple')
//   test.todo('5 is darkred')
// })
