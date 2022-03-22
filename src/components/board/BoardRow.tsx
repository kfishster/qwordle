import { Constants } from "../Constants";
import { Guess, LetterSubstring } from "../models/Guess";
import { BoardCell } from "./BoardCell";

type Props = {
    showSubstrings: boolean;
    guess?: Guess;
    currentGuess?: string[];
    smallDemo?: boolean;
    gameFinished: boolean;
    showWordNotFound?: boolean;
    finishedAnimation?: () => void;
};

function shouldRenderSubstring(guess: Guess, sub: LetterSubstring) {
    return !Array.from(Array(sub.length).keys()).every(j => guess.letters[sub.idx + j].inPosition);
}

function renderGuess(guess: Guess, showSubstrings: boolean, smallDemo: boolean | undefined) {
    const row = [];
    for (var i = 0; i < guess.letters.length; i++) {
        const sub = guess.substringsByIndex.get(i);
        if (showSubstrings && guess.substringsByIndex.has(i)) {
            if (sub != null && shouldRenderSubstring(guess, sub)) {
                // eslint-disable-next-line no-loop-func
                const combinedCells = Array.from(Array(sub.length).keys()).map(j => <BoardCell key={j} smallDemo={smallDemo} letterGuess={guess.letters[i+j]}/>);

                row.push(<div key={i} className={`flex flex-row gap-2 ${Constants.substringBackground}`}>
                    {combinedCells}
                </div>)
                i += sub.length - 1;
            }
            else {
                row.push(<BoardCell key={i} smallDemo={smallDemo} letterGuess={guess.letters[i]}/>)                
            }
        }
        else {
            row.push(<BoardCell key={i} smallDemo={smallDemo} letterGuess={guess.letters[i]}/>)
        }
    }
    return row;
}
  
export const BoardRow = ({ showSubstrings, smallDemo, guess, currentGuess, gameFinished, showWordNotFound, finishedAnimation}: Props) => {
    const cells = Constants.wordLength;
    
    const emptyRow = Array.from(Array(cells).keys()).map(i => <BoardCell key={i} smallDemo={smallDemo}/>);
    
    return (
        <div className={`flex flex-row justify-center ${smallDemo ? "gap-1" : "gap-2"} ${showWordNotFound ? "animate-wiggle" : ""}`} onAnimationEnd={finishedAnimation}>
            { guess == null 
                ? (currentGuess == null 
                    ? emptyRow 
                    : Array.from(Array(cells).keys()).map(i => 
                        i < currentGuess.length 
                        ? <BoardCell key={i} smallDemo={smallDemo} currentGuessLetter={currentGuess.at(i)}/> 
                        : ( 
                            i === currentGuess.length 
                            ? <BoardCell key={i} smallDemo={smallDemo} cursor={!gameFinished}/> 
                            : <BoardCell key={i} smallDemo={smallDemo} />
                        )
                    )
                ) 
                : renderGuess(guess, showSubstrings, smallDemo)
            }
        </div>
    );
};