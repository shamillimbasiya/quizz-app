import Startscreen from "./components/Starscreen";
import React from 'react';
import Question from "./components/Question";
import {nanoid} from "nanoid"

function App() {

  const [play, setplay] = React.useState(false);
  const [start, setStart] = React.useState(false)
  const [questions, setQuestions] = React.useState([])
  const [showAnswer, setShowAnswer] = React.useState(false)

  React.useEffect(() => {
    async function getQuestions(){
      const response = await fetch("https://opentdb.com/api.php?amount=5&category=9")
      const data = await response.json()
      // console.log(data)
      if(data.response_code === 0){
        setQuestions(data.results.map(question => {
          const questionId = nanoid()
          return {
            id: questionId,
            question: format(question.question),
            choices: createChoiceObjects(question.incorrect_answers, question.correct_answer, question.type, questionId)
          }
        } ))}
    }

    function createChoiceObjects(incorrectChoices, correctChoice, questionType,questionId){
      const choices = createChoicesArray(incorrectChoices,correctChoice, questionType)
      const choiceObjects = choices.map(choice => {
          return {
            id: nanoid(),
            parentQuestionId : questionId,
            choice: format(choice),
            isSelected: false,
            selectChoiceFunc: selectChoice,
            correctChoice: correctChoice === choice ? true: false,
            showAnswer: false
          }
      })
      return choiceObjects
    }

    if(play){
      getQuestions()
    }

  }, [play])


  function createChoicesArray(incorrectChoices, correctChoice, questionType){
    const unshuffledChoices = [...incorrectChoices, correctChoice]
    if(questionType === 'boolean'){
        return ["True", "False"]
    }
    const shuffledChoices = unshuffledChoices
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    return shuffledChoices
}

  function format(string){
    let oldStringFormat = string
    let newStringFormat = oldStringFormat.replace(/&quot;/g, '"')
    newStringFormat = newStringFormat.replace(/&#039;/g, `'`)
    newStringFormat = newStringFormat.replace(/&amp;/g, "&")
    newStringFormat = newStringFormat.replace(/&rsquo;/g, ":")
    newStringFormat = newStringFormat.replace(/&ldquo;/g, '"')
    newStringFormat = newStringFormat.replace(/&rdquo;/g, '"')
    newStringFormat = newStringFormat.replace(/&iacute;/g, "í")
    newStringFormat = newStringFormat.replace(/&ouml;/g, "ö");
    newStringFormat = newStringFormat.replace(/&Ouml;/g, "ö");
    newStringFormat = newStringFormat.replace(/&auml;/g, "ä")
    newStringFormat = newStringFormat.replace(/&Auml;/g, "ä")
    newStringFormat = newStringFormat.replace(/&aring;/g, "å");
    newStringFormat = newStringFormat.replace(/&Aring;/g, "");
    newStringFormat = newStringFormat.replace(/&hellip;/g, "…");
    newStringFormat = newStringFormat.replace(/&shy;/g, "\n");
    newStringFormat = newStringFormat.replace(/&lrm;/g, "");
    newStringFormat = newStringFormat.replace(/&oacute;/g, "ó");
    return newStringFormat
  }

  
  function generateQuestions(){
    const questionElements = questions.map(question => {
      return <Question question={question.question} 
              choices={question.choices}
              isSelected={question.isSelected}
              key={question.id}/>
    })
    return questionElements
  }

  
  function selectChoice(id, questionId){
    setQuestions(oldQuestions => oldQuestions.map(question => 
    {
      return question.id !== questionId ? question : 
      {...question, choices: question.choices.map(choice => 
        {
        return choice.id === id ? 
          {...choice, isSelected: !choice.isSelected} : 
          {...choice, isSelected: false}
      })}
    }))
  }

  function showAnswers(){
    setShowAnswer(true)
    setQuestions(oldQuestions => oldQuestions.map(question => {
      return {...question, choices: question.choices.map(choice => {
        return {...choice, showAnswer: true}
      })}
    }))
    setplay(false)
  }

  function playAgain(){
    setplay(true)
    setShowAnswer(false)
  }

  function countAmountCorrectAnswers(){
    let count = 0;
    questions.forEach((question) => {
      question.choices.forEach((choice) => {
        if (choice.isSelected && choice.correctChoice){
          count++
        }
      })
    })
    return count
  }
  

  function quizScreen(){
    return(
      <div className="quizscreen--container">
        <div>
          {generateQuestions()} 
        </div>
        <svg className="quizscreen--blob1" xmlns="http://www.w3.org/2000/svg" width="126" height="131" viewBox="0 0 126 131" fill="none">
          <path d="M63.4095 71.3947C35.1213 40.8508 -2.68211 11.7816 1.17274 -29.6933C5.43941 -75.599 39.854 -115.359 82.4191 -133.133C122.797 -149.994 170.035 -140.256 205.822 -115.149C235.947 -94.0141 236.823 -53.8756 246.141 -18.271C256.17 20.0508 282.521 60.8106 260.501 93.7792C237.538 128.159 188.991 133.432 147.931 128.768C112.318 124.723 87.7505 97.6768 63.4095 71.3947Z" fill="#FFFAD1"/>
        </svg>

        <div className="btn--container">
          {showAnswer && <p className="correct--amount">
            {`You scored ${countAmountCorrectAnswers()}/5 correct answers`}</p>}
          <button className="check-btn"
                  onClick={showAnswer ? playAgain : showAnswers}
          >{showAnswer ? "Play again":"Check answers"}
          </button>
        </div>
        

        <svg className="quizscreen--blob2" xmlns="http://www.w3.org/2000/svg" width="65" height="62" viewBox="0 0 65 62" fill="none">
          <path d="M-38.919 2.96445C-10.8241 1.07254 20.4975 -5.87426 40.8434 11.5469C63.3629 30.8293 69.9281 62.0589 61.4141 88.8747C53.3376 114.313 28.2818 132.992 -0.0909882 140.475C-23.9759 146.775 -45.6063 132.093 -68.3914 123.11C-92.9153 113.441 -125.606 110.575 -133.794 87.7612C-142.333 63.9714 -124.677 39.0277 -104.912 21.3621C-87.7687 6.03978 -63.0936 4.59238 -38.919 2.96445Z" fill="#DEEBF8"/>
        </svg>
      </div>
    )}

  return (
    <div className="app">
      {start ?  quizScreen(): 
      <Startscreen handleStartClick={() => {
        setStart(true)
        setplay(true)  
      }
        }/>}
    </div>
  );
}

export default App;
