import React from "react";
import Header from "components/Appointment/Header";
import Status from "components/Appointment/Status";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Confirm from "components/Appointment/Confirm";
import Form from "components/Appointment/Form";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode"
import "components/Appointment/styles.scss";


export default function Appointment(props){

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

 //transition will be changing the mode from one state to a newer state, whereas back will be transitioning to previous state

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
    
  );
 

  function save(name, interviewer) {
    //function to save the name of student and the interviewer
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then( () => {
      transition(SHOW);
    })
    .catch(error => transition(ERROR_SAVE, true));
  };

  function deleting(event){
    //function for deleting the show item
    transition(DELETE, true);
    props
     .cancelInterview(props.id)
     .then(() => transition(EMPTY))
     .catch(error => transition(ERROR_DELETE, true));
   }

  function editing() {
  //for editing where a user will be able to change the name and interviewer
    transition(EDIT);
   
  }
  
  return ( 
    <>
    <article className="appointment" data-testid="appointment">

    <Header time={props.time}/>

    {mode === CREATE && <Form onAdd={() => transition(CREATE)} interviewers={props.interviewers} onCancel={ () => back()} onSave={ save }/>}

    {mode === EDIT && <Form onSave={ save } studentName={props.interview.student} selectedInterviewerId={props.interview.interviewer.id} interviewers={props.interviewers} />}

    {mode === DELETE && <Status message = "Deleting"/>}

    {mode === CONFIRM && <Confirm onCancel={() => back()} onConfirm = {() => deleting()} message="Are you sure you would like to delete?"/> }

    {(mode === EMPTY) &&  <Empty onAdd={() => transition(CREATE)} />}
    {mode === ERROR_DELETE && <Error message="Could not cancel appointment" onClose={() => back()} />}

    {mode === ERROR_SAVE && <Error message="Could not book appointment" onClose={() => back()}/>}

    {mode === SAVING && <Status message = "Saving" />}
   
    {mode === SHOW && (
    <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      onDelete={() =>  transition(CONFIRM) }
      onEdit={() => editing() }
    />
 
  )}
  </article>
   </>
)

}


