import Choice from "./Choice"

export default function Question(props){
    function createChoiceElements(){
        return props.choices.map(choice => {
            return <Choice 
            id={choice.id} 
            questionId={choice.parentQuestionId} 
            choice={choice.choice} 
            isSelected={choice.isSelected}
            selectChoice={choice.selectChoiceFunc}
            showAnswer={choice.showAnswer}
            correctChoice={choice.correctChoice} 
            key={choice.id}/>
        })
           
    }
    return (
    <div className="question">
        <h2 className="question--text">{props.question}</h2>
        <div className="question--choices">
            {createChoiceElements()}
        </div>
        <hr className="question--line"/>
    </div>
    )}