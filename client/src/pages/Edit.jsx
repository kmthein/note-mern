import React from 'react'
import NoteForm from '../components/NoteForm'

const Edit = () => {
  return (
    <div className='px-[20%]'>
        <NoteForm isCreate={false} />
    </div>
  )
}

export default Edit