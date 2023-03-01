import React from "react"



export default function Dice(props){

    const styling = {
        backgroundColor: props.locked? "#59E391" : "#FFFFFF"
    }

    return <div className="dice"
             style={styling}
             onClick={props.handleClick}
             > {props.value} </div>
}