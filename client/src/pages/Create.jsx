import React from 'react'
import NoteForm from '../components/NoteForm'

const Create = () => {
  return (
    <div className='px-[20%]'>
        <NoteForm isCreate={true} />
    </div>
  )
}

export default Create