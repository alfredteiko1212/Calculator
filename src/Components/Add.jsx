import React, { useReducer } from 'react'

const Add = () => {
    const reducer=(state,action)=>{
        if(action.type === 'buy_a_meal') return {money:state.money - 10}
        if(action.type === 'sell_a_meal') return {money:state.money + 10}
        if(action.type === 'celebrity here') return {money:state.money + 0}
    }

    const initialState={money:100};
    const [state, dispatch] =useReducer(reducer,initialState)

  return (
    <div>
        <h1>Wallet:{money.state}</h1>
        <button onClick={()=> dispatch( {type: 'buy_a_meal'})}>Shopping for veggies!</button>
        <button onClick={()=> dispatch( {type: 'sell_a_meal'})}>Serve a customer</button>
        <button onClick={()=> dispatch( {type: 'celebrity here'})}> There's a celebrity here</button>
    </div>
  )
}

export default Add