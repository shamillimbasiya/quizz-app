export default function Choice(props){
    // console.log(props.showAnswer)
    function setClassName(){
        if(props.showAnswer){
            if(props.correctChoice){
                return "question--choice correct"
            } else if(props.isSelected && !props.correctChoice){
                return "question--choice wrong"
            } else {
                return "question--choice not-choosen"
            }
        } else {
            return (props.isSelected) ? 
            "question--choice selected" : "question--choice"
        }
        
    }

    return (
        <p className={setClassName()}
            onClick={() => props.selectChoice(props.id, props.questionId)}>{props.choice} </p>
    )
}