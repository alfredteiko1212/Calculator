import React, { useReducer } from 'react'; // Import React and useReducer hook
import DigitButton from './Components/DigitButton'; // Import DigitButton component
import OperationButton from './Components/OperationButton'; // Import OperationButton component
import './styles.css'; // Import styles

// Define actions for the reducer
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

// Reducer function to handle state changes based on action types
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) { // If overwrite flag is true, reset the current operand
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      } 
      if (payload.digit === '0' && state.currentOperand === '0') return state; // Prevent multiple leading zeros
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state; // Prevent multiple decimals
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`, // Append digit to current operand
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state; // Ignore if no operands
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation, // Change operation if only operation is clicked
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation, // Set operation and move current operand to previous operand
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state), // Evaluate current operation and set result as previous operand
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {}; // Clear all state
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }; // Delete last digit or reset current operand
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1), // Remove last digit
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state; // Ignore if evaluation is not possible
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state), // Evaluate and set result as current operand
      };
    default:
      return state;
  }
}

// Function to perform the actual calculation
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand); // Convert previous operand to float
  const current = parseFloat(currentOperand); // Convert current operand to float
  if (isNaN(prev) || isNaN(current)) return ''; // Return empty string if operands are not numbers
  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '÷':
      computation = prev / current;
      break;
    case '*':
      computation = prev * current;
      break;
    default:
      return '';
  }
  return computation.toString(); // Convert result to string
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

// Function to format the operand
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer); // Format integer part
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; // Format with decimal part
}

// Main App component
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <>
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operand'>
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch} />
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />
        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />
        <DigitButton digit='.' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
          =
        </button>
      </div>
    </>
  );
}

export default App; // Export the App component